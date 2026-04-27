"use client";

import { useAuthStore } from "@/lib/store/useAuthStore";
import PasswordGate from "../profile/edit/_components/PasswordGate";

export default function DeliveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isDeliveryVerified, setDeliveryVerified } = useAuthStore();

  const isOAuth = user?.app_metadata?.provider !== "email";

  if (!isOAuth && !isDeliveryVerified) {
    return (
      <PasswordGate
        prevPage={"delivery"}
        onVerified={() => setDeliveryVerified(true)}
      />
    );
  }

  return <>{children}</>;
}
