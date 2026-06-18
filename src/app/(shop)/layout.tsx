import { Footer, Sidebar } from "@/components";
import TopMenu from "@/components/iu/top-menu/TopMenu";

export default function ShopLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col justify-between">
      <TopMenu />
      <Sidebar/>
      <div className="px-0 sm:px-10">
        {children}
      </div>
      <Footer />
    </main>
  );
}