import { useState } from "react";
import usePostStore from "../../store/postStore";

const PostLikeButton = ({ post }) => {
  const { toggleLike } = usePostStore();
  const [localLiked, setLocalLiked] = useState(post.isLiked);
  const [localCount, setLocalCount] = useState(post.likeCount ?? 0);

const handleLike = async () => {
  try {
    const result = await toggleLike(post.id);
    if (result && typeof result.likeCount === "number") {
      setLocalLiked(result.isLiked);
      setLocalCount(result.likeCount);
    } else {
      console.warn("toggleLike 결과값이 비어있습니다:", result);
    }
  } catch (e) {
    console.error("좋아요 처리 중 오류:", e);
  }
};


  return (
    <button
      onClick={handleLike}
      className={`transition-all font-medium ${
        localLiked ? "text-red-500" : "text-gray-400"
      } hover:scale-110`}
    >
      ❤️ {localCount}
    </button>
  );
};

export default PostLikeButton;
