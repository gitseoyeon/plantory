import React, { useEffect, useState, useRef } from "react";
import { getAllPlants } from "../services/plant";
import {
  getNotifications,
  markAsRead,
  deleteNotification,
  deleteAllNotifications,
} from "../services/notification";
import { Trash2 } from "lucide-react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

export default function Sidebar() {
  const [plants, setPlants] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const storedUser = localStorage.getItem("user");
  const userId = storedUser ? JSON.parse(storedUser).id : null;
  const stompClient = useRef(null);
  const connected = useRef(false);

  // 🌱 식물 & 알림 초기 로드
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const allPlants = await getAllPlants();
        const shuffled = allPlants.sort(() => 0.5 - Math.random());
        setPlants(shuffled.slice(0, 3));
      } catch (err) {
        console.error("❌ 식물 백과사전 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (err) {
        console.error("❌ 알림 불러오기 실패:", err);
      }
    };

    fetchPlants();
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (!userId) return;

    // ✅ 중복 연결 방지 플래그
    if (stompClient.current?.connected || connected.current) {
      console.log("⚠️ 이미 WebSocket이 연결되어 있음 — 중복 구독 방지");
      return;
    }

    // 먼저 알림을 불러온 후 WebSocket 연결
    getNotifications()
      .then((data) => {
        setNotifications(data);

        const socket = new SockJS(`${import.meta.env.VITE_API_URL}/ws`);
        const client = Stomp.over(socket);
        stompClient.current = client;

        client.connect(
          {},
          () => {
            if (connected.current) return; // ✅ 두 번째 구독 차단
            connected.current = true;

            console.log("✅ WebSocket 연결 성공");
            client.subscribe(`/topic/notifications/${userId}`, (msg) => {
              const newNotif = JSON.parse(msg.body);
              console.log("📩 새 알림 수신:", newNotif);
              setNotifications((prev) => [newNotif, ...prev]);
            });
          },
          (error) => console.error("❌ WebSocket 연결 실패:", error)
        );
      })
      .catch((err) => console.error("❌ 알림 불러오기 실패:", err));

    return () => {
      if (stompClient.current && stompClient.current.connected) {
        stompClient.current.disconnect(() => {
          console.log("🔌 WebSocket 연결 해제");
          connected.current = false;
        });
      }
    };
  }, [userId]);

  // ✅ 단일 알림 삭제
  const handleDelete = async (id) => {
    if (!window.confirm("이 알림을 삭제하시겠습니까?")) return;
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("❌ 알림 삭제 실패:", err);
    }
  };

  // ✅ 전체 알림 삭제
  const handleDeleteAll = async () => {
    if (!window.confirm("모든 알림을 삭제하시겠습니까?")) return;
    try {
      await deleteAllNotifications();
      setNotifications([]);
    } catch (err) {
      console.error("❌ 전체 알림 삭제 실패:", err);
    }
  };

  const handleRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("❌ 읽음 처리 실패:", err);
    }
  };

  if (loading)
    return (
      <div className="bg-white rounded-xl shadow-sm p-5 text-gray-500">
        불러오는 중...
      </div>
    );

  return (
    <div className="space-y-10">
      {/* 🌿 식물 백과사전 */}
      <section className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <h3 className="font-semibold text-lg mb-3">📌 식물 정보</h3>
        <ul className="space-y-3">
          {plants.map((p) => (
            <li
              key={p.id}
              className="flex items-center space-x-3 border-b border-gray-100 pb-3 last:border-0"
            >
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-green-50">
                {p.imageUrl ? (
                  <img
                    src={p.imageUrl}
                    alt={p.koreanName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-green-100"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">
                  {p.commonName || "이름 없음"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {p.scientificName || "학명 없음"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {p.origin ? `원산지: ${p.origin}` : ""}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* 🔔 알림 목록 */}
      <section className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-lg">🔔 알림</h3>
          {notifications.length > 0 && (
            <button
              onClick={handleDeleteAll}
              className="text-sm text-gray-500 hover:text-red-500 transition"
            >
              전체 삭제
            </button>
          )}
        </div>

        {!userId ? (
          <p className="text-gray-500 text-sm">로그인 후 이용 가능합니다.</p>
        ) : notifications.length === 0 ? (
          <p className="text-gray-500 text-sm">새로운 알림이 없습니다.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {notifications.map((n) => {
              const isComment = n.content.includes("댓글");
              const isLike = n.content.includes("좋아요");

              return (
                <li
                  key={n.id}
                  className={`flex justify-between items-center py-3 px-2 hover:bg-gray-50 transition ${
                    n.read ? "text-gray-400" : "text-gray-800 font-semibold"
                  }`}
                >
                  {/* 내용 */}
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => handleRead(n.id)}
                  >
                    <span className="truncate flex items-center gap-1">
                      {isComment && <span className="text-blue-400">💬</span>}
                      {isLike && <span className="text-red-400">❤️</span>}
                      <span>{n.content}</span>
                    </span>
                    <span className="block text-xs text-gray-400 ml-1">
                      {new Date(n.createdAt).toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* 휴지통 버튼 */}
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="ml-3 text-gray-400 hover:text-red-500 transition"
                    title="삭제"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
