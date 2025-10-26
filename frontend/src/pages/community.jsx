import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postService } from "../services/post";
import PostCard from "../components/post/PostCard";

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState("ALL");
  const [loading, setLoading] = useState(false);

  const categories = ["ALL", "PROUD", "QUESTION", "ADOPT", "TIP"];

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await postService.getAllPosts();
        const data = res.content || res;
        setPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredPosts =
    category === "ALL"
      ? posts
      : posts.filter((p) => p.category?.toUpperCase() === category);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">커뮤니티</h1>
        {/* 카테고리 탭 */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`cursor-pointer text-sm font-semibold rounded-full px-4 py-2 border shadow-sm transition-all duration-200
        ${
          category === cat
            ? cat === "PROUD"
              ? "text-green-800 bg-green-200 border-green-200"
              : cat === "QUESTION"
              ? "text-yellow-800 bg-yellow-200 border-yellow-200"
              : cat === "ADOPT"
              ? "text-pink-800 bg-pink-200 border-pink-200"
              : cat === "TIP"
              ? "text-blue-800 bg-blue-200 border-blue-200"
              : "text-gray-800 bg-gray-200 border-gray-200"
            : cat === "PROUD"
            ? "text-green-800 bg-white border-green-200 hover:bg-green-50"
            : cat === "QUESTION"
            ? "text-yellow-800 bg-white border-yellow-200 hover:bg-yellow-50"
            : cat === "ADOPT"
            ? "text-pink-800 bg-white border-pink-200 hover:bg-pink-50"
            : cat === "TIP"
            ? "text-blue-800 bg-white border-blue-200 hover:bg-blue-50"
            : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50"
        }`}
            >
              {cat === "ALL"
                ? "전체"
                : cat === "PROUD"
                ? "자랑"
                : cat === "QUESTION"
                ? "질문"
                : cat === "ADOPT"
                ? "입양"
                : "팁"}
            </button>
          ))}
        </div>

        {/* 포스트 목록 */}
        {loading ? (
          <p className="text-gray-500">로딩 중...</p>
        ) : filteredPosts.length === 0 ? (
          <p className="text-gray-500">해당 카테고리에 게시글이 없습니다.</p>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* ✅ 오른쪽 하단 플로팅 버튼 */}
        <button
          onClick={() => navigate("/community/write")}
          className="fixed bottom-10 right-10 bg-green-500 hover:bg-green-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg text-3xl"
          title="새 글 작성"
        >
          ✏️
        </button>
      </div>
    </div>
  );
}
