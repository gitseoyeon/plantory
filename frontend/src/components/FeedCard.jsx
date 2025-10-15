import React from "react";

export default function FeedCard({ plantName, time, content }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-all">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-lg text-gray-800">{plantName}</h3>
          <p className="text-gray-500 text-sm">{time}</p>
        </div>
        <div className="w-28 h-20 bg-green-100 rounded-lg"></div>
      </div>
      <p className="text-gray-700 text-sm leading-relaxed">{content}</p>
      <div className="flex gap-4 text-sm text-gray-500 mt-2">
        <button className="hover:text-green-600 transition-colors">
          ❤️ 좋아요
        </button>
        <button className="hover:text-green-600 transition-colors">
          💬 댓글
        </button>
      </div>
    </div>
  );
}
