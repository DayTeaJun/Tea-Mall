import type { Metadata } from "next";
import "@/styles/globals.css";
import LayoutSection from "@/components/layout/LayoutSection";
import ReactQueryClientProvider from "@/lib/config/ReactQueryProvider";
import AuthProvider from "@/lib/config/supabase/AuthProvider";
import { getServerSession } from "@/lib/config/supabase/getServerSession";

export const metadata: Metadata = {
  title: "Tea - Mall",
  description: "Find one's taste, Tea Mall",
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
            <LayoutSection>{children}</LayoutSection>
          </AuthProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
