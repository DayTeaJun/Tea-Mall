import React from "react";
import OrderList from "./_components/OrderList";

async function page() {
  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
      <h1 className="text-2xl mb-4 text-center">마이페이지</h1>
      <p className="text-center text-gray-500 mb-4">
        회원님의 정보를 확인하고 관리할 수 있는 페이지입니다.
      </p>
      <OrderList />
    </div>
  );
}

export default page;
