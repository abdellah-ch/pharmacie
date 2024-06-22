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

const BonCommandeSheet = () => {
  const { isOpen, onClose, BonCommandId } = useBonCommandeSheetState();
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Bon Commande {BonCommandId}</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default BonCommandeSheet;
