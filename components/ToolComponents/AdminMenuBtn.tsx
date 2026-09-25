"use client";

import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";

function AdminMenuBtn() {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        router.push("/manage/dashBoard");
      }}
      type="button"
      className="p-1.5 bg-white border border-gray-300 rounded-full text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center"
    >
      <Settings size={16} />
    </button>
  );
}

export default AdminMenuBtn;
