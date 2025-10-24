import React, { useState, useEffect } from "react";
import { CgCloseR } from "react-icons/cg";
import PlantRegisterForm from "../components/userplant/PlantRegisterForm";
import PlantDiaryForm from "../components/userplant/PlantDiaryForm";
import PlantObserveForm from "../components/userplant/PlantObserveForm";
import useUserPlantStore from "../store/userPlantStore";

const PlantRegister = ({ onClose, onSuccess }) => {
  const [tab, setTab] = useState("register");
  const { plants, listMyPlants } = useUserPlantStore();
  const [selectedPlantId, setSelectedPlantId] = useState(null);

  useEffect(() => {
    listMyPlants(); // 로그인 유저의 식물 목록 가져오기
  }, [listMyPlants]);

  const tabs = [
    { key: "register", label: "식물 등록", color: "bg-lime-500" },
    { key: "diary", label: "성장 일지", color: "bg-sky-400" },
    { key: "observe", label: "관리 일지", color: "bg-yellow-400" },
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

        {/* 우측 탭 콘텐츠 */}
        <main className="col-span-12 md:col-span-9 space-y-8">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-800">
                {tabs.find((t) => t.key === tab)?.label}
              </h1>

              {tab === "diary" && plants.length > 0 && (
                <select
                  className="ml-3 border border-gray-300 rounded-xl px-4 py-2 text-sm bg-white shadow-sm 
                             focus:ring-2 focus:ring-sky-300 focus:border-sky-400 
                             hover:border-sky-400 transition-all"
                  value={selectedPlantId || ""}
                  onChange={(e) => setSelectedPlantId(e.target.value)}
                >
                  <option value="">🌱 반려 식물 선택</option>
                  {plants.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}({p.petName})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* 닫기 버튼 */}
            {typeof onClose === "function" && (
              <button
                type="button"
                onClick={onClose}
                aria-label="닫기"
                className="rounded-md px-3 py-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
              >
                <CgCloseR size={30} />
              </button>
            )}
          </header>

          {/* 탭 컨텐츠 */}
          {tab === "register" && (
            <PlantRegisterForm onSuccess={onSuccess} onClose={onClose} />
          )}
          {tab === "diary" && (
            <PlantDiaryForm plantId={selectedPlantId} onClose={onClose} />
          )}
          {tab === "observe" && (
            <PlantObserveForm plantId={selectedPlantId} onClose={onClose} />
          )}
        </main>
      </div>
    </div>
  );
};

export default PlantRegister;
