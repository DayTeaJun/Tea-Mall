import SignupForm from "./_components/SignupForm";

export default function SignUpPage() {
  return (
    <section className="w-full h-full flex flex-col items-center p-5">
      <p className="text-[12px]">회원정보를 입력해주세요.</p>
      <SignupForm />
    </section>
  );
}
