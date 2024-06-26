import HeaderOwnComponent from "@/components/own/header/header";
import React from "react";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" h-full relative">
      <HeaderOwnComponent />
      <div className="max-w-[90%] mx-auto">{children}</div>
    </div>
  );
};

export default DashboardLayout;
