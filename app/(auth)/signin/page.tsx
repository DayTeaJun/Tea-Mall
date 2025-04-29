import SigninForm from "./_components/SigninForm";

function LoginPage() {
  return (
    <section className="w-full h-full flex flex-col items-center pt-5">
      <p className="text-[32px]">Login</p>
      <SigninForm />
    </section>
  );
}

export default LoginPage;
