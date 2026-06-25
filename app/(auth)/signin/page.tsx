import Link from "next/link";
import SigninForm from "./_components/SigninForm";
import AuthUIForm from "./_components/GoogleLogin";

function LoginPage() {
  return (
    <>
      <p className="text-[32px] font-bold">Login</p>
      <SigninForm />

      <Link href="/signup" className="text-[14px] cursor-pointer underline">
        Create Account
      </Link>

      <AuthUIForm />
    </>
  );
}

export default LoginPage;
