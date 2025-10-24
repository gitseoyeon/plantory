import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

export default function CommunityAuthorProfile({ post }) {
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ post.user를 직접 사용하도록 수정
  useEffect(() => {
    if (post?.user) {
      setAuthor(post.user);
      setLoading(false);
    }
  }, [post]);

  if (loading)
    return <p className="text-gray-400 text-sm">작성자 정보를 불러오는 중...</p>;

  const profileImage =
    author?.profileImageUrl
      ? `http://localhost:8080${author.profileImageUrl}`
      : "/default-profile.png";

  const displayName = author?.nickName || "익명 사용자";

  // ✅ post.createdAt || comment.createdAt 대응
  const dateStr = post.createdAt || post.commentCreatedAt;

  return (
    <div className="flex items-center gap-3 text-sm text-gray-500">
      <img
        src={profileImage}
        alt="author"
        className="w-8 h-8 rounded-full border border-gray-200"
      />
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
