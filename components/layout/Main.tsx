function Main({ children }: React.PropsWithChildren) {
  return (
    <main className="w-full min-h-screen flex flex-col justify-center items-center mt-24">
      <div className="flex flex-col items-center justify-center gap-4 w-full">
        <section className="w-full h-full flex flex-col items-center">
          {children}
        </section>
      </div>
    </main>
  );
}

export default Main;
