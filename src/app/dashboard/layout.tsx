import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar (Sheet/Drawer) */}
      <MobileSidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Topbar />

        {/* Page Content */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
