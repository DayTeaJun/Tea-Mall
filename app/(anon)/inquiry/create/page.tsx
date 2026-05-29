"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import PrivacyModal from "../../policy/_components/PrivacyModal";

interface InquiryType {
  content: string;
  email: string | null;
  guest_name: string | null;
  is_privacy_agreed: boolean | null;
  is_public: boolean | null;
  password: string | null;
  phone_number: string | null;
  title: string;
  user_id: string | null;
}

export default function DeliveryRegisterPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const formatPhone = (value: string) => {
    if (value.length !== 11) return value;
    return `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7)}`;
  };

  const [formData, setFormData] = useState<InquiryType>({
    title: "",
    content: "",
    email: user?.email || "",
    guest_name: user?.user_name || "",
    is_privacy_agreed: false,
    is_public: false,
    password: "",
    phone_number: user?.phone || "",
    user_id: user?.id || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-xl font-semibold mb-2">문의 등록</h2>

      <form
        onSubmit={handleSubmit}
        className="w-full border border-gray-200 bg-white overflow-hidden"
      >
        <table className="w-full text-sm">
          <tbody className="divide-y divide-gray-200">
            <tr className="flex flex-col md:table-row w-full">
              <th className="md:w-44 bg-gray-50 p-4 text-left font-medium text-gray-700 border-r border-gray-200">
                문의 제목
              </th>
              <td className="p-4">
                <input
                  type="text"
                  className="w-full md:w-full border border-gray-300 p-2 rounded-sm focus:outline-slate-500"
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  //   disabled={isPending}
                />
              </td>
            </tr>

            <tr className="flex flex-col md:table-row">
              <th className="md:w-44 bg-gray-50 p-4 text-left font-medium text-gray-700 border-r border-gray-200">
                문의자
              </th>
              <td className="p-4">
                <input
                  type="text"
                  className="w-full md:w-64 border border-gray-300 p-2 rounded-sm focus:outline-slate-500"
                  value={formData.guest_name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, guest_name: e.target.value })
                  }
                  required
                  //   disabled={isPending}
                />
              </td>
            </tr>

            <tr className="flex flex-col md:table-row">
              <th className="md:w-44 bg-gray-50 p-4 text-left font-medium text-gray-700 border-r border-gray-200">
                휴대전화
              </th>
              <td className="p-4">
                <input
                  type="tel"
                  className="w-full md:w-64 border border-gray-300 p-2 rounded-sm focus:outline-slate-500"
                  value={formData.phone_number || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, phone_number: e.target.value })
                  }
                  required
                  //   disabled={isPending}
                />
              </td>
            </tr>

            <tr className="flex flex-col md:table-row">
              <th className="md:w-44 bg-gray-50 p-4 text-left font-medium text-gray-700 border-r border-gray-200">
                문의 내용
              </th>
              <td className="p-4">
                <textarea
                  className="w-full border border-gray-300 p-2 rounded-sm focus:outline-slate-500 h-40 resize-none"
                  placeholder="문의 내용을 입력해주세요."
                  value={formData.content || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      content: e.target.value,
                    })
                  }
                  //   disabled={isPending}
                />
              </td>
            </tr>

            <tr className="flex flex-col md:table-row">
              <th className="md:w-44 bg-gray-50 p-4 text-left font-medium text-gray-700 border-r border-gray-200">
                비밀글
              </th>
              <td className="p-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-slate-700 focus:ring-slate-500"
                    checked={!!formData.is_public}
                    onChange={(e) =>
                      setFormData({ ...formData, is_public: e.target.checked })
                    }
                    // disabled={isPending}
                  />
                  <span className="text-gray-600">비밀글 저장</span>
                </label>
              </td>
            </tr>

            <tr className="flex flex-col md:table-row">
              <th className="md:w-44 bg-gray-50 p-4 text-left font-medium text-gray-700 border-r border-gray-200">
                개인정보 처리방침 동의
              </th>
              <td className="p-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-slate-700 focus:ring-slate-500"
                    checked={!!formData.is_privacy_agreed}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_privacy_agreed: e.target.checked,
                      })
                    }
                    // disabled={isPending}
                  />
                  <span className="text-gray-600">
                    개인정보 처리방침에 동의합니다
                  </span>
                  <PrivacyModal />
                </label>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 sm:px-10 py-2.5 border border-gray-300 bg-white text-gray-700 text-sm hover:bg-gray-100 disabled:opacity-50"
            // disabled={isPending}
          >
            취소
          </button>
          <button
            type="submit"
            className="px-6 sm:px-10 py-2.5 bg-slate-800 text-white text-sm font-medium hover:bg-slate-900 disabled:bg-slate-500 flex items-center gap-2"
            // disabled={isPending}
          >
            {/* {isPending ? "등록 중..." : "등록하기"} */}
            등록하기
          </button>
        </div>
      </form>
    </section>
  );
}
