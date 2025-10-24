import { useState } from "react";
import useCommentStore from "../../store/commentStore";

const CommentForm = ({ postId, parentId, onAddComment }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { createComment, fetchComments } = useCommentStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    await createComment(postId, content, parentId);
    setContent(""); // ✅ 입력창 비우기
    if (onAddComment) onAddComment(content);
  };

  return (
    <form onSubmit={handleSubmit} className="pt-2 flex flex-col gap-3">
      <textarea
        placeholder="댓글을 남겨보세요 ✍️"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border border-gray-300 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-green-200"
        rows="2"
      ></textarea>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-400 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg transition-all font-medium text-sm disabled:opacity-50"
        >
          {loading ? "등록 중..." : "등록"}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
