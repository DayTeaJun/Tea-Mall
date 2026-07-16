"use client";

import React from "react";
import TopBtn from "./TopBtn";
import ChattingBtn from "./ChattingBtn";
import { useAuthStore } from "@/lib/store/useAuthStore";

function ToolComponent() {
  const { user } = useAuthStore();

  return (
    <div className="fixed bottom-5 right-5 flex flex-col gap-4 z-50">
      <TopBtn />
      {user && <ChattingBtn />}
    </div>
  );
}

export default ToolComponent;
