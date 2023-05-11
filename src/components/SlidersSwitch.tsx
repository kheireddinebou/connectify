"use client";

import React, { ReactNode } from "react";
import { useMediaQuery } from "react-responsive";
import MobileSlideLayout from "./MobileSlideLayout";
import SideBar from "./SideBar";

const SlidersSwitch = ({ children }: { children: ReactNode }) => {
  const isSmallDevice = useMediaQuery({ query: "(max-width: 768px)" });
  
  return (
    <>
      {isSmallDevice ? (
        <MobileSlideLayout>{children}</MobileSlideLayout>
      ) : (
        children
      )}
    </>
  );
};

export default SlidersSwitch;
