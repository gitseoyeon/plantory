import { useState, useEffect } from "react";
import useCommentStore from "../../store/commentStore";

const CommentLikeButton = ({ postId, commentId }) => {
  const { comments, toggleLike } = useCommentStore();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // ✅ 현재 댓글/답글의 최신 상태 찾기
  const findComment = (list) => {
    for (const c of list) {
      if (c.id === commentId) return c;
      if (c.replies && c.replies.length > 0) {
        const found = findComment(c.replies);
        if (found) return found;
      }
    }
    return null;
  };

  useEffect(() => {
    const target = findComment(comments);
    if (target) {
      setIsLiked(target.isLiked || false);
      setLikeCount(target.likeCount || 0);
    }
  }, [comments, commentId]);

  const handleLike = async () => {
    await toggleLike(postId, commentId);
  };

  return (
    <button
      onClick={handleLike}
      className={`flex items-center gap-1 text-sm transition-all ${
        isLiked ? "text-red-500" : "text-gray-400"
      } hover:scale-110`}
    >
      <span>{isLiked ? "❤️" : "🤍"}</span>
      <span>{likeCount}</span>
    </button>
  );
};

export default CommentLikeButton;
