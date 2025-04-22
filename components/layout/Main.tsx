import React from "react";

function Main({ children }: { children: React.ReactNode }) {
  return <main className="h-screen mt-16 px-5 py-2">{children}</main>;
}

export default Main;
