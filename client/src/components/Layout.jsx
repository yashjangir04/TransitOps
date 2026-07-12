import React from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[var(--page-bg)]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-x-auto p-4 md:p-6 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
