
import { ReactNode } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import DoctorAnimation from "./animations/DoctorAnimation";

interface LayoutProps {
  children?: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth";

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {!isAuthPage && <DoctorAnimation />}
      {!isAuthPage && <Sidebar />}
      <div className={`flex flex-col flex-1 overflow-hidden ${isAuthPage ? 'w-full' : ''}`}>
        {!isAuthPage && <TopNav />}
        <main className={`flex-1 overflow-auto ${isAuthPage ? '' : 'p-6'}`}>
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default Layout;
