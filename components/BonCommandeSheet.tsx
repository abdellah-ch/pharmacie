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
import { useState } from "react";
import CommandPdf from "./CommandPdf";
import ColisPdf from "./ColisPdf";
import FacturePdf from "./FacturePdf";
import { useBonCommandeSheetState } from "@/stores/fournisseurStore";
import { Label } from "./ui/label";
import { CiBookmarkCheck } from "react-icons/ci";
import { MdEmail } from "react-icons/md";

const BonCommandeSheet = () => {
  const { isOpen, onClose, BonCommandId } = useBonCommandeSheetState();
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Bon Commande {BonCommandId}</SheetTitle>
        </SheetHeader>
        <div className="mt-7 flex items-center space-x-4 p-2 bg-[#ebeaf2s] dark:bg-zinc-800 border-y border-zinc-200 dark:border-zinc-700">
          {/* <button className="flex items-center space-x-1 text-zinc-700 dark:text-zinc-300 hover:text-blue-500">
                  <img
                    src="https://placehold.co/16"
                    alt="edit"
                    className="w-4 h-4"
                  />
                  <span>Modifier</span>
                </button> */}
          <button className="flex items-center space-x-1 text-zinc-700 dark:text-zinc-300 hover:text-blue-500">
            <MdEmail />
            <span>Envoyer un E-mail</span>
          </button>
          <div className="relative">
            {/* <button className="flex items-center space-x-1 text-zinc-700 dark:text-zinc-300 hover:text-blue-500">
                    <img
                      src="https://placehold.co/16"
                      alt="pdf"
                      className="w-4 h-4"
                    />
                    <span>PDF/Impression</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </button> */}
          </div>
          <button className="flex items-center space-x-1 text-zinc-700 dark:text-zinc-300 hover:text-blue-500">
            <CiBookmarkCheck />

            <span>Marquer comme Recu</span>
          </button>
          {/* <div className="relative">
                  <button className="flex items-center space-x-1 text-zinc-700 dark:text-zinc-300 hover:text-blue-500">
                    <span>Create</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </button>
                </div>
                <button className="text-zinc-700 dark:text-zinc-300 hover:text-blue-500">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 12h12M6 6h12M6 18h12"
                    ></path>
                  </svg>
                </button> */}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BonCommandeSheet;
