import React, { useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

const PlantPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === "/dictionary") {
      navigate("/dictionary/list");
    }
  }, [location, navigate]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      {/* 상단 탭 */}
      <div className="flex gap-6 mb-6 border-b pb-2">
        <NavLink
          to="/dictionary/list"
          className={({ isActive }) =>
            `pb-2 border-b-2 ${
              isActive
                ? "border-green-500 text-green-600 font-semibold"
                : "border-transparent text-gray-500"
            }`
          }
        >
          식물 백과사전
        </NavLink>

        <NavLink
          to="/dictionary/identify"
          className={({ isActive }) =>
            `pb-2 border-b-2 ${
              isActive
                ? "border-green-500 text-green-600 font-semibold"
                : "border-transparent text-gray-500"
            }`
          }
        >
          AI 식물 식별
        </NavLink>
      </div>

      <Outlet />
    </div>
  );
};

export default PlantPage;
