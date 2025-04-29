import type { Metadata } from "next";
import "@/styles/globals.css";
import LayoutSection from "@/components/layout/LayoutSection";
import ReactQueryClientProvider from "@/lib/config/ReactQueryProvider";

export const metadata: Metadata = {
  title: "Tea - Mall",
  description: "Find one's taste, Tea Mall",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-[SUIT-Regular] min-h-screen flex flex-col">
        <ReactQueryClientProvider>
          <LayoutSection>{children}</LayoutSection>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
