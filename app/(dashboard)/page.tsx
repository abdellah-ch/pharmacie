"use client";
import { getStockCounts, getTotalStockInfo } from "@/lib/Produit";
import { useEffect, useState } from "react";

export default function Home() {
  const [qte, setQte] = useState<number>();

  const [monto, setMonto] = useState<number>();
  const [alert, setAlert] = useState<number>();

  const [productsCount, setProductsCount] = useState<number>();
  useEffect(() => {
    getTotalStockInfo().then((res) => {
      setQte(res.totalQuantity);
      setMonto(res.totalValue);
    });

    getStockCounts().then((res) => {
      setAlert(res.lowStockCount);
      setProductsCount(res.totalProductCount);
    });
  }, []);

  return (
    <div className="flex flex-col p-6">
      {/* split */}
      <div className="flex gap-5">
        <div className="w-[40%] lg:w-[30%] bg-white dark:bg-zinc-800 rounded-lg shadow-md">
          <div className="bg-[#f9f9fb] p-4 rounded-lg rounded-b-none border-1 border-x-0">
            <h2 className="text-lg  font-mono text-zinc-900 dark:text-zinc-100  bg-[#f9f9fb]">
              Résumé de l'inventaire
            </h2>
          </div>
          <div className="border-t border-zinc-200 dark:border-zinc-700 p-4">
            <div className="flex justify-between items-center mb-2 mx-1 border-b-1 p-2">
              <span className="text-zinc-600 dark:text-zinc-400">
                QUANTITÉ DISPONIBLE
              </span>
              <span className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                {qte}
              </span>
            </div>
            <div className="flex justify-between items-center mx-1 p-2">
              <span className="text-zinc-600 dark:text-zinc-400">
                MONTANT TOTAL
              </span>
              <span className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                {monto}
              </span>
            </div>
          </div>
        </div>

        <div className="w-[50%] lg:w-[45%] bg-white dark:bg-zinc-800 rounded-lg shadow-md">
          <div className="bg-[#f9f9fb] p-4 rounded-lg rounded-b-none border-1 border-x-0">
            <h2 className="text-lg  font-mono text-zinc-900 dark:text-zinc-100  bg-[#f9f9fb]">
              Détails du produit
            </h2>
          </div>
          <div className="border-t border-zinc-200 dark:border-zinc-700 p-4">
            <div className="flex justify-between items-center mb-2 mx-1 border-b-1 p-2">
              <span className="text-red-600 dark:text-zinc-400">
                articles dont le stock est réduit
              </span>
              <span className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                {alert}
              </span>
            </div>
            <div className="flex justify-between items-center mx-1 p-2">
              <span className="text-zinc-600 dark:text-zinc-400">
                tous les articles
              </span>
              <span className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                {productsCount}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* split */}
    </div>
  );
}
