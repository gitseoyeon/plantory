import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { User, Camera } from "lucide-react";
import api from "../services/api";

export default function MyPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);

  // ✅ 프로필 정보 불러오기
  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/users/profile/me");
      setUser(res.data);
      setPreviewImage(
        res.data.profileImageUrl
          ? `http://localhost:8080${res.data.profileImageUrl}`
          : null
      );
    } catch (err) {
      console.error("프로필 정보를 불러오지 못했습니다:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
    setPreviewImage(
      user?.profileImageUrl
        ? `http://localhost:8080${user.profileImageUrl}`
        : null
    );
  };

  // ✅ 이미지 클릭 시 파일 선택 창 열기
  const handleImageClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // ✅ 5MB 초과 시 업로드 중단
    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하만 업로드 가능합니다.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/api/uploads/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = res.data.url;
      console.log("✅ 업로드 성공:", imageUrl);

      // 1️⃣ user 상태 갱신
      const updatedUser = { ...user, profileImageUrl: imageUrl };
      setUser(updatedUser);
      setPreviewImage(`http://localhost:8080${imageUrl}`);

      // 2️⃣ formData에도 최신 값 반영
      // 👉 수정 폼이 열려 있는 경우 (EditProfileForm에 prop으로 전달해야 함)
      if (isEditing && typeof window.updateFormProfileImage === "function") {
        window.updateFormProfileImage(imageUrl);
      }

      // 3️⃣ 백엔드에도 저장 (즉시 반영)
      await api.patch("/api/users/profile/me", {
        ...updatedUser,
        profileImageUrl: imageUrl,
      });

      await fetchProfile();
    } catch (err) {
      console.error("❌ 이미지 업로드 실패:", err);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    }
  };

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
        <div className="flex flex-col items-center mb-8 relative">
          {previewImage ? (
            <motion.img
              src={previewImage}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-green-200 shadow cursor-pointer"
              whileHover={isEditing ? { scale: 1.05 } : {}}
              onClick={handleImageClick}
            />
          ) : (
            <div
              className="w-28 h-28 flex items-center justify-center bg-green-100 rounded-full cursor-pointer border-4 border-green-200 shadow"
              onClick={handleImageClick}
            >
              <User className="w-12 h-12 text-green-500" />
            </div>
          )}

          {isEditing && (
            <button
              type="button"
              onClick={handleImageClick}
              className="absolute bottom-[68px] right-[calc(50%-4.0rem)] bg-green-500 text-white p-2 rounded-full shadow-md hover:bg-green-600 transition-all duration-200 border-2 border-white"
              aria-label="프로필 사진 변경"
            >
              <Camera className="w-4 h-4" />
            </button>
          )}

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />

          <h2 className="text-2xl font-bold text-green-700 mt-4">
            {user.nickname || user.username}
          </h2>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>

        {isEditing ? (
          <EditProfileForm
            user={user}
            onUpdateSuccess={fetchProfile}
            onCancel={handleEditToggle}
          />
        ) : (
          <>
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

            <div className="flex justify-center mt-10">
              <button
                onClick={handleEditToggle}
                className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-all"
              >
                프로필 수정하기
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

const EditProfileForm = ({ user, onUpdateSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    nickname: user.nickname || "",
    bio: user.bio || "",
    experience: user.experience || "",
    interest: user.interest || "",
    style: user.style || "",
    profileImageUrl: user.profileImageUrl || "",
  });

  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameMessage, setNicknameMessage] = useState("");
  const [originalNickname] = useState(user.nickname || "");

  useEffect(() => {
    // 외부에서 이미지 변경 시 formData.profileImageUrl 업데이트 가능하도록 전역 함수 등록
    window.updateFormProfileImage = (url) => {
      setFormData((prev) => ({ ...prev, profileImageUrl: url }));
    };

    return () => {
      delete window.updateFormProfileImage;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "nickname") {
      setNicknameChecked(false);
      setNicknameMessage("");
    }
  };

  const handleNicknameCheck = async () => {
    if (!formData.nickname.trim()) {
      setNicknameMessage("닉네임을 입력하세요.");
      setNicknameChecked(false);
      return;
    }
    try {
      const res = await api.get(
        `/api/auth/check?nickname=${encodeURIComponent(formData.nickname)}`
      );
      if (res.data) {
        setNicknameMessage("이미 사용 중인 닉네임입니다.");
        setNicknameChecked(false);
      } else {
        setNicknameMessage("사용 가능한 닉네임입니다.");
        setNicknameChecked(true);
      }
    } catch (err) {
      console.error("닉네임 중복 확인 실패:", err);
      setNicknameMessage("닉네임 확인 중 오류가 발생했습니다.");
      setNicknameChecked(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nicknameUnchanged = formData.nickname === originalNickname;
    if (!nicknameUnchanged && !nicknameChecked) {
      alert("닉네임 중복 확인을 해주세요.");
      return;
    }
    try {
      const res = await api.patch("/api/users/profile/me", formData);
      if (res.status === 200) {
        alert("프로필이 성공적으로 수정되었습니다!");
        onUpdateSuccess();
        onCancel();
      }
    } catch (err) {
      console.error("프로필 수정 실패:", err);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 border-t border-green-100 pt-6"
    >
      <div>
        <label className="block text-green-700 font-semibold mb-1">
          사용자 이름
        </label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 outline-none"
        />
      </div>

      <div>
        <label className="block text-green-700 font-semibold mb-1">
          이메일
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 outline-none"
        />
      </div>

      <div>
        <label className="block text-green-700 font-semibold mb-1">
          닉네임
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 outline-none"
          />
          <button
            type="button"
            onClick={handleNicknameCheck}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            중복 확인
          </button>
        </div>
        {nicknameMessage && (
          <p
            className={`text-sm mt-2 ${
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

      <div>
        <label className="block text-green-700 font-semibold mb-1">소개</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 outline-none"
        />
      </div>

      <ExperienceDropdowns
        experience={formData.experience}
        onChange={(val) =>
          setFormData((prev) => ({ ...prev, experience: val }))
        }
      />

      <div>
        <label className="block text-green-700 font-semibold mb-1">
          관심사
        </label>
        <input
          type="text"
          name="interest"
          value={formData.interest}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-300 outline-none"
        />
      </div>

      <div>
        <label className="block text-green-700 font-semibold mb-1">
          스타일
        </label>
        <select
          name="style"
          value={formData.style}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 shadow-sm hover:border-green-400 hover:shadow-md focus:ring-green-400 focus:border-green-400 transition-all duration-200 outline-none"
        >
          <option value="">선택하세요</option>
          <option value="MINIMAL">미니멀 (심플하고 깔끔한 스타일)</option>
          <option value="TROPICAL">
            트로피컬 (열대식물 중심의 풍성한 스타일)
          </option>
          <option value="RUSTIC">러스틱 (자연스럽고 소박한 스타일)</option>
          <option value="MODERN">모던 (세련되고 도시적인 스타일)</option>
          <option value="NATURAL">내추럴 (자연친화적이고 편안한 스타일)</option>
        </select>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 border border-gray-400 rounded-lg text-gray-700 hover:bg-gray-100 transition"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={!nicknameChecked && formData.nickname !== originalNickname}
          className={`px-6 py-2 rounded-lg transition ${
            nicknameChecked || formData.nickname === originalNickname
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          저장
        </button>
      </div>
    </form>
  );
};

// ExperienceDropdowns 컴포넌트
const ExperienceDropdowns = ({ experience, onChange }) => {
  const parseExperience = (exp) => {
    if (!exp) return { years: 0, months: 0 };
    const yearMatch = exp.match(/(\d+)\s*년/);
    const monthMatch = exp.match(/(\d+)\s*개월/);
    return {
      years: yearMatch ? parseInt(yearMatch[1], 10) : 0,
      months: monthMatch ? parseInt(monthMatch[1], 10) : 0,
    };
  };

  const initial = parseExperience(experience);
  const [years, setYears] = useState(initial.years);
  const [months, setMonths] = useState(initial.months);

  const handleYearsChange = (e) => {
    const y = parseInt(e.target.value, 10);
    setYears(y);
    onChange(`${y}년 ${months}개월`);
  };
  const handleMonthsChange = (e) => {
    const m = parseInt(e.target.value, 10);
    setMonths(m);
    onChange(`${years}년 ${m}개월`);
  };

  return (
    <div>
      <label className="block text-green-700 font-semibold mb-1">경험</label>
      <div className="flex gap-2">
        <select
          value={years}
          onChange={handleYearsChange}
          className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 shadow-sm hover:border-green-400 hover:shadow-md focus:ring-green-400 focus:border-green-400 transition-all duration-200 outline-none"
        >
          {Array.from({ length: 31 }, (_, i) => (
            <option key={i} value={i}>
              {i}년
            </option>
          ))}
        </select>
        <select
          value={months}
          onChange={handleMonthsChange}
          className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 shadow-sm hover:border-green-400 hover:shadow-md focus:ring-green-400 focus:border-green-400 transition-all duration-200 outline-none"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>
              {i}개월
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

const styleColorMap = {
  MINIMAL: "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200",
  TROPICAL:
    "bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200",
  RUSTIC: "bg-rose-100 text-rose-700 border-rose-300 hover:bg-rose-200",
  MODERN: "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200",
  NATURAL:
    "bg-violet-100 text-violet-700 border-violet-300 hover:bg-violet-200",
};

const InfoCard = ({ title, content }) => {
  // For 스타일, apply per-style color
  if (title === "스타일") {
    // Try to match content (display name) to enum key
    // content might be "Minimal", "Tropical", etc.
    const styleKey = content ? content.toUpperCase() : "";
    const colorClasses =
      styleColorMap[styleKey] ||
      "bg-green-100 text-green-700 border-green-300 hover:bg-green-200";
    return (
      <motion.div
        className="bg-green-50 rounded-xl p-5 shadow-sm border border-green-100"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <h3 className="font-semibold mb-2 text-green-700">{title}</h3>
        <p>
          {content && content.trim() !== "" ? (
            <span
              className={`inline-block px-3 py-1 rounded-md border font-semibold text-sm transition-all duration-200 ${colorClasses}`}
            >
              {content}
            </span>
          ) : (
            "작성되지 않았습니다 🌱"
          )}
        </p>
      </motion.div>
    );
  }
  // Default card for other info
  return (
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
};
