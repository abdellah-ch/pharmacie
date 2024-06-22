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
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import { Textarea } from "./ui/textarea";
const AjustementDeProduit = (props: {
  setComponet: (component: string) => void;
}) => {
  const { isOpen, onClose, SelectedProduct } = useProduitInfoState();
  return (
    <>
      <SheetHeader>
        <SheetTitle>
          <Card className="mt-10">
            <CardHeader>
              <CardTitle className="flex justify-between items-center ">
                <div className="font-semibold text-xl">
                  Ajuster le stock -{SelectedProduct?.designation}
                </div>
              </CardTitle>
            </CardHeader>
          </Card>
        </SheetTitle>
        <SheetDescription className="flex flex-col gap-5 ">
          <div className="p-4 md:p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-md mt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Date*
                </label>
                <Input
                  type="text"
                  className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value="21 Jun 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Numéro de référence
                </label>
                <Input
                  type="text"
                  className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Quantité disponible
                </label>
                <div className="relative mt-1">
                  <Input
                    type="number"
                    value={SelectedProduct?.quantite}
                    className="block w-full rounded-md border-zinc-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    disabled
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-7000 dark:text-zinc-30">
                  Nouvelle quantité disponible
                </label>
                <Input
                  type="text"
                  className="mt-1 block w-full rounded-md border-zinc-30 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-red-600 dark:text-red-400">
                  Quantité ajustée*
                </label>
                <Input
                  type="text"
                  className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Prix de revient
                </label>
                <Input
                  type="text"
                  className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={SelectedProduct?.prix_Vente}
                  disabled
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-red-600 dark:text-red-400">
                Motif*
              </label>
              <Input placeholder="Entrer une raison" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Description
              </label>
              <Textarea
                className="mt-1 block w-full rounded-md border-zinc-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                rows={3}
                placeholder="Max 500 characters"
              />
            </div>
          </div>
          <div className="flex justify-start p-4 gap-4 border-t border-zinc-300 mt-5">
            <Button>Enregistrer</Button>
            <Button variant="outline" onClick={() => props.setComponet("info")}>
              Annuler
            </Button>
          </div>
        </SheetDescription>
      </SheetHeader>
    </>
  );
};

export default AjustementDeProduit;
