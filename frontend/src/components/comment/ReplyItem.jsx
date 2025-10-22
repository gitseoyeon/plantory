const ReplyItem = ({ reply }) => (
  <div className="reply-item">
    <p>
      <strong>{reply.authorName}</strong>: {reply.content}
    </p>
  </div>
);

export default ReplyItem;
