import { usersTabsList } from "@/data/dashboard";
import { ReactNode } from "react";
import { Sidebar } from "../_components/sidebar";

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar lists={usersTabsList} />

      <main className="min-h-screen flex-1 overflow-y-auto bg-[#F5F1ED] p-2 md:ml-[240px] lg:p-[50px]">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
