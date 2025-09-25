import type { Metadata } from "next";
import LayoutSection from "@/components/layout/LayoutSection";
import ReactQueryClientProvider from "@/components/providers/ReactQueryProvider";
import AuthProvider from "@/components/providers/AuthProvider";
import { getServerSession } from "@/lib/config/supabase/server/getServerSession";
import Toaster from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "T-Mall",
  description:
    "티셔츠부터 아우터까지, 다양한 사이즈와 합리적인 가격으로 만나는 패션 쇼핑몰 T-Mall.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getServerSession();

  return (
    <html lang="en">
      <body className="font-[SUIT-Regular] min-h-screen flex flex-col">
        <ReactQueryClientProvider>
          <AuthProvider user={user}>
            <Toaster />
            <LayoutSection user={user}>{children}</LayoutSection>
          </AuthProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
