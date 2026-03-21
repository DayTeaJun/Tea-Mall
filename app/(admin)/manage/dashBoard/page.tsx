import {
  HandCoins,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
  UserPlus,
} from "lucide-react";
import React from "react";
import SalesLineChart from "./_components/SalesStatusChart";
import CategoryPieChart from "./_components/CategoriStatusChart";
import LatestOrderLists from "./_components/LatestOrderLists";

function page() {
  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-4">
      <h2 className="text-xl font-bold">대시보드</h2>

      <div className="w-full min-h-screen bg-gray-50">
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
              <TrendingUp className="w-4 h-4 text-red-200" />
              <p className="text-14 text-gray-400">
                전일 대비 <span className="font-bold">+15%</span>
              </p>
            </div>
          </div>
          <div className="col-span-1 bg-white p-4 flex flex-col gap-1 rounded">
            <div className="flex items-center justify-between">
              <p className="text-13 text-gray-400">신규 주문</p>

              <div className="p-1 bg-gray-300 rounded-full">
                <ShoppingBag className="w-4 h-4 text-gray-100" />
              </div>
            </div>
            <p className="text-17 font-bold">40</p>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-200" />
              <p className="text-14 text-gray-400">
                전일 대비 <span className="font-bold">+8%</span>
              </p>
            </div>
          </div>
          <div className="col-span-1 bg-white p-4 flex flex-col gap-1 rounded">
            <div className="flex items-center justify-between">
              <p className="text-13 text-gray-400">신규 고객</p>

              <div className="p-1 bg-gray-300 rounded-full">
                <UserPlus className="w-4 h-4 text-gray-100" />
              </div>
            </div>
            <p className="text-17 font-bold">8</p>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-200" />
              <p className="text-14 text-gray-400">
                전일 대비 <span className="font-bold">+4%</span>
              </p>
            </div>
          </div>
          <div className="col-span-1 bg-white p-4 flex flex-col gap-1 rounded">
            <div className="flex items-center justify-between">
              <p className="text-13 text-gray-400">재고 부족 상품</p>

              <div className="p-1 bg-gray-300 rounded-full">
                <TriangleAlert className="w-4 h-4 text-gray-100" />
              </div>
            </div>
            <p className="text-17 font-bold">4</p>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-blue-200" />
              <p className="text-14 text-gray-400">
                전일 대비 <span className="font-bold">-3%</span>
              </p>
            </div>
          </div>
        </section>

        <section className="w-full flex gap-4 p-4">
          <SalesLineChart />

          <CategoryPieChart />
        </section>

        <section className="w-full gap-4 p-4">
          <LatestOrderLists />
        </section>
      </div>
    </div>
  );
}

export default page;
