import { useState } from "react";
import CommunityAuthorProfile from "../ui/CommunityAuthorProfile";
import CommentForm from "./CommentForm";
import CommentLikeButton from "./CommentLikeButton";

const ReplyItem = ({ reply, postId, onRefresh, onLike }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);

  return (
    <div className="border-b border-gray-100 pb-2">
      <CommunityAuthorProfile
        post={{
          user: reply.user || {
            id: reply.authorId,
            nickName: reply.authorName,
            profileImageUrl: reply.authorProfileUrl,
          },
          createdAt: reply.createdAt,
        }}
      />

      <p className="text-gray-700 text-sm mt-1 ml-8">{reply.content}</p>

      <div className="flex items-center gap-4 text-xs mt-2 ml-8 text-gray-500">
        {/* ✅ 대댓글 좋아요 */}
        <CommentLikeButton postId={postId} commentId={reply.id} comment={reply} onLike={onLike} />

        <button
          onClick={() => setShowReplyForm((prev) => !prev)}
          className="hover:text-green-600 transition"
        >
          {showReplyForm ? "취소" : "답글 달기"}
        </button>
      </div>

      {showReplyForm && (
        <div className="mt-2 ml-12">
          <CommentForm
            postId={postId}
            parentId={reply.id}
            onAddComment={() => {
              setShowReplyForm(false);
              onRefresh?.();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ReplyItem;
