import React, { ReactNode } from "react";

function InquiryLayout({ children }: { children: ReactNode }) {
  return <div className="max-w-7xl mx-auto p-4 md:p-8">{children}</div>;
}

export default InquiryLayout;
