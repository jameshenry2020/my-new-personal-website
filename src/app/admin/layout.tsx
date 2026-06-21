import React from "react";
import { AdminSidebar } from "@/components/shared/AdminSidebar";

export const metadata = {
  title: "Admin Console",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-[60vh] gap-8 border border-border-paper bg-bg-paper">
      <AdminSidebar />
      <div className="flex-grow p-6 md:p-10 overflow-x-hidden space-y-8">
        {children}
      </div>
    </div>
  );
}
