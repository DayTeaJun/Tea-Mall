"use client";

import { useRouter } from "next/navigation";
import React from "react";
import ReactPaginate from "react-paginate";

interface Props {
  currentPage: number;
  query: string;
  pageCount: number; // 추가
}

function Pagination({ currentPage, query, pageCount }: Props) {
  const router = useRouter();

  const handlePageChange = (selected: { selected: number }) => {
    const newPage = selected.selected + 1;
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    params.set("page", newPage.toString());

    router.push(`/inquiry?${params.toString()}`);
  };

  return (
    <div className="mt-6 flex justify-center">
      <ReactPaginate
        onPageChange={handlePageChange}
        pageRangeDisplayed={3}
        pageCount={pageCount}
        forcePage={currentPage - 1}
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
  );
}

export default Pagination;
