import React from "react";

export default function Sidebar() {
  return (
    <div className="space-y-6">
      {/* 오늘의 알림 */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-semibold text-lg mb-3">🔔 오늘의 알림</h3>
        <ul className="text-gray-600 text-sm space-y-1">
          <li>몬스테라 급수 예정 · D-0</li>
          <li>산세베리아 분갈이 · D-3</li>
          <li>스킨답서스 비료 · D-7</li>
        </ul>
      </div>

      {/* 나의 통계 */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-semibold text-lg mb-3">📈 나의 통계</h3>
        <div className="grid grid-cols-3 text-center">
          <div>
            <p className="text-lg font-semibold text-green-600">12</p>
            <p className="text-sm text-gray-500">식물</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-green-600">48</p>
            <p className="text-sm text-gray-500">일지</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-green-600">7</p>
            <p className="text-sm text-gray-500">알림</p>
          </div>
        </div>
      </div>

      {/* 커뮤니티 */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-semibold text-lg mb-3">🌿 커뮤니티</h3>
        <ul className="text-gray-600 text-sm space-y-1">
          <li>#분갈이 팁 모음</li>
          <li>#겨울철 관리법</li>
          <li>#식물 Q&A</li>
        </ul>
      </div>
    </div>
  );
}
