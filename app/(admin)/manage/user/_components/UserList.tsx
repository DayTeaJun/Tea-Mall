"use client";

import React from "react";
import ReactPaginate from "react-paginate";
import { User, Loader2, User2Icon } from "lucide-react";
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
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="bg-white overflow-hidden">
        <table className="w-full text-left table-fixed">
          <thead>
            <tr className="bg-gray-100 border-y text-gray-600 text-[13px] font-bold">
              <th className="w-[40%] py-3 px-6 ">고객 정보</th>
              <th className="w-[25%] py-3 px-6 text-center">이메일</th>
              <th className="w-[15%] py-3 px-6 text-center">등급</th>
              <th className="w-[20%] py-3 px-6 text-center">최근 접속일</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={4} className=" border-b">
                  <div className="flex flex-col items-center justify-center min-h-[365px] text-gray-500 bg-white">
                    <Loader2 className="w-10 h-10 mb-4 animate-spin text-gray-400" />
                    <p className="text-sm">고객 목록을 불러오는 중입니다</p>
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className=" border-b">
                  <div className="flex flex-col items-center justify-center min-h-[365px] text-gray-500 bg-white">
                    <User2Icon className="w-12 h-12 mb-4 text-gray-300" />
                    <p className="text-base font-medium text-gray-800 mb-1">
                      일치하는 고객이 없습니다
                    </p>
                    <p className="text-sm text-gray-400">
                      검색어나 필터를 다시 확인해 주세요.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  onClick={() => router.push(`/manage/user/${user.id}`)}
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors group border-b cursor-pointer"
                >
                  <td className="py-3 px-6">
                    <div className="flex items-center gap-4">
                      <div className="relative flex-shrink-0 w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                        {user.profile_image_url ? (
                          <Image
                            fill
                            src={user.profile_image_url}
                            alt={user.user_name || ""}
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <User size={24} />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col truncate gap-0.5">
                        <span className="text-gray-800 group-hover:font-bold truncate">
                          {user.user_name || "이름 없음"}
                        </span>
                        <span className="text-[11px] text-gray-400 font-mono">
                          {user.id}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-6 text-center text-gray-500 font-medium truncate">
                    {user.email}
                  </td>

                  <td className="py-3 px-6 text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-md text-[11px] font-bold border ${
                        user.level && user.level >= 3
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-600 border-gray-200"
                      }`}
                    >
                      {user.level && user.level >= 3 ? "관리자" : "일반 회원"}
                    </span>
                  </td>

                  <td className="py-3 px-6 text-center text-gray-500 leading-relaxed text-xs">
                    <div className="flex flex-col items-center">
                      <span className="font-mono">
                        {user.last_login_at
                          ? new Date(user.last_login_at).toLocaleDateString()
                          : "-"}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center">
        <ReactPaginate
          onPageChange={(e) => setPage(e.selected)}
          pageRangeDisplayed={3}
          pageCount={pageCount}
          forcePage={currentPage}
          marginPagesDisplayed={1}
          previousLabel={"<"}
          nextLabel={">"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          containerClassName={"pagination"}
          activeClassName={"active"}
          pageClassName={"page-item"}
          pageLinkClassName={"page-link"}
          previousClassName={"page-item"}
          previousLinkClassName={"page-link"}
          nextClassName={"page-item"}
          nextLinkClassName={"page-link"}
        />
      </div>
    </div>
  );
}

export default UserList;
