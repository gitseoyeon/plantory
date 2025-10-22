import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import PostLikeButton from "./PostLikeButton";
import CommentList from "../comment/CommentList";
import CommentForm from "../comment/CommentForm";
import { postService } from "../../services/post";
import { userService } from "../../services/user";

export default function PostItem() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ 게시글 + 작성자 불러오기
  const fetchPostAndAuthor = async () => {
    try {
      const postData = await postService.getPostById(postId);
      setPost(postData);

      if (postData.user?.id) {
        const userData = await userService.getUserProfile(postData.user.id);
        setAuthor(userData);
      }
    } catch (err) {
      console.error("게시글 또는 작성자 정보 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) fetchPostAndAuthor();
  }, [postId]);

  // ✅ 삭제 처리
  const handleDelete = async () => {
    if (!window.confirm("정말 이 게시글을 삭제하시겠습니까?")) return;
    try {
      await postService.deletePost(post.id);
      alert("게시글이 삭제되었습니다.");
      navigate("/posts");
    } catch (err) {
      console.error("게시글 삭제 실패:", err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        게시글을 불러오는 중입니다...
      </div>
    );

  if (!post)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        게시글을 찾을 수 없습니다 😢
      </div>
    );

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-md border border-gray-100 max-w-4xl mx-auto mt-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* 게시글 헤더 */}
      <div className="p-6 border-b border-gray-200 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>

          {/* ✅ 수정 / 삭제 버튼 */}
          <div className="flex gap-3 text-sm text-gray-500">
            <Link
              to={`/posts/edit/${post.id}`}
              state={{ post }} // 👉 기존 데이터 넘기기
              className="hover:text-green-600 transition"
            >
              수정
            </Link>
            <button
              onClick={handleDelete}
              className="hover:text-red-600 transition"
            >
              삭제
            </button>
          </div>
        </div>

        {/* 작성자 정보 */}
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <img
            src={
              author?.profileImageUrl
                ? `http://localhost:8080${author.profileImageUrl}`
                : post.user?.profileImageUrl
                ? `http://localhost:8080${post.user.profileImageUrl}`
                : "/default-profile.png"
            }
            alt="author"
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
          />

          <div>
            <p className="font-semibold text-gray-800">
              {author?.nickname || post.user?.nickName || "익명 사용자"}
            </p>
            <p className="text-gray-500 text-xs">
              {formatDistanceToNow(new Date(post.createdAt.split(".")[0]), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
      </div>

      {/* 게시글 내용 */}
      <div className="p-6 text-gray-700 leading-relaxed whitespace-pre-wrap">
        {post.content}
      </div>

      <div className="p-6 border-t border-gray-100">
        <CommentList postId={post.id} />
      </div>
    </motion.div>
  );
}
