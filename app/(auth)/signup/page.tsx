import Link from "next/link";
import SignupForm from "./_components/SignupForm";

export default function SignUpPage() {
  return (
    <section className="w-full h-full flex flex-col items-center pt-5">
      <p className="text-[32px]">Create account</p>
      <SignupForm />

      <Link href="/signin" className="text-[14px] cursor-pointer underline">
        Login
      </Link>
    </section>
  );
}
