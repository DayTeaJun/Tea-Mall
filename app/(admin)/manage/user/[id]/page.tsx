import UserDetailClient from "./_components/UserDetailClient";

export default async function UserManageMentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-4">
      <UserDetailClient userId={id} />
    </div>
  );
}
