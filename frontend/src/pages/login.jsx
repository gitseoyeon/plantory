import React, { useState } from "react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import InputField from "../components/ui/Input";
import logo from "../assets/logo_animal.png";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      console.log("[LOGIN] status:", response.status);
      console.log(
        "[LOGIN] content-type:",
        response.headers.get("content-type")
      );

      if (!response.ok) {
        const text = await response.text();
        console.error("[LOGIN] non-200 body:", text);
        alert("로그인 실패: " + (text || response.status));
        return;
      }

      const raw = await response.text();
      console.log("[LOGIN] raw:", raw.slice(0, 200));
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        alert("로그인 응답이 JSON이 아닙니다. (아마 리다이렉트/HTML)");
        return;
      }

      console.log("[LOGIN] parsed:", data);

      const { accessToken, refreshToken, user } = data || {};
      if (!accessToken) {
        alert("accessToken이 응답에 없습니다. (키 이름 확인 필요)");
        return;
      }

      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      if (user) localStorage.setItem("user", JSON.stringify(user));

      alert("로그인 성공!");
      window.location.href = "/";
    } catch (err) {
      console.error("[LOGIN] error:", err);
      alert("서버 통신 오류가 발생했습니다.");
    }
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `${
      import.meta.env.VITE_API_URL
    }/oauth2/authorization/${provider}`;
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
          <motion.img
            src={logo}
            alt="Plantory Logo"
            className="w-20 h-20 mb-3 drop-shadow-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
          <h1 className="text-3xl font-extrabold text-green-600 mb-2">
            Plantory
          </h1>
          <p className="text-gray-600 text-center leading-relaxed">
            함께 키우고, 함께 배우는 식물 커뮤니티 🌿
            <br />
            당신의 식물 일상을 공유해보세요.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <InputField
            label="이메일"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="이메일을 입력하세요"
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
          <button
            type="submit"
            className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition-all mt-4"
          >
            로그인
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="px-4 text-gray-500 text-sm font-medium">
            또는 소셜 로그인
          </span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleSocialLogin("google")}
            className="w-full flex items-center justify-center gap-2 bg-gray-400 text-white font-semibold py-2 rounded-lg hover:bg-gray-600 transition-all"
          >
            <FcGoogle className="w-5 h-5 bg-white rounded-full" />
            Google 계정으로 로그인
          </button>
        </div>

        <p className="text-center text-gray-600 mt-6">
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
