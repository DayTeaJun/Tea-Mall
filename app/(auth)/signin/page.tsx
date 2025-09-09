import Link from "next/link";
import SigninForm from "./_components/SigninForm";
import AuthUIForm from "./_components/GoogleLogin";

function LoginPage() {
  return (
    <section className="w-full h-full flex flex-col items-center py-5">
      <p className="text-[32px] font-bold">Login</p>
      <SigninForm />

      <Link href="/signup" className="text-[14px] cursor-pointer underline">
        Create Account
      </Link>

      <AuthUIForm />
    </section>
  );
}

export default LoginPage;
