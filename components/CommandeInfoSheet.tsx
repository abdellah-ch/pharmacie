"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaCartShopping } from "react-icons/fa6";
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

const PdfViewer = (props: { id: number }) => {
  let url = `/api/pdfCommandeGeneration?commandeId=${props.id}`;

  return (
    <div>
      <iframe src={url} width={800} height={500}></iframe>
    </div>
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
              <div className="flex space-x-2"></div>
            </div>
          </SheetDescription>
        </SheetHeader>
        <div className="mt-8 flex flex-col justify-center items-center w-full">
          <PdfViewer id={commandId} />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CommandeInfoSheet;
