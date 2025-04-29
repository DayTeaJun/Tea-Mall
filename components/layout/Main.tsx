import React from "react";

function Main({ children }: React.PropsWithChildren) {
  return <main className="w-full flex-1 mt-22 px-5 py-2 ">{children}</main>;
}

export default Main;
