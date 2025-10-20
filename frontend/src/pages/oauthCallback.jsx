import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import useAuthStore from "../store/authStore";

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error("[parseJwt] Failed to decode token:", err);
    return null;
  }
}

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
      localStorage.setItem("accessToken", token);
      localStorage.setItem("refreshToken", refreshToken);

      const payload = parseJwt(token);
      if (!payload) {
        navigate("/login");
        return;
      }

      console.log("Decoded JWT payload:", payload);

      const user = {
        id: payload.id || null,
        email: payload.email || "",
        username: payload.username || "",
        nickName: payload.nickName || "",
        profileImageUrl: payload.profileImageUrl || "",
      };

      localStorage.setItem("user", JSON.stringify(user));
      setAuth({
        user,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      navigate("/");
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
