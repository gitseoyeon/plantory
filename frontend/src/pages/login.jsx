import React, { useState } from "react";
import { motion } from "framer-motion";
import InputField from "../components/ui/Input";
// import logo from "../assets/logo.png"; // ← 로고 이미지 (예: /src/assets/logo.png)

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || "로그인 실패");
        return;
      }

      const data = await response.json();
      localStorage.setItem("accessToken", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("로그인 성공!");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-green-50 px-4">
      <motion.div
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="flex flex-col items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {/* <motion.img
            src={logo}
            alt="Plantory Logo"
            className="w-20 h-20 mb-3 drop-shadow-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          /> */}
          <h1 className="text-3xl font-extrabold text-green-600 mb-2">
            Plantory
          </h1>
          <p className="text-gray-600 text-center leading-relaxed">
            함께 키우고, 함께 배우는 식물 커뮤니티 🌿
            <br />
            당신의 식물 일상을 공유해보세요.
          </p>
        </motion.div>

        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit}>
          <InputField
            label="이메일"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="이메일을 입력하세요"
          />
          <InputField
            label="비밀번호"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호를 입력하세요"
          />

          <button
            type="submit"
            className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition-all mt-4"
          >
            로그인
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          아직 계정이 없으신가요?{" "}
          <a
            href="/register"
            className="text-green-600 font-semibold hover:underline"
          >
            회원가입
          </a>
        </p>
      </motion.div>
    </div>
  );
}
