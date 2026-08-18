"use client";

import React from "react";
import { toast } from "sonner";

function CommentReportBtn() {
  return (
    <button
      onClick={() => toast.info("신고 처리되었습니다.")}
      className="text-end text-[10px] cursor-pointer text-blue-600 hover:underline"
    >
      신고하기
    </button>
  );
}

export default CommentReportBtn;
