import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import PostLikeButton from "./PostLikeButton";
import CommentList from "../comment/CommentList";
import { postService } from "../../services/post";
import CommunityAuthorProfile from "../ui/CommunityAuthorProfile";
import useAuthStore from "../../store/authStore"; // ✅ 로그인 사용자 확인용

export default function PostDetail() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuthStore(); // ✅ 현재 로그인 사용자

  const fetchPost = async () => {
    try {
      const postData = await postService.getPostById(postId);
      setPost(postData);
    } catch (err) {
      console.error("게시글 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) fetchPost();
  }, [postId]);

  const handleDelete = async () => {
    if (!window.confirm("정말 이 게시글을 삭제하시겠습니까?")) return;
    try {
      await postService.deletePost(post.id);
      alert("게시글이 삭제되었습니다.");
      navigate("/community");
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

  const isAuthor = user && post.user && user.id === post.user.id;

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-md border border-gray-100 max-w-4xl mx-auto mt-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* ✅ 헤더 */}
      <div className="p-6 border-b border-gray-200 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>

          {/* ✅ 작성자일 때만 수정/삭제 버튼 표시 */}
          {isAuthor && (
            <div className="flex gap-3 text-sm text-gray-500">
              <Link
                to={`/posts/edit/${post.id}`}
                state={{ post }}
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
          )}
        </div>

        {/* 작성자 */}
        <CommunityAuthorProfile post={post} />
      </div>

      {/* ✅ 이미지 */}
      {post.imageUrl && (
        <div className="mt-6 flex justify-center">
          <img
            src={post.imageUrl}
            alt="게시글 이미지"
            className="rounded-lg max-h-[500px] object-contain"
          />
        </div>
      )}

      {/* ✅ 본문 */}
      <div className="p-6 text-gray-700 leading-relaxed whitespace-pre-wrap">
        {post.content}
      </div>

      {/* 좋아요 */}
      <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-5 text-gray-500">
        <PostLikeButton post={post} />
      </div>

      {/* 댓글 */}
      <div className="p-6 border-t border-gray-100">
        <CommentList postId={post.id} />
      </div>
    </motion.div>
  );
}
