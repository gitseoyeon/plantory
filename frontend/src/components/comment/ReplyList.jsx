import { useEffect, useState } from "react";
import { commentService } from "../../services/comment";
import CommentItem from "./CommentItem";

const ReplyList = ({ postId, parentId }) => {
  const [replies, setReplies] = useState([]);

  const fetchReplies = async () => {
    try {
      const res = await commentService.getReplies(postId, parentId);
      const data = Array.isArray(res) ? res : res.content || [];
      setReplies(data);
    } catch (err) {
      console.error("대댓글 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchReplies();
  }, [postId, parentId]);

  return (
    <div className="space-y-3">
      {replies.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          postId={postId}
          onRefresh={fetchReplies} // ✅ 대댓글 새로고침
        />
      ))}
    </div>
  );
};

export default ReplyList;
