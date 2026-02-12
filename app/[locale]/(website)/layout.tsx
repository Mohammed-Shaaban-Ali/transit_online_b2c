import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className=" min-h-screen flex flex-col justify-between">
      <Navbar />
      {children}

      <Footer />
    </main>
  );
}
