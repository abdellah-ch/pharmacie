"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useProduitInfoState } from "@/stores/productStore";
import { useMountedState } from "react-use";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { useState } from "react";
import ProduitInfo from "./ProduitInfo";
import AjustementDeProduit from "./AjustementDeProduit";
const ProduitInfoSheet = () => {
  const [component, setComponent] = useState<string>("info");
  const isMounted = useMountedState();
  if (!isMounted) return null;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isOpen, onClose, SelectedProduct } = useProduitInfoState();
  // console.log(SelectedProduct);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        {component === "info" ? (
          <ProduitInfo setComponet={setComponent} />
        ) : (
          <AjustementDeProduit setComponet={setComponent} />
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ProduitInfoSheet;
