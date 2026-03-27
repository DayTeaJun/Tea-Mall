"use client";

import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import { MoreVertical, User } from "lucide-react";
import Image from "next/image";

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  lastLogin: string;
  avatar?: string;
}

const MOCK_USERS: UserData[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: `고객 ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 3 === 0 ? "VIP" : "일반",
  lastLogin: `2026-03-${27 - i}`,
  avatar: i % 2 === 0 ? undefined : undefined,
}));

function UserList() {
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 5;

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = MOCK_USERS.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(MOCK_USERS.length / itemsPerPage);

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % MOCK_USERS.length;
    setItemOffset(newOffset);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="bg-white border overflow-hidden">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="bg-gray-50 border-b text-gray-400 text-[13px] uppercase tracking-wider">
              <th className="w-[25%] py-4 px-6 font-semibold">고객 정보</th>
              <th className="w-[25%] py-4 px-6 font-semibold text-center">
                이메일
              </th>
              <th className="w-[15%] py-4 px-6 font-semibold text-center">
                등급
              </th>
              <th className="w-[20%] py-4 px-6 font-semibold text-center">
                최근 접속일
              </th>
              <th className="w-[15%] py-4 px-6 font-semibold text-center">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-50">
            {currentItems.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50/50 transition-colors group"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                      {user.avatar ? (
                        <Image
                          fill
                          src={user.avatar}
                          alt={user.name}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <User size={20} />
                        </div>
                      )}
                    </div>
                    <span className="font-bold text-gray-800 truncate">
                      {user.name}
                    </span>
                  </div>
                </td>

                <td className="py-4 px-6 text-center text-gray-500 truncate">
                  {user.email}
                </td>

                <td className="py-4 px-6 text-center">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold ${
                      user.role === "VIP"
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                <td className="py-4 px-6 text-center text-gray-500 font-mono">
                  {user.lastLogin}
                </td>

                <td className="py-4 px-6 text-center">
                  <button className="p-2 hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 rounded-lg transition-all">
                    <MoreVertical size={16} className="text-gray-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        <ReactPaginate
          breakLabel="..."
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          pageCount={pageCount}
          marginPagesDisplayed={1}
          previousLabel={"<"}
          nextLabel={">"}
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
