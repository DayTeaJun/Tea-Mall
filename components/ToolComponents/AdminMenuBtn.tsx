"use client";

import { Settings } from "lucide-react";
import { useRouter } from "next/navigation";

function AdminMenuBtn({ compact = false }: { compact?: boolean }) {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        router.push("/manage/dashBoard");
      }}
      type="button"
      className={`bg-white border border-gray-300 rounded-full text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center ${
        compact ? "p-1.5" : "p-3 shadow-md"
      }`}
    >
      <Settings size={compact ? 16 : 22} />
    </button>
  );
}

export default AdminMenuBtn;
