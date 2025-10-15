import React from "react";
import FeedCard from "../components/FeedCard";
import Sidebar from "../components/Sidebar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 메인 콘텐츠 영역 */}
      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-6 py-10 px-6">
        {/* 왼쪽: 피드 */}
        <div className="col-span-8 space-y-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              오늘의 성장, 모두와 함께 기록해요 🌱
            </h1>
            <p className="text-gray-600 mt-2">
              피드에서 친구들의 성장 일지를 구경하고, 내 기록을 공유해요.
            </p>
            <div className="flex gap-3 mt-6">
              <button className="bg-green-500 text-white font-semibold px-5 py-2 rounded-lg hover:bg-green-600 transition-all">
                ✏️ 일지 작성
              </button>
              <button className="border border-green-500 text-green-600 font-semibold px-5 py-2 rounded-lg hover:bg-green-50 transition-all">
                💬 커뮤니티
              </button>
            </div>
          </div>

          {/* 피드 카드 반복 */}
          <FeedCard
            plantName="몬스테라 #1"
            time="2시간 전"
            content="잎이 새로 났어요! 광량은 중간, 급수는 4일 주기로 유지 중이에요 🌿"
          />
          <FeedCard
            plantName="몬스테라 #2"
            time="5시간 전"
            content="새 잎이 펼쳐지고 있어요! 오늘은 급수일 💧"
          />
          <FeedCard
            plantName="산세베리아"
            time="1일 전"
            content="햇빛이 잘 드는 곳으로 이동시켰어요 ☀️"
          />
        </div>

        {/* 오른쪽: 사이드바 */}
        <div className="col-span-4">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
