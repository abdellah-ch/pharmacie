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
import { useState } from "react";
import CommandPdf from "./CommandPdf";
import ColisPdf from "./ColisPdf";
import FacturePdf from "./FacturePdf";

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
  const [component, setComponent] = useState<string>("Commande");
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>No de la command : {commandId}</SheetTitle>
          <SheetDescription className="flex flex-col">
            <div className="p-4 border border-zinc-200 rounded-lg flex items-center justify-between">
              <div className="flex justify-center">
                <div className="bg-zinc-100 px-2 py-0 rounded-full flex items-center justify-center">
                  <FaCartShopping />
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-semibold">
                    Traiter la commande client
                  </h2>
                  <p className="text-zinc-600">
                    Vous pouvez créer des colis, des factures (dans n’importe
                    quel ordre) pour effectuer cette commande client.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 border-b border-zinc-200 dark:border-zinc-700">
              <nav className="flex space-x-4">
                <button
                  onClick={() => setComponent("Commande")}
                  className={
                    component === "Commande"
                      ? "py-2 px-4 text-sm font-medium text-blue-600 border-b-2 border-blue-600"
                      : "py-2 px-4 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                  }
                >
                  Commande Client
                </button>
                <button
                  onClick={() => setComponent("Colis")}
                  className={
                    component === "Colis"
                      ? "py-2 px-4 text-sm font-medium text-blue-600 border-b-2 border-blue-600"
                      : "py-2 px-4 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                  }
                >
                  Coli
                </button>
                <button
                  onClick={() => setComponent("Facture")}
                  className={
                    component === "Facture"
                      ? "py-2 px-4 text-sm font-medium text-blue-600 border-b-2 border-blue-600"
                      : "py-2 px-4 text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                  }
                >
                  Facture
                </button>
              </nav>
            </div>
          </SheetDescription>
        </SheetHeader>
        <div className="mt-8 flex flex-col justify-center items-center w-full">
          {/* <PdfViewer id={commandId} /> */}
          {component === "Commande" ? (
            <CommandPdf commandId={commandId} />
          ) : component === "Colis" ? (
            <ColisPdf commandId={commandId} />
          ) : (
            <FacturePdf commandId={commandId} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CommandeInfoSheet;
