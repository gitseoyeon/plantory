import { commentService } from "../../services/comment";
import { useState } from "react";

const CommentLikeButton = ({ postId, commentId, comment }) => {
  const [isLiked, setIsLiked] = useState(comment.isLiked);
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);

  const handleLike = async () => {
    const res = await commentService.toggleLike(postId, commentId);
    setIsLiked(res.isLiked);
    setLikeCount(res.likeCount);
  };

  return (
    <button onClick={handleLike}>
      👍 {likeCount} {isLiked ? "(좋아요 취소)" : ""}
    </button>
  );
};

export default CommentLikeButton;
