import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User } from "lucide-react"; // fallback 아이콘
import api from "../services/api"; // axios 인스턴스
// import defaultProfile from "../assets/default_profile.png"; // 기본 이미지

export default function MyPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/users/profile/me");
        setUser(res.data);
      } catch (err) {
        console.error("프로필 정보를 불러오지 못했습니다:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <p className="text-green-700 font-semibold">로딩 중...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <p className="text-gray-600">로그인이 필요합니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 py-12 px-6">
      <motion.div
        className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* 상단 프로필 */}
        <div className="flex flex-col items-center mb-8">
          {user.profileImageUrl ? (
            <motion.img
              src={user.profileImageUrl}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-green-200 shadow"
              whileHover={{ scale: 1.05 }}
            />
          ) : (
            <div className="w-28 h-28 flex items-center justify-center bg-green-100 rounded-full">
              <User className="w-12 h-12 text-green-500" />
            </div>
          )}
          <h2 className="text-2xl font-bold text-green-700 mt-4">
            {user.nickname || user.username}
          </h2>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>

        {/* 정보 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InfoCard title="소개" content={user.bio} />
          <InfoCard title="경험" content={user.experience} />
          <InfoCard title="관심사" content={user.interest} />
          <InfoCard
            title="스타일"
            content={
              user.style
                ? user.style.charAt(0).toUpperCase() +
                  user.style.slice(1).toLowerCase()
                : null
            }
          />
        </div>

        {/* 편집 버튼 */}
        <div className="flex justify-center mt-10">
          <button className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-all">
            프로필 수정하기
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// 공통 카드 컴포넌트
const InfoCard = ({ title, content }) => (
  <motion.div
    className="bg-green-50 rounded-xl p-5 shadow-sm border border-green-100"
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.2 }}
  >
    <h3 className="text-green-700 font-semibold mb-2">{title}</h3>
    <p className="text-gray-700">
      {content && content.trim() !== "" ? content : "작성되지 않았습니다 🌱"}
    </p>
  </motion.div>
);
