import { Link } from "react-router-dom";
import PostLikeButton from "./PostLikeButton";
import PostCommentCountButton from "../comment/PostCommentCountButton";
import CommunityAuthorProfile from "../ui/CommunityAuthorProfile";

const PostCard = ({ post }) => (
  <Link
    to={`/posts/${post.id}`}
    className="block bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
  >
    {/* ✅ 제목 + 내용 */}
    <div>
      <h3 className="text-xl font-semibold text-gray-800 hover:text-green-600 transition">
        {post.title}
      </h3>
      <p className="text-gray-600 mt-2 line-clamp-2">{post.content}</p>
    </div>

    {/* ✅ 작성자 정보 + 버튼들 한 줄 배치 */}
    <div className="flex justify-between items-center mt-5">
      {/* 👤 작성자 정보 */}
      <CommunityAuthorProfile post={post} />

      {/* ❤️💬 좋아요 + 댓글 */}
      <div className="flex gap-2 items-center">
        <PostLikeButton post={post} />
        <PostCommentCountButton commentCount={post.commentCount ?? 0} />
      </div>
    </div>
  </Link>
);

export default PostCard;
