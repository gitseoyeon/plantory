// src/pages/Register.jsx
import React, { useState } from "react";
import InputField from "../components/ui/Input";
import useAuthStore from "../store/authStore";
import axios from "axios";

export default function Register() {
  const { register, loading, error } = useAuthStore();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    nickname: "",
    profileImageUrl: "",
  });

  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameMessage, setNicknameMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "nickname") {
      setNicknameChecked(false);
    }
  };

  const handleNicknameCheck = async () => {
    if (!formData.nickname) {
      setNicknameMessage("닉네임을 입력하세요.");
      return;
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/check?nickname=${
          formData.nickname
        }`
      );
      if (response.data === true) {
        setNicknameMessage("이미 사용 중인 닉네임입니다.");
        setNicknameChecked(false);
      } else {
        setNicknameMessage("사용 가능한 닉네임입니다.");
        setNicknameChecked(true);
      }
    } catch (error) {
      console.error(error);
      setNicknameMessage("닉네임 확인 중 오류가 발생했습니다.");
      setNicknameChecked(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 선택 항목은 입력값이 없으면 제외
    const payload = Object.fromEntries(
      Object.entries(formData).filter(([_, v]) => v !== "")
    );

    try {
      await register(payload);
      alert("회원가입이 완료되었습니다!");
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      alert(error || "회원가입 실패");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-green-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
          회원가입
        </h2>

        <form onSubmit={handleSubmit}>
          <InputField
            label="이름"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="이름을 입력하세요"
            required
          />
          <InputField
            label="이메일"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@email.com"
            required
          />
          <InputField
            label="비밀번호"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호를 입력하세요"
            required
          />

          {/* 선택 항목 */}
          <div className="relative">
            <div className="flex items-center">
              <InputField
                label="닉네임"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                placeholder="닉네임을 입력하세요"
              />
              <button
                type="button"
                onClick={handleNicknameCheck}
                className="ml-2 px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm font-medium"
              >
                중복 확인
              </button>
            </div>
            {nicknameMessage && (
              <p
                className={`text-sm -mt-2 ${
                  nicknameChecked
                    ? "text-green-600"
                    : nicknameMessage.includes("사용 중")
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {nicknameMessage}
              </p>
            )}
          </div>
          <InputField
            label="프로필 이미지 URL (선택)"
            name="profileImageUrl"
            value={formData.profileImageUrl}
            onChange={handleChange}
            placeholder="이미지 주소를 입력하세요"
          />

          <button
            type="submit"
            disabled={
              loading ||
              (!formData.nickname && !nicknameChecked) ||
              (formData.nickname !== "" && !nicknameChecked)
            }
            className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition-all mt-4 disabled:opacity-60"
          >
            {loading ? "가입 중..." : "회원가입"}
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-sm text-center mt-2">{error}</p>
        )}

        <p className="text-center text-gray-600 mt-4">
          이미 계정이 있으신가요?{" "}
          <a
            href="/login"
            className="text-green-600 font-semibold hover:underline"
          >
            로그인
          </a>
        </p>
      </div>
    </div>
  );
}
