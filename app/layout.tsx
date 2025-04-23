import type { Metadata } from "next";
import "./globals.css";
import LayoutSection from "@/components/layout/LayoutSection";
import ReactQueryClientProvider from "@/config/ReactQueryProvider";

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
      <body className="font-[GmarketSansMedium]">
        <ReactQueryClientProvider>
          <LayoutSection>{children}</LayoutSection>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
