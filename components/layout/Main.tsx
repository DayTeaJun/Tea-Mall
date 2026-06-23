function Main({ children }: React.PropsWithChildren) {
  return (
    <main className="w-full flex-1 flex flex-col justify-center pt-24">
      {children}
    </main>
  );
}

export default Main;
