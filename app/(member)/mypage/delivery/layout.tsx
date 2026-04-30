"use client";

import { useAuthStore } from "@/lib/store/useAuthStore";
import { useEffect, useState } from "react";
import PasswordGate from "../profile/edit/_components/PasswordGate";

export default function DeliveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isVerified, setVerified, checkIsExpired } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  const isOAuth = user?.app_metadata?.provider !== "email";

  useEffect(() => {
    setIsClient(true);

    if (!isOAuth && isVerified && checkIsExpired()) {
      setVerified(false);
    }
  }, [isVerified, isOAuth, checkIsExpired, setVerified]);

  if (!isClient) return null;

  const needsVerification = !isOAuth && (!isVerified || checkIsExpired());

  if (needsVerification) {
    return (
      <PasswordGate prevPage="delivery" onVerified={() => setVerified(true)} />
    );
  }

  return <>{children}</>;
}
