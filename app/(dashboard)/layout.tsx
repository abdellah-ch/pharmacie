"use server";
import {
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { TooltipProvider } from "@/components/ui/tooltip";
import Sidebar from "@/components/Sidebar";
import { cookies } from "next/headers";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="overflow-hidden">
      <TooltipProvider delayDuration={0}>
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-[100vh]  items-stretch "
        >
          <Sidebar />
          <ResizableHandle withHandle={false} />
          {children}
        </ResizablePanelGroup>
      </TooltipProvider>
    </div>
  );
};
export default MainLayout;
