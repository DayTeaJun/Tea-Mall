function Main({ children }: React.PropsWithChildren) {
  return (
    <main className="w-full flex-1 h-[calc(100vh-88px)] mt-22 px-5 py-2 ">
      {children}
    </main>
  );
}

export default Main;
