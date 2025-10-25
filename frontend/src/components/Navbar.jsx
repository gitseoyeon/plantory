import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo_letter.png";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [location]); // ✅ 경로 변경 시마다 로그인 상태 재확인

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto flex justify-between items-center py-3 px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="logo" className="h-8" />
        </Link>

        <ul className="flex gap-6 text-gray-700 font-medium">
          <li>
            <Link to="/dictionary" className="hover:text-green-600">
              식물검색
            </Link>
          </li>
          <li>
            <Link to="/diary" className="hover:text-green-600">
              성장일지
            </Link>
          </li>
          <li>
            <Link to="/community" className="hover:text-green-600">
              커뮤니티
            </Link>
          </li>
        </ul>

        <div className="flex gap-3">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigate("/mypage")}
                className="text-gray-700 hover:text-green-600"
              >
                마이페이지
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("accessToken");
                  localStorage.removeItem("refreshToken");
                  localStorage.removeItem("user");
                  window.location.href = "/";
                }}
                className="text-gray-700 hover:text-green-600"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="text-gray-700 hover:text-green-600"
              >
                로그인
              </button>
              <button
                onClick={() => navigate("/register")}
                className="bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600"
              >
                회원가입
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
