import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <section className="w-full h-full flex flex-col gap-2 items-center justify-center py-8">
      {children}
    </section>
  );
}
