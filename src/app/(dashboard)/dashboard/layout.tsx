import SideBar from "@/components/SideBar";
import SlidersSwitch from "@/components/SlidersSwitch";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="w-screen h-screen max-h-[calc(100vh-70px)] md:max-h-screen flex mt-[70px] md:mt-0">
      <SlidersSwitch>
        {/* @ts-expect-error */}
        <SideBar />
      </SlidersSwitch>
      {children}
    </div>
  );
};

export default Layout;
