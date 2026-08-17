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
      className="p-3 bg-gray-200 rounded-full text-gray-500 hover:bg-gray-300 transition-colors"
    >
      <Settings size={25} />
    </button>
  );
}

export default AdminMenuBtn;
