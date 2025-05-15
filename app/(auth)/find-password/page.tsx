import Link from "next/link";
import FindPasswordForm from "./_components/FindPasswordForm";

function FindPasswordPage() {
  return (
    <section className="w-full h-full flex flex-col items-center pt-5">
      <p className="text-[32px] font-bold">Reset your password</p>
      <FindPasswordForm />

      <Link href="/signin" className="text-[14px] cursor-pointer underline">
        Cancel
      </Link>
    </section>
  );
}

export default FindPasswordPage;
