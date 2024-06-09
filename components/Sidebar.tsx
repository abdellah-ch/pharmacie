"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { ShoppingCart, Home, Pen } from "lucide-react";

import { cn } from "@/lib/utils";
// import { useState } from "react";
import { Separator } from "./ui/separator";
import { Nav } from "./nav";
import Image from "next/image";
import logo from "@/public/images/logo.png";
import { usePathname } from "next/navigation";

// defaultLayout = [265, 440, 655],

// defaultCollapsed = false,

// navCollapsedSize,
const Sidebar = () => {
  const pathname = usePathname();

  // console.log(typeof pathname);

  const isCollapsed = true;
  return (
    <ResizablePanel
      defaultSize={12}
      collapsedSize={12}
      collapsible={false}
      minSize={12}
      maxSize={12}
      className=" bg-[#21263c] text-white  transition-all duration-300 ease-in-out "
    >
      <div
        className={cn(
          "flex h-[70px] items-center justify-center",
          isCollapsed ? "h-[52px]" : "px-2"
        )}
      >
        <Image height={50} src={logo} alt="logo" />
      </div>
      <Separator />
      <div className="example overflow-y-scroll h-[90vh]">
        <Nav
          links={[
            {
              title: "Acceuil",
              label: "",
              icon: Home,
              variant: pathname === "/" ? "default" : "ghost",
              path: "/",
            },
          ]}
        />
        <Separator />
        <Nav
          links={[
            {
              title: "Produits",
              path: "/Inventaire/Produits",
              label: "",
              icon: ShoppingCart, // Placeholder for Lucid icon
              variant:
                pathname === "/Inventaire/Produits" ? "default" : "ghost",
            },
            {
              title: "Ajustement de Stock",
              path: "/Inventaire/Ajustement-Stock",
              label: "",
              icon: Pen, // Placeholder for Lucid icon
              variant:
                pathname === "/Inventaire/Ajustement-Stock"
                  ? "default"
                  : "ghost",
            },
          ]}
        />
        <Separator />
      </div>
    </ResizablePanel>
  );
};

export default Sidebar;
