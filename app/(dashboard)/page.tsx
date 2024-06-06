import { ResizablePanel } from "@/components/ui/resizable";

export default function Home() {
  return (
    <>
      <ResizablePanel minSize={150} defaultSize={150}>
        <p>test</p>
      </ResizablePanel>
      <ResizablePanel minSize={150} defaultSize={150}>
        <p>test</p>
      </ResizablePanel>
    </>
  );
}
