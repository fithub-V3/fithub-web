import "@/styles/dashboard/dashboard-layout.scss";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-layout">
      <DashboardNavbar />
      <main className="dashboard-layout__content">{children}</main>
    </div>
  );
}