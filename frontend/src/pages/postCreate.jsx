import React from "react";
import { useNavigate } from "react-router-dom";
import PostForm from "../components/post/PostForm";

export default function PostCreate() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <PostForm onSuccess={() => navigate("/community")} />
      </div>
    </div>
  );
}
