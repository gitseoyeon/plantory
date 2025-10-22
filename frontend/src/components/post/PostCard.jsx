import { Link } from "react-router-dom";
import PostLikeButton from "./PostLikeButton";

const PostCard = ({ post, onDelete }) => (
  <div className="bg-white shadow rounded-xl p-5 hover:shadow-md transition-all flex flex-col justify-between">
    <div>
      <Link to={`/posts/${post.id}`}>
        <h3 className="text-xl font-semibold text-gray-800 hover:text-green-600 transition">
          {post.title}
        </h3>
      </Link>
      <p className="text-gray-600 mt-2 line-clamp-2">{post.content}</p>
    </div>

    <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
      <span>{post.user?.nickName || "익명"}</span>

      <div className="flex gap-3 items-center">
        <PostLikeButton post={post} />

      </div>
    </div>
  </div>
);

export default PostCard;
