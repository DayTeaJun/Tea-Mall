"use client";

import React from "react";
import TopBtn from "./TopBtn";
import ChattingBtn from "./ChattingBtn";
import { useAuthStore } from "@/lib/store/useAuthStore";
import AdminMenuBtn from "./AdminMenuBtn";

function ToolComponent() {
  const { user } = useAuthStore();

  return (
    <div className="flex flex-row items-center justify-center gap-2 mt-2">
      <TopBtn />
      {user && <ChattingBtn />}
      {user && user.level === 3 && <AdminMenuBtn />}
    </div>
  );
}

export default ToolComponent;
