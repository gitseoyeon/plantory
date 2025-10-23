import React, { useEffect, useState } from "react";
import FeedCard from "../components/FeedCard";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import PlantRegister from "./plantRegister";
import PlantList from "../components/userplant/PlantList";
import userplantService from "../services/userplant";
import AllPlantList from "../components/feed/AllPlantList";
import Sidebar from "../components/sidebar";
import logoAnimal from "../assets/logo_animal.png";
import { postService } from "../services/post";

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const [newPlant, setNewPlant] = useState(null);
  const [feeds, setFeeds] = useState([]);
  const [posts, setPosts] = useState([]); // ✅ 커뮤니티 게시글 상태
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  // ✅ 일지 목록 불러오기
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const data = await userplantService.getAllPlants(0, 10);
        setFeeds(data.content || []);
      } catch (err) {
        console.error("❌ 일지 목록 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlants();
  }, []);

  // ✅ 커뮤니티 게시글 불러오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postService.getAllPosts();
        // 배열/페이지 응답 모두 대응
        const list = Array.isArray(data)
          ? data
          : data?.content ?? data?.items ?? [];
        setPosts((list || []).slice(0, 5));
        console.log("🧩 posts 응답 형태:", data);
      } catch (err) {
        console.error("❌ 커뮤니티 게시글 불러오기 실패:", err);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* 상단 배너 */}
      <div className="bg-green-50 py-10 mx-8 mt-8 shadow-sm border border-gray-200 rounded-2xl flex items-center justify-center gap-8 px-8">
        <img
          src={logoAnimal}
          alt="로고 이미지"
          className="w-40 h-40 object-contain"
        />
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">
            오늘의 성장, 모두와 함께 기록해요 🌱
          </h1>
          <p className="text-gray-700 mt-2">
            피드에서 친구들의 성장 일지를 구경하고, 내 기록을 공유해요.
          </p>
          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  navigate("/login");
                  return;
                }
                setShowPopup(true);
              }}
              className="bg-green-500 text-white font-semibold px-5 py-2 rounded-lg hover:bg-green-600 transition-all"
            >
              ✏️ 일지 작성
            </button>
            <button
              onClick={() => navigate("/community")}
              className="border border-green-500 text-green-600 font-semibold px-5 py-2 rounded-lg hover:bg-green-50 transition-all"
            >
              💬 커뮤니티
            </button>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 및 사이드바 */}
      <div className="relative flex justify-start max-w-10xl mx-auto px-8 gap-8">
        <div className="flex-1 py-10 space-y-12">
          {/* 전체 성장 일지 미리보기 */}
          <section>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  🌿 전체 성장 일지 미리보기
                </h2>
                <button
                  onClick={() => navigate("/growth")}
                  className="text-green-600 font-medium hover:underline"
                >
                  더보기 →
                </button>
              </div>
              <AllPlantList newPlant={newPlant} />
            </div>
          </section>

          {/* 커뮤니티 미리보기 */}
          <section>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  💬 커뮤니티 인기글
                </h2>
                <button
                  onClick={() => navigate("/community")}
                  className="text-green-600 font-medium hover:underline"
                >
                  더보기 →
                </button>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="divide-y divide-gray-200">
                  {posts.length > 0 ? (
                    posts.map((post) => (
                      <div
                        key={post.id}
                        className="flex justify-between items-center p-3 hover:bg-gray-50 cursor-pointer transition-all"
                        onClick={() => navigate(`/community/${post.id}`)}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className={`text-xs font-medium rounded px-2 py-0.5 flex-shrink-0 border
                              ${
                                post.category === "PROUD"
                                  ? "text-green-700 bg-green-100 border-green-200" // 자랑
                                  : post.category === "QUESTION"
                                  ? "text-yellow-700 bg-yellow-100 border-yellow-200" // 질문
                                  : post.category === "ADOPT"
                                  ? "text-pink-700 bg-pink-100 border-pink-200" // 입양
                                  : post.category === "TIP"
                                  ? "text-blue-700 bg-blue-100 border-blue-200" // 팁
                                  : "text-gray-700 bg-gray-100 border-gray-200"
                              }`}
                          >
                            {post.category || "일반"}
                          </span>
                          <p className="font-medium text-gray-800 truncate max-w-[420px] hover:underline hover:font-semibold transition-all">
                            {post.title}
                          </p>
                          <p className="text-sm text-gray-500 flex-shrink-0">
                            [{post.commentCount ?? 0}]
                          </p>
                        </div>
                        <div className="text-sm text-gray-400 flex items-center gap-2">
                          <span className="truncate">
                            {post.user?.nickName || "익명"}
                          </span>
                          <span className="text-gray-300">|</span>
                          <span>
                            {post.likeCount
                              ? post.likeCount.toLocaleString()
                              : 0}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-gray-500 text-center">
                      게시글이 없습니다.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* 사이드바 */}
        <div className="w-80 h-auto rounded-xl self-start mt-10">
          <Sidebar />
        </div>
      </div>

      {/* 팝업 */}
      {showPopup && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPopup(false);
          }}
        >
          <PlantRegister
            onClose={() => setShowPopup(false)}
            onSuccess={(plant) => setNewPlant(plant)}
          />
        </div>
      )}
    </div>
  );
}
