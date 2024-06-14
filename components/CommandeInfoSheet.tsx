"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaCartShopping } from "react-icons/fa6";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCommadeClientState } from "@/stores/clientStore";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();
const PdfViewer = (props: { id: number }) => {
  let url = `/api/pdfCommandeGeneration?commandeId=${props.id}`;
  return (
    <Document
      // file={{ data: pdfData }}
      file={url}
      onLoadSuccess={() => console.log("PDF loaded successfully")}
      className="border-2 shadow-lg w-full h-full"
    >
      <Page pageNumber={1} />
    </Document>
  );
};
const CommandeInfoSheet = () => {
  const { isOpen, commandId, onClose } = useCommadeClientState();
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>No de la command : {commandId}</SheetTitle>
          <SheetDescription>
            <div className="p-4 border border-zinc-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-zinc-100 p-2 rounded-full">
                  <FaCartShopping />
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-semibold">
                    Traiter la commande client
                  </h2>
                  <p className="text-zinc-600">
                    Vous pouvez créer des colis, des expéditions ou des factures
                    (dans n’importe quel ordre) pour effectuer cette commande
                    client.
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                  Convertir <span className="ml-1">▼</span>
                </Button>
                <Button className="hover:text-white bg-zinc-100 text-zinc-700 px-4 py-2 rounded-md">
                  Créer le colis
                </Button>
              </div>
            </div>
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col ">
          <a href="/api/pdfCommandeGeneration?commandeId=9 " target="__blank">
            Dowload
          </a>
          <PdfViewer id={commandId} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CommandeInfoSheet;
