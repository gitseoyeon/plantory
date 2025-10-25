import { useState } from "react";
import CommunityAuthorProfile from "../ui/CommunityAuthorProfile";
import CommentForm from "./CommentForm";
import CommentLikeButton from "./CommentLikeButton";
import useCommentStore from "../../store/commentStore";
import useAuthStore from "../../store/authStore"; // ✅ 현재 로그인 유저 확인용 (authStore 사용 중이라 가정)

const CommentItem = ({ comment, postId, depth = 0 }) => {
  console.log("댓글 유저:", comment.user);

  const { createComment, updateComment, deleteComment, toggleLike } =
    useCommentStore();
  const { user } = useAuthStore(); // ✅ 현재 로그인 유저 정보

  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content || "");

  const isReply = !!comment.parentId;
  const replies = comment.replies || [];

  /** ✅ 댓글 수정 */
  const handleUpdate = async () => {
    if (!editContent.trim()) return;
    await updateComment(postId, comment.id, { content: editContent });
    setIsEditing(false);
  };

  /** ✅ 댓글 삭제 */
  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      await deleteComment(postId, comment.id);
    }
  };

  /** ✅ 좋아요 */
  const handleLike = () => toggleLike(postId, comment.id);

  /** ✅ 대댓글 작성 */
  const handleReply = async (content) => {
    setShowReplyForm(false);
  };
  // ✅ 현재 댓글 작성자인지 여부 확인
  const isAuthor = user && user.id === comment.user?.id;

  return (
    <div
      className={`p-4 border border-gray-100 rounded-xl bg-gray-50 hover:bg-gray-100 transition mt-2 ${
        isReply ? "ml-8" : ""
      }`}
    >
      <CommunityAuthorProfile
        post={{ user: comment.user, createdAt: comment.createdAt }}
      />

      {isEditing ? (
        <div className="mt-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleUpdate}
              className="text-sm text-white bg-green-600 px-3 py-1 rounded-md hover:bg-green-700"
            >
              저장
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-700 mt-2 ml-1">{comment.content}</p>
      )}

      {/* 버튼 영역 */}
      {!isEditing && (
        <div className="flex items-center gap-4 text-sm mt-2 ml-1 text-gray-500">
          <CommentLikeButton
            postId={postId}
            commentId={comment.id}
            comment={comment}
            onLike={handleLike}
          />
          <button
            onClick={() => setShowReplyForm((prev) => !prev)}
            className="hover:text-green-600 transition"
          >
            {showReplyForm ? "취소" : "답글 달기"}
          </button>

          {/* ✅ 작성자만 수정/삭제 버튼 표시 */}
          {isAuthor && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="hover:text-blue-600 transition"
              >
                수정
              </button>
              <button
                onClick={handleDelete}
                className="hover:text-red-600 transition"
              >
                삭제
              </button>
            </>
          )}
        </div>
      )}

      {showReplyForm && (
        <div className="mt-3 ml-6">
          <CommentForm
            postId={postId}
            parentId={comment.id}
            onAddComment={(content) => handleReply(content)}
          />
        </div>
      )}

      {replies.length > 0 && (
        <div className="mt-3">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
