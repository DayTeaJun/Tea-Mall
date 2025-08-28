import Link from "next/link";
import SigninForm from "./_components/SigninForm";
import OAuthForm from "./_components/OAuthForm";

function LoginPage() {
  return (
    <section className="w-full h-full flex flex-col items-center py-5">
      <p className="text-[32px] font-bold">Login</p>
      <SigninForm />

      <Link href="/signup" className="text-[14px] cursor-pointer underline">
        Create Account
      </Link>

      <OAuthForm />
    </section>
  );
}

export default LoginPage;
