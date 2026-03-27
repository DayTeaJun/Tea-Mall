import React from "react";

export default async function UserManageMentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-4">
      <h2 className="text-xl font-bold">고객 관리</h2>
      {id} page
    </div>
  );
}
