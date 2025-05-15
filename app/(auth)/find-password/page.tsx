import FindPasswordForm from "./_components/FindPasswordForm";

function FindPasswordPage() {
  return (
    <section className="w-full h-full flex flex-col gap-2 items-center pt-5">
      <p className="text-[32px] font-bold">Reset your password</p>

      <FindPasswordForm />
    </section>
  );
}

export default FindPasswordPage;
