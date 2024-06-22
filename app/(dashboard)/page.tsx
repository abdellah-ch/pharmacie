"use client";
import { getStockCounts, getTotalStockInfo } from "@/lib/Produit";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

import "chart.js/auto";

interface RevenueData {
  monthlyRevenue: number[];
}
export default function Home() {
  const [qte, setQte] = useState<number | undefined>(undefined);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [data, setData] = useState<any | undefined>(undefined);
  const [monto, setMonto] = useState<number | undefined>(undefined);
  const [alert, setAlert] = useState<number | undefined>(undefined);

  const [productsCount, setProductsCount] = useState<number>();

  const fetchRevenueData = async (selectedYear: number) => {
    try {
      const response = await fetch(`/api/CAmentiel?year=${selectedYear}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const responseData: RevenueData = await response.json();
      const revenueData = responseData.monthlyRevenue;

      setData({
        labels: [
          "Janvier",
          "Février",
          "Mars",
          "Avril",
          "Mai",
          "Juin",
          "Juillet",
          "Août",
          "Septembre",
          "Octobre",
          "Novembre",
          "Décembre",
        ],
        datasets: [
          {
            label: `CA Mensuel pour ${selectedYear}`,
            data: revenueData,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données de revenu:",
        error
      );
    }
  };

  useEffect(() => {
    getTotalStockInfo().then((res) => {
      console.log(res);

      setQte(res.totalQuantity);
      setMonto(res.totalValue);
    });

    getStockCounts().then((res) => {
      console.log(res);

      setAlert(res.lowStockCount);
      setProductsCount(res.totalProductCount);
    });

    fetchRevenueData(year);
  }, []);

  if (!data || !qte || !monto || !productsCount) {
    return <div>Chargement des données...</div>;
  }
  return (
    <div className="flex flex-col p-6 overflow-y-scroll h-[90vh]">
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
      <div className="w-[50%] mt-7">
        {/* CA mensuel chart  */}
        <Bar data={data} />
      </div>
    </div>
  );
}
