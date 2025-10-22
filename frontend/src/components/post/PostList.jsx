import { useEffect, useState } from "react";
import usePostStore from "../../store/postStore";
import PostCard from "./PostCard";

const CATEGORIES = [
  { value: "ALL", label: "전체" },
  { value: "PROUD", label: "자랑" },
  { value: "QUESTION", label: "질문" },
  { value: "TIP", label: "팁" },
  { value: "ADOPT", label: "입양" },
];

const PostList = () => {
  const { posts, fetchAllPosts, deletePost, loading } = usePostStore();
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  useEffect(() => {
    fetchAllPosts();
  }, [fetchAllPosts]);

  if (loading) return <p className="text-center text-gray-500 mt-10">Loading...</p>;

  const filteredPosts =
    selectedCategory === "ALL"
      ? posts
      : posts.filter((p) => p.category === selectedCategory);

  const handleDelete = async (postId) => {
    if (!window.confirm("정말 이 게시글을 삭제하시겠습니까?")) return;
    try {
      await deletePost(postId);
      await fetchAllPosts();
    } catch (err) {
      console.error("게시글 삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* 제목 */}
      <h2 className="text-3xl font-bold text-gray-800 mb-6">🌿 커뮤니티 게시판</h2>

      {/* ✅ 카테고리 필터 */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
              selectedCategory === cat.value
                ? "bg-green-500 text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-green-100"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ✅ 게시글 목록 */}
      {filteredPosts.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          등록된 게시글이 없습니다 😢
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;
