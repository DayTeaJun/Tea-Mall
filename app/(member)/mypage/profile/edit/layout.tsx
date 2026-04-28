"use client";

import { useAuthStore } from "@/lib/store/useAuthStore";
import PasswordGate from "./_components/PasswordGate";

export default function EditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, getIsVerified, setVerified } = useAuthStore();

  const isOAuth = user?.app_metadata?.provider !== "email";

  const isAuthValid = getIsVerified();

  if (!isOAuth && !isAuthValid) {
    return <PasswordGate onVerified={() => setVerified(true)} />;
  }

  return <>{children}</>;
}
