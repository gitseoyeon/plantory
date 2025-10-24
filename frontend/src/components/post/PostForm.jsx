import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { postService } from "../../services/post";

export default function PostForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const editingPost = location.state?.post;

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "PROUD",
    file: null,
    imageUrl: "",
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: "PROUD", label: "자랑" },
    { value: "QUESTION", label: "질문" },
    { value: "ADOPT", label: "입양" },
    { value: "TIP", label: "팁" },
  ];

  useEffect(() => {
    if (editingPost) {
      setFormData((prev) => ({
        ...prev,
        title: editingPost.title,
        content: editingPost.content,
        category: editingPost.category || "PROUD",
        imageUrl: editingPost.imageUrl || "",
      }));
      setPreview(editingPost.imageUrl || null);
    }
  }, [editingPost]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, file }));
      setPreview(URL.createObjectURL(file));
    }
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
        const createdPost = await postService.createPost(formData);
        alert("게시글이 등록되었습니다!");
        navigate(`/posts/${createdPost.id}`);
      }
    } catch (err) {
      console.error(err);
      alert("처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 max-w-3xl mx-auto"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {editingPost ? "게시글 수정" : "새 글 작성"}
        </h2>

        {/* 제목 */}
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

        {/* 카테고리 */}
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

        {/* ✅ 이미지 업로드 (본문보다 위로 이동) */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">이미지 업로드</label>
          {preview && (
            <div className="mb-2">
              <img
                src={preview}
                alt="미리보기"
                className="w-48 h-48 object-cover rounded-lg"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
        </div>

        {/* 내용 */}
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
    </div>
  );
}
