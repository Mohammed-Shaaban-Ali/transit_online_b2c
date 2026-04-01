import NewNavbar from "@/components/shared/Navbar/NewNavbar";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className=" min-h-screen flex flex-col justify-between">
      <NewNavbar />
      {children}
    </main>
  );
}
