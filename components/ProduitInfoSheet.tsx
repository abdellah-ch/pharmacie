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
const ProduitInfoSheet = () => {
  const isMounted = useMountedState();
  if (!isMounted) return null;
  const { isOpen, onClose, SelectedProduct } = useProduitInfoState();
  // console.log(SelectedProduct);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>
            <Card className="mt-10">
              <CardHeader>
                <CardTitle className="flex justify-between items-center ">
                  <div>{SelectedProduct?.designation}</div>
                  <div className="flex gap-5">
                    <Button size="sm">Ajuster le Stock</Button>
                    <Button size="sm">Suprimer</Button>
                  </div>
                </CardTitle>
              </CardHeader>
            </Card>
          </SheetTitle>
          <SheetDescription className="flex gap-5 "></SheetDescription>
        </SheetHeader>
        <div className="flex gap-5">
          <div className="w-[55%] mt-10 p-4">
            {/* paste */}
            <div className="p-4">
              <div className="mb-6">
                <div className="flex justify-between text-left mb-2">
                  <span className="font-semibold text-gray-600">
                    Type d'élément
                  </span>
                  <span className="text-gray-800">Articles en stock</span>
                </div>
                <div className="flex justify-between text-left mb-2">
                  <span className="font-semibold text-gray-600">
                    Code Produit
                  </span>
                  <span className="text-gray-800">
                    {SelectedProduct?.code_produit}
                  </span>
                </div>
                <div className="flex justify-between text-left mb-2">
                  <span className="font-semibold text-gray-600">
                    Description
                  </span>
                  <span className="text-gray-800">
                    {SelectedProduct?.description}
                  </span>
                </div>
                <div className="flex justify-between text-left mb-2">
                  <span className="font-semibold text-gray-600">Categorie</span>
                  <span className="text-gray-800">
                    {SelectedProduct?.categorie.nom}
                  </span>
                </div>
              </div>
              <div className="mb-6">
                <h2 className="font-bold text-gray-700 mb-4">
                  Informations sur les achats
                </h2>
                <div className="flex justify-between text-left mb-2">
                  <span className="font-semibold text-gray-600">
                    Prix de revient
                  </span>
                  <span className="text-gray-800">
                    {SelectedProduct?.prix_Achat} MAD
                  </span>
                </div>
              </div>
              <div>
                <h2 className="font-bold text-gray-700 mb-4">
                  Informations sur les ventes
                </h2>
                <div className="flex justify-between text-left mb-2">
                  <span className="font-semibold text-gray-600">
                    Prix de vente
                  </span>
                  <span className="text-gray-800">
                    {SelectedProduct?.prix_Vente} MAD
                  </span>
                </div>
              </div>
            </div>
            {/* paste */}
          </div>
          <div className="w-[30%] mt-5 px-4 flex flex-col gap-3">
            {SelectedProduct?.photo ? (
              <img width={200} src={SelectedProduct?.photo} alt="" />
            ) : null}
            <Card className="bg-[#fbfbfb]">
              <CardHeader>
                <CardTitle>Stock</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <div className="flex gap-2">
                  <p className="w-[50%] text-left">Stock Disponible</p>
                  <span className="ml-5">
                    : {SelectedProduct?.stock?.stock_disponible}
                  </span>
                </div>

                <div className="flex gap-2">
                  <p className="w-[50%] text-left">Stock Engage</p>
                  <span className="ml-5">
                    : {SelectedProduct?.stock?.stock_engage}
                  </span>
                </div>
                <div className="flex gap-2">
                  <p className="w-[50%] text-left">
                    Stock Disponible a la vente
                  </p>
                  <span className="ml-5">
                    : {SelectedProduct?.stock?.stock_total}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProduitInfoSheet;
