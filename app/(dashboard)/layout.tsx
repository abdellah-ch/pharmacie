import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { TooltipProvider } from "@/components/ui/tooltip";
import Sidebar from "@/components/Sidebar";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="overflow-hidden bg-white hidden md:block">
      <TooltipProvider delayDuration={0}>
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-[100vh]  items-stretch "
        >
          <Sidebar />
          <ResizableHandle withHandle={false} />
          <ResizablePanel
            defaultSize={200}
            collapsedSize={200}
            collapsible={false}
            minSize={200}
            maxSize={200}
            className="w-[50%]"
          >
            <div className="flex flex-col">
              <div className="bg-[#f7f7fe] h-[7vh] flex items-center ">
                Search
              </div>
              {children}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </TooltipProvider>
    </div>
  );
};
export default MainLayout;
