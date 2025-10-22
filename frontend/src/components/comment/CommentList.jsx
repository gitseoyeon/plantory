import { useEffect, useState } from "react";
import { commentService } from "../../services/comment";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      const res = await commentService.getComments(postId);
      const data = Array.isArray(res) ? res : res.content || [];
      setComments(data);
    } catch (err) {
      console.error("댓글 불러오기 실패:", err);
      setComments([]);
    }
  };

  // ✅ 등록된 댓글을 즉시 반영
  const handleAddComment = () => {
    fetchComments();
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <div className="mt-4">
      <h4 className="font-semibold text-gray-800 mb-3">💬 댓글</h4>

      <CommentForm postId={postId} onAddComment={handleAddComment} />

      {comments.length === 0 ? (
        <p className="text-gray-500 text-sm mt-3">아직 댓글이 없습니다 😅</p>
      ) : (
        <div className="space-y-4 mt-3">
          {comments.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              postId={postId}
              onRefresh={fetchComments} // ✅ 댓글 갱신 함수 전달
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentList;
