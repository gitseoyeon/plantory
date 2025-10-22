import { useEffect } from "react";
import { useParams } from "react-router-dom";
import usePostStore from "../../store/postStore";
import PostItem from "./PostItem";
import CommentList from "../comment/CommentList";
import CommentForm from "../comment/CommentForm";

const PostDetail = () => {
  const { postId } = useParams();
  const { post, fetchPostById } = usePostStore();

  useEffect(() => {
    fetchPostById(postId);
  }, [postId]);

  if (!post) return <p>Loading...</p>;

  return (
    <div className="post-detail">
      <PostItem post={post} />
    </div>
  );
};

export default PostDetail;
