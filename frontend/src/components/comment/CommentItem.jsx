import { useState } from "react";
import CommentForm from "./CommentForm";
import ReplyList from "./ReplyList";
import CommentLikeButton from "./CommentLikeButton";

const CommentItem = ({ comment, postId, onRefresh }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);

  return (
    <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition">
      <div className="flex items-start gap-3">
        <img
          src={comment.authorProfileUrl || "/default-profile.png"}
          alt="author"
          className="w-8 h-8 rounded-full mt-1"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium text-gray-800">
              {comment.authorName}
            </span>
            <span>· {comment.createdAt || "방금 전"}</span>
          </div>
          <p className="text-gray-700 mt-1">{comment.content}</p>

          <div className="flex items-center gap-4 text-sm mt-2 text-gray-500">
            <CommentLikeButton
              postId={postId}
              commentId={comment.id}
              comment={comment}
            />
            <button
              onClick={() => setShowReplyForm((prev) => !prev)}
              className="hover:text-green-600 transition"
            >
              {showReplyForm ? "취소" : "답글 달기"}
            </button>
          </div>

          {/* ✅ 대댓글 입력 폼 */}
          {showReplyForm && (
            <div className="mt-3 ml-8">
              <CommentForm
                postId={postId}
                parentId={comment.id}
                onAddComment={() => {
                  setShowReplyForm(false);
                  onRefresh?.(); // ✅ 부모 새로고침 트리거
                }}
              />
            </div>
          )}

          {/* ✅ 대댓글 리스트 */}
          <div className="mt-3 ml-8">
            <ReplyList postId={postId} parentId={comment.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
