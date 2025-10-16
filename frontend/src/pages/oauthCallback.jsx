import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import useAuthStore from "../store/authStore";

const OAuth2Callback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get("token");
    const refreshToken = searchParams.get("refreshToken");
    const error = searchParams.get("error");

    if (error) {
      console.error("OAuth2 error:", error);
      navigate("/login");
      return;
    }

    if (token && refreshToken) {
      // ✅ 토큰 저장
      localStorage.setItem("accessToken", token);
      localStorage.setItem("refreshToken", refreshToken);

      try {
        // ✅ JWT payload 디코딩
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log("Decoded JWT payload:", payload);

        // ✅ 백엔드에서 JWT에 어떤 정보를 담았는지에 따라 key 수정
        const user = {
          id: payload.id || null,
          email: payload.email || searchParams.get("email") || "",
          username: payload.username || searchParams.get("username") || "",
          profileImageUrl:
            payload.profileImageUrl ||
            decodeURIComponent(searchParams.get("profileImageUrl") || ""),
        };

        // ✅ localStorage & Zustand 상태 업데이트
        localStorage.setItem("user", JSON.stringify(user));
        setAuth({
          user,
          isAuthenticated: true,
          loading: false,
          error: null,
        });

        // ✅ 홈으로 이동
        navigate("/");
      } catch (err) {
        console.error("Failed to decode JWT:", err);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [searchParams, navigate, setAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 via-lime-500 to-emerald-500">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-lg font-medium">소셜 로그인 중입니다...</p>
      </div>
    </div>
  );
};

export default OAuth2Callback;
