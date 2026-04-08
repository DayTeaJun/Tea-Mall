"use client";

import React from "react";
import ReactPaginate from "react-paginate";
import { MoreVertical, User, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface UserData {
  id: string;
  user_name: string | null;
  email: string | null;
  profile_image_url: string | null;
  level: number | null;
  updated_at: string | null;
  last_login_at: string | null;
}

interface UserListProps {
  users: UserData[];
  totalCount: number;
  currentPage: number;
  setPage: (page: number) => void;
  pageSize: number;
  isLoading: boolean;
}

function UserList({
  users,
  totalCount,
  currentPage,
  setPage,
  pageSize,
  isLoading,
}: UserListProps) {
  const router = useRouter();
  const pageCount = Math.ceil(totalCount / pageSize);

  if (isLoading) {
    return (
      <div className="py-10 text-center text-gray-400">
        데이터를 불러오는 중...
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="bg-white border overflow-hidden">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="bg-gray-50 border-b text-gray-400 text-[13px] uppercase tracking-wider">
              <th className="w-[25%] py-4 px-6 font-semibold">고객 정보</th>
              <th className="w-[30%] py-4 px-6 font-semibold text-center">
                이메일
              </th>
              <th className="w-[15%] py-4 px-6 font-semibold text-center">
                등급
              </th>
              <th className="w-[20%] py-4 px-6 font-semibold text-center">
                최근 접속일
              </th>
              <th className="w-[10%] py-4 px-6 font-semibold text-center">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-50">
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td
                    onClick={() => router.push(`/manage/user/${user.id}`)}
                    className="py-4 px-6 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full bg-gray-100 overflow-hidden border border-gray-100">
                        {user.profile_image_url ? (
                          <Image
                            fill
                            src={user.profile_image_url}
                            alt={user.user_name || ""}
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <User size={20} />
                          </div>
                        )}
                      </div>
                      <span className="font-bold text-gray-800 group-hover:underline truncate">
                        {user.user_name || "이름 없음"}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center text-gray-500 truncate">
                    {user.email}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold ${user.level && user.level >= 3 ? "bg-black text-white" : "bg-gray-100 text-gray-600"}`}
                    >
                      {user.level && user.level >= 3 ? "관리자" : "일반"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center text-gray-500 font-mono text-xs">
                    {user.last_login_at
                      ? new Date(user.last_login_at).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                      <MoreVertical size={16} className="text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-400">
                  검색 결과가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center">
        <ReactPaginate
          breakLabel="..."
          nextLabel={<ChevronRight size={18} />}
          onPageChange={(e) => setPage(e.selected)}
          pageRangeDisplayed={3}
          pageCount={pageCount}
          forcePage={currentPage} // 외부 상태와 동기화
          previousLabel={<ChevronLeft size={18} />}
          containerClassName="flex items-center gap-1 bg-white p-2 rounded-lg border shadow-sm"
          pageLinkClassName="w-9 h-9 flex items-center justify-center text-sm rounded-md hover:bg-gray-50"
          activeLinkClassName="bg-black text-white hover:bg-black font-bold"
          previousLinkClassName="w-9 h-9 flex items-center justify-center hover:bg-gray-50 rounded-md"
          nextLinkClassName="w-9 h-9 flex items-center justify-center hover:bg-gray-50 rounded-md"
          disabledLinkClassName="opacity-20 cursor-not-allowed"
        />
      </div>
    </div>
  );
}

export default UserList;
