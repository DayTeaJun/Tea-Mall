import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4 px-4">
      {children}
    </div>
  );
}
