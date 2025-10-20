import React, { useState } from "react";
import { CgCloseR } from "react-icons/cg";
import PlantRegisterForm from "../components/userplant/PlantRegisterForm";
import PlantDiaryForm from "../components/userplant/PlantDiaryForm";
import PlantObserveForm from "../components/userplant/PlantObserveForm";

const PlantRegister = ({ onClose, onSuccess }) => {
  const [tab, setTab] = useState("plant");

  const tabs = [
    { key: "plant", label: "식물 등록", color: "bg-lime-500" },
    { key: "growth", label: "성장 기록", color: "bg-sky-400" },
    { key: "journal", label: "일지 작성", color: "bg-yellow-400" },
  ];

  return (
    <div className="bg-gray-50 rounded-2xl">
      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-6 py-8 px-4 md:px-6">
        {/* 좌측 탭 메뉴 */}
        <aside className="col-span-12 md:col-span-3 md:w-48">
          <nav className="space-y-3">
            {tabs.map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={[
                    "w-full text-left rounded-2xl px-5 py-3 font-semibold transition-all",
                    active
                      ? `text-white ${t.color} shadow-lg scale-[1.01]`
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
                  ].join(" ")}
                >
                  {t.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* 우측 탭 컨텐츠 */}
        <main className="col-span-12 md:col-span-9 space-y-8">
          <header className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">
              {tabs.find((t) => t.key === tab)?.label}
            </h1>
            {typeof onClose === "function" && (
              <button
                type="button"
                onClick={onClose}
                aria-label="닫기"
                className="rounded-md px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
              >
                <CgCloseR size={30} />
              </button>
            )}
          </header>

          {/* 탭에 따른 컴포넌트 렌더링 */}
          {tab === "plant" && (
            <PlantRegisterForm onSuccess={onSuccess} onClose={onClose} />
          )}
          {tab === "growth" && <PlantDiaryForm />}
          {tab === "journal" && <PlantObserveForm />}
        </main>
      </div>
    </div>
  );
};

export default PlantRegister;
