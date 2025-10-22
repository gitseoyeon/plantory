import { useState } from "react";
import { commentService } from "../../services/comment";

const CommentForm = ({ postId, parentId, onAddComment }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      await commentService.createComment(postId, { content, parentId });
      setContent("");
      onAddComment?.(); // ✅ 작성 후 새로고침 트리거
    } catch (err) {
      console.error("댓글 작성 실패:", err);
      alert("댓글 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pt-2 flex flex-col gap-3">
      <textarea
        placeholder="댓글을 남겨보세요 ✍️"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border border-gray-300 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
        rows="2"
      ></textarea>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg transition-all font-medium text-sm disabled:opacity-50"
        >
          {loading ? "등록 중..." : "등록"}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
