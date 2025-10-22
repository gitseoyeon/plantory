import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { postService } from "../../services/post";

export default function PostForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const editingPost = location.state?.post; // ✨ 수정 모드 데이터 받기

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "PROUD",
  });
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: "PROUD", label: "자랑" },
    { value: "QUESTION", label: "질문" },
    { value: "ADOPT", label: "입양" },
    { value: "TIP", label: "팁" },
  ];

  // ✅ 수정 모드 시 기존 데이터 채우기
  useEffect(() => {
    if (editingPost) {
      setFormData({
        title: editingPost.title,
        content: editingPost.content,
        category: editingPost.category || "PROUD",
      });
    }
  }, [editingPost]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    setLoading(true);
    try {
      if (editingPost) {
        await postService.updatePost(editingPost.id, formData);
        alert("게시글이 수정되었습니다!");
        navigate(`/posts/${editingPost.id}`);
      } else {
        await postService.createPost(formData);
        alert("게시글이 등록되었습니다!");
        navigate("/posts");
      }
    } catch (err) {
      console.error(err);
      alert("처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        {editingPost ? "게시글 수정" : "새 글 작성"}
      </h2>

      <div className="mb-4">
        <label className="block font-semibold mb-1">제목</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="제목을 입력하세요"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">카테고리</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          {categories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-1">내용</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 h-40 resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="내용을 입력하세요"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-green-500 text-white font-semibold px-5 py-2 rounded-lg hover:bg-green-600 transition-all disabled:opacity-50"
      >
        {loading
          ? editingPost
            ? "수정 중..."
            : "등록 중..."
          : editingPost
          ? "수정하기"
          : "등록하기"}
      </button>
    </form>
  );
}
