import { HandCoins, TrendingUp } from "lucide-react";
import React from "react";

function page() {
  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-4">
      <h2 className="text-xl font-bold">대시보드</h2>

      <div className="w-full h-screen bg-gray-50">
        <section className="w-full grid grid-cols-4 gap-4 p-4">
          <div className="col-span-1 bg-white p-4 flex flex-col gap-1 rounded">
            <div className="flex items-center justify-between">
              <p className="text-13 text-gray-400">오늘 매출</p>

              <div className="p-1 bg-gray-300 rounded-full">
                <HandCoins className="w-4 h-4 text-gray-100" />
              </div>
            </div>
            <p className="text-17 font-bold">₩ 12,450,500</p>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-400" />
              <p className="text-14 text-gray-400">
                전일 대비 <span className="font-bold">15%</span>
              </p>
            </div>
          </div>
          <div className="col-span-1 bg-white p-4 flex flex-col gap-1 rounded">
            <div className="flex items-center justify-between">
              <p className="text-13 text-gray-400">오늘 매출</p>

              <div className="p-1 bg-gray-300 rounded-full">
                <HandCoins className="w-4 h-4 text-gray-100" />
              </div>
            </div>
            <p className="text-17 font-bold">₩ 12,450,500</p>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-400" />
              <p className="text-14 text-gray-400">
                전일 대비 <span className="font-bold">15%</span>
              </p>
            </div>
          </div>
          <div className="col-span-1 bg-white p-4 flex flex-col gap-1 rounded">
            <div className="flex items-center justify-between">
              <p className="text-13 text-gray-400">오늘 매출</p>

              <div className="p-1 bg-gray-300 rounded-full">
                <HandCoins className="w-4 h-4 text-gray-100" />
              </div>
            </div>
            <p className="text-17 font-bold">₩ 12,450,500</p>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-400" />
              <p className="text-14 text-gray-400">
                전일 대비 <span className="font-bold">15%</span>
              </p>
            </div>
          </div>
          <div className="col-span-1 bg-white p-4 flex flex-col gap-1 rounded">
            <div className="flex items-center justify-between">
              <p className="text-13 text-gray-400">오늘 매출</p>

              <div className="p-1 bg-gray-300 rounded-full">
                <HandCoins className="w-4 h-4 text-gray-100" />
              </div>
            </div>
            <p className="text-17 font-bold">₩ 12,450,500</p>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-400" />
              <p className="text-14 text-gray-400">
                전일 대비 <span className="font-bold">15%</span>
              </p>
            </div>
          </div>

          <div className="col-span-4 bg-white p-4 flex flex-col gap-1 rounded">
            <p className="text-16 font-bold">주간 매출 추이</p>

            <div></div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default page;
