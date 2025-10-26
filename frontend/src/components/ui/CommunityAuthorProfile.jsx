import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { User } from "lucide-react"; // ✅ Lucide 아이콘 추가

export default function CommunityAuthorProfile({ post }) {
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (post?.user) {
      setAuthor(post.user);
      setLoading(false);
    }
  }, [post]);

  if (loading)
    return <p className="text-gray-400 text-sm">작성자 정보를 불러오는 중...</p>;

  const profileImage =
    author?.profileImageUrl && author.profileImageUrl.trim() !== ""
      ? `http://localhost:8080${author.profileImageUrl}`
      : null;

  const displayName = author?.nickName || "익명 사용자";
  const dateStr = post.createdAt || post.commentCreatedAt;

  return (
    <div className="flex items-center gap-3 text-sm text-gray-500">
      {profileImage ? (
        <img
          src={profileImage}
          alt="author"
          className="w-8 h-8 rounded-full border border-gray-200 object-cover"
        />
      ) : (
        <div className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-full border border-green-200 shadow-sm">
          <User className="w-4 h-4 text-green-500" />
        </div>
      )}

      <div>
        <p className="font-semibold text-gray-800">{displayName}</p>
        {dateStr && (
          <p className="text-gray-500 text-xs">
            {formatDistanceToNow(new Date(dateStr.split(".")[0]), {
              addSuffix: true,
            })}
          </p>
        )}
      </div>
    </div>
  );
}
