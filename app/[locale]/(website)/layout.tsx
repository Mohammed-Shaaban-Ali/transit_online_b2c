const flightsTestFontFamily =
  '"Trip Geom", BlinkMacSystemFont, -apple-system, Roboto, Helvetica, Arial, sans-serif';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main
      className=" min-h-screen flex flex-col justify-between"
      style={{ fontFamily: flightsTestFontFamily }}
    >
      {children}
    </main>
  );
}
