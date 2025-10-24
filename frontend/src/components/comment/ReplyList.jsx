import { useEffect } from "react";
import useCommentStore from "../../store/commentStore";
import ReplyItem from "./ReplyItem";
import CommentForm from "./CommentForm";

const ReplyList = ({ postId, parentId }) => {
  const { comments, createComment, toggleLike, fetchComments } = useCommentStore();

  const parent = comments.find((c) => c.id === parentId);
  const replies = parent?.replies || [];

  useEffect(() => {
    fetchComments(postId);
  }, [postId]);

  const handleAddReply = async (newReply) => {
    await createComment(postId, newReply.content, parentId);
  };

  return (
    <div className="mt-2 ml-8 border-l border-gray-200 pl-4 space-y-2">
      {replies.map((reply) => (
        <ReplyItem
          key={reply.id}
          reply={reply}
          postId={postId}
          onLike={() => toggleLike(postId, reply.id)}
        />
      ))}

      <CommentForm
        postId={postId}
        parentId={parentId}
        onSubmit={handleAddReply}
      />
    </div>
  );
};

export default ReplyList;
