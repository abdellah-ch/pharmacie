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
import { useEffect, useState, useCallback } from "react";
import CommandPdf from "./CommandPdf";
import ColisPdf from "./ColisPdf";
import FacturePdf from "./FacturePdf";
import {
  useBonCommandeSheetState,
  useFournisseur,
} from "@/stores/fournisseurStore";
import { Label } from "./ui/label";
import { CiBookmarkCheck } from "react-icons/ci";
import { MdEmail } from "react-icons/md";
import {
  getBonCommandeStatus,
  updateBonCommandeStatusToRecu,
} from "@/lib/Fournisseur";

const BonCommandeSheet = () => {
  const { isOpen, onClose, BonCommandId } = useBonCommandeSheetState();

  const { bonCommandes, fetchBonCommands } = useFournisseur();
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const fetchPDF = useCallback(async () => {
    setLoading(true);
    try {
      const response: any = await fetch(
        `/api/pdfBoncommandGeneration?bonCommandeId=${BonCommandId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/pdf",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching PDF: ${response.statusText}`);
      }

      const pdfBlob = await response.blob();
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(pdfUrl);
    } catch (error) {
      console.error("Error fetching PDF:", error);
    } finally {
      setLoading(false);
    }
  }, [BonCommandId]);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    const res = await getBonCommandeStatus(BonCommandId);
    if (res) setStatus(res);
    fetchBonCommands(15);
    setLoading(false);
  }, [BonCommandId]);

  useEffect(() => {
    if (BonCommandId !== 0) {
      fetchPDF();
      fetchStatus();
    }
  }, [BonCommandId, fetchPDF, fetchStatus]);

  const handleStatusUpdate = async () => {
    await updateBonCommandeStatusToRecu(BonCommandId);
    fetchStatus();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        {loading ? (
          <>loading...</>
        ) : (
          <>
            <SheetHeader>
              <SheetTitle>Bon Commande {BonCommandId}</SheetTitle>
            </SheetHeader>
            <div className="mt-7 flex items-center space-x-4 p-2 bg-[#ebeaf2] dark:bg-zinc-800 border-y border-zinc-200 dark:border-zinc-700">
              <button className="flex items-center space-x-1 text-zinc-700 dark:text-zinc-300 hover:text-blue-500">
                <MdEmail />
                <span>Envoyer un E-mail</span>
              </button>
              <div className="relative"></div>
              <button
                className="flex items-center space-x-1 text-zinc-700 dark:text-zinc-300 hover:text-blue-500"
                onClick={handleStatusUpdate}
              >
                <CiBookmarkCheck />
                {status === "EMIS" ? (
                  <span>Marquer comme Recu</span>
                ) : status === "RECU" ? (
                  <span>Recu</span>
                ) : (
                  <>loading</>
                )}
              </button>
            </div>
            <div className="w-full mt-7">
              {loading ? (
                <p>Loading...</p>
              ) : pdfUrl ? (
                <iframe
                  src={pdfUrl}
                  width="100%"
                  height="600px"
                  style={{ border: "none" }}
                />
              ) : (
                <p>No PDF available</p>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default BonCommandeSheet;
