import { useEffect, useState } from "react";
import { postService } from "../services/postService";
import useUserStore from "../store/userStore";
import PostCard from "../components/post/PostCard";

const MyPosts = () => {
  const { user } = useUserStore();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (user) {
      postService.getPostsByUser(user.id).then(setPosts);
    }
  }, [user]);

  if (!user) return <p>로그인이 필요합니다.</p>;

  return (
    <div>
      <h2>{user.username}님의 포스트</h2>
      {posts.length === 0 ? (
        <p>작성한 포스트가 없습니다.</p>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );
};

export default MyPosts;
