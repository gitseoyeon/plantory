import React, { useEffect, useState, useRef } from "react";
import { getAllPlants } from "../services/plant";
import { getNotifications, markAsRead } from "../services/notification";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

export default function Sidebar() {
  const [plants, setPlants] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const storedUser = localStorage.getItem("user");
  const userId = storedUser ? JSON.parse(storedUser).id : null;

  const stompClient = useRef(null);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const allPlants = await getAllPlants();
        const shuffled = allPlants.sort(() => 0.5 - Math.random());
        const randomThree = shuffled.slice(0, 3);
        setPlants(randomThree);
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

  // 🌐 WebSocket 연결 (STOMP)
  useEffect(() => {
    if (!userId) {
      console.warn("⚠️ userId가 없음 — WebSocket 구독 생략");
      return;
    }

    const socket = new SockJS(`${import.meta.env.VITE_API_URL}/ws`);
    stompClient.current = Stomp.over(socket);

    stompClient.current.connect({}, () => {
      console.log("✅ WebSocket 연결 성공");
      console.log("📡 구독 경로:", `/topic/notifications/${userId}`);

      stompClient.current.subscribe(`/topic/notifications/${userId}`, (msg) => {
        console.log("📩 새 알림 수신:", msg.body);
        const newNotif = JSON.parse(msg.body);
        setNotifications((prev) => [newNotif, ...prev]);
      });
    });

    return () => {
      if (stompClient.current && stompClient.current.connected) {
        stompClient.current.disconnect(() => {
          console.log("🔌 WebSocket 연결 해제");
        });
      }
    };
  }, [userId]);

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
    <div className="space-y-6">
      {/* 🌿 식물 백과사전 */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-semibold text-lg mb-3">📌 식물 정보</h3>
        <ul className="space-y-3">
          {plants.map((p) => (
            <li
              key={p.id}
              className="flex items-center space-x-3 border-b border-gray-100 pb-3 last:border-0"
            >
              <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-green-50">
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
                  {p.koreanName || "이름 없음"}
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
      </div>

      {/* 🔔 알림 목록 */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-semibold text-lg mb-3">🔔 알림</h3>

        {notifications.length === 0 ? (
          <p className="text-gray-500 text-sm">새로운 알림이 없습니다.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {notifications.map((n) => {
              const isComment = n.content.includes("댓글");
              const isLike = n.content.includes("좋아요");

              return (
                <li
                  key={n.id}
                  onClick={() => handleRead(n.id)}
                  className={`cursor-pointer py-3 px-2 rounded-md hover:bg-gray-50 transition
          ${n.read ? "text-gray-400" : "text-gray-800 font-semibold"}
        `}
                >
                  <div className="flex justify-between items-center">
                    {/* 아이콘 + 내용 */}
                    <span className="truncate flex items-center gap-1">
                      {isComment && <span className="text-blue-400">💬</span>}
                      {isLike && <span className="text-red-400">❤️</span>}
                      <span>{n.content}</span>
                    </span>

                    {/* 시간 */}
                    <span className="text-xs text-gray-400 ml-2">
                      {new Date(n.createdAt).toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
