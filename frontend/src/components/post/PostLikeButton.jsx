import { useEffect, useState } from "react";
import useLikeStore from "../../store/likeStore";

const PostLikeButton = ({ post }) => {
  const { togglePostLike, likes } = useLikeStore();
  const likeKey = `post-${post.id}`;

  const [localLiked, setLocalLiked] = useState(false);
  const [localCount, setLocalCount] = useState(post.likeCount ?? 0);

  // ✅ store와 서버 데이터 동기화
  useEffect(() => {
    // store에 좋아요 데이터가 있으면 store 기준으로, 없으면 post 기준으로
    if (likes[likeKey]) {
      setLocalLiked(likes[likeKey].liked);
      setLocalCount(likes[likeKey].likeCount);
    } else {
      setLocalLiked(post.liked || false);
      setLocalCount(post.likeCount ?? 0);
    }
  }, [likes, likeKey, post.liked, post.likeCount]);

  const handleLike = async () => {
    try {
      // ✅ store에서 toggle → store 상태가 바뀌면 위의 useEffect로 자동 반영됨
      await togglePostLike(post.id);
    } catch (e) {
      console.error("게시글 좋아요 중 오류:", e);
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full font-semibold text-lg shadow-md transition-all duration-150
        ${
          localLiked
            ? "bg-red-100 text-red-500 hover:bg-red-200"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        } hover:scale-105 active:scale-95`}
    >
      <span className="text-sm">{localLiked ? "❤️" : "🤍"}</span>
      <span>{localCount}</span>
    </button>
  );
};

export default PostLikeButton;
