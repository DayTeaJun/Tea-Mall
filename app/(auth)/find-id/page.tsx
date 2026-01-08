import FindIdForm from "./_components/FindIdForm";

function FindPasswordPage() {
  return (
    <section className="w-full h-full flex flex-col gap-2 items-center pt-5">
      <p className="text-[32px] font-bold">Find your ID</p>

      <FindIdForm />
    </section>
  );
}

export default FindPasswordPage;
