import { Link } from "react-router-dom";
import { Heart, MessageCircle } from "lucide-react";

export default function PostPreviewCard({ post }) {
  const formattedDateTime = post.createdAt
    ? new Date(post.createdAt).toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <Link
      to={`/posts/${post.id}`}
      className="group block transition-all p-5"
    >
      {/* ✅ 카테고리 배지 */}
      <div className="flex justify-between items-center mb-2">
        <span
          className={`text-xs font-semibold rounded-full px-3 py-1 border shadow-sm
            ${
              post.category === "PROUD"
                ? "text-green-800 bg-green-100 border-green-200"
                : post.category === "QUESTION"
                ? "text-yellow-800 bg-yellow-100 border-yellow-200"
                : post.category === "ADOPT"
                ? "text-pink-800 bg-pink-100 border-pink-200"
                : post.category === "TIP"
                ? "text-blue-800 bg-blue-100 border-blue-200"
                : "text-gray-800 bg-gray-100 border-gray-200"
            }`}
        >
          {"🔥" + post.category || "일반"}
        </span>
      </div>

      {/* ✅ 제목 */}
      <h3 className="font-semibold text-gray-700 text-xl line-clamp-1 transition-colors duration-200 group-hover:text-green-600">
        {post.title}
      </h3>

      {/* ✅ 작성자 + 날짜 + 좋아요 + 댓글 */}
      <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <span>{post.user?.nickName || "익명"}</span>
          {formattedDateTime && (
            <>
              <span className="text-gray-300">|</span>
              <span>{formattedDateTime}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-red-400 text-lg" />
            <span>{post.likeCount ?? 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4 text-green-500" />
            <span>{post.commentCount ?? 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
