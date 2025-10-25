import useCommentStore from "../../store/commentStore";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import { useEffect } from "react";

// ✅ 댓글 개수 계산
const countAllComments = (comments) => {
  return comments.reduce(
    (acc, c) => acc + 1 + (c.children ? countAllComments(c.children) : 0),
    0
  );
};

const CommentList = ({ postId }) => {
  const { comments, fetchComments, loading } = useCommentStore();

  useEffect(() => {
    fetchComments(postId);
  }, [postId, fetchComments]);

  if (loading) return <p className="text-gray-500 text-center">불러오는 중...</p>;

  return (
    <div className="mt-6">
      {/* ✅ 댓글 개수 표시 */}
      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
        댓글
        <span className="text-green-600 text-base font-medium">
          {countAllComments(comments)}
        </span>
      </h3>

      <CommentForm postId={postId} />

      <div className="mt-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} postId={postId} />
          ))
        ) : (
          <p className="text-gray-400 text-sm text-center mt-4">
            아직 댓글이 없습니다
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentList;
