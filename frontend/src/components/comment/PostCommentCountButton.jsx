import React from "react";

const PostCommentCountButton = ({ commentCount = 0 }) => {
  return (
    <div
      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full font-semibold text-lg shadow-md transition-all duration-150
        bg-blue-50 text-blue-500`}
    >
      <span className="text-sm">💬</span>
      <span>{commentCount}</span>
    </div>
  );
};

export default PostCommentCountButton;
