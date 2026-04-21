import { createServerSupabaseClient } from "@/lib/config/supabase/server/server";
import React from "react";
import EditDeliveryForm from "./_components/EditDeliveryForm";

export default async function EditDeliveryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createServerSupabaseClient();
  const id = (await params).id;

  const { data: delivery, error } = await supabase
    .from("delivery_addresses")
    .select("*")
    .eq("id", id)
    .single();

  if (!delivery || error) {
    return <div>배송 정보를 불러오지 못했습니다.</div>;
  }

  return <EditDeliveryForm initialData={delivery} />;
}
