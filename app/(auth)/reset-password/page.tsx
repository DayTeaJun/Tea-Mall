import Link from "next/link";
import ResetPasswordForm from "./_components/FindPasswordForm";

function ResetPasswordPage() {
  return (
    <section className="w-full h-full flex flex-col gap-2 items-center pt-5">
      <p className="text-[32px] font-bold">Reset your password</p>

      <p className="text-[13px] text-gray-500">
        변경할 비밀번호를 입력해주세요.
      </p>

      <ResetPasswordForm />

      <Link href="/signin" className="text-[14px] cursor-pointer underline">
        Cancel
      </Link>
    </section>
  );
}

export default ResetPasswordPage;
