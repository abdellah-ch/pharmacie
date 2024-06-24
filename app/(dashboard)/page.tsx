"use client";
import { getStockCounts, getTotalStockInfo } from "@/lib/Produit";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { RiArrowDropDownLine } from "react-icons/ri";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@nextui-org/react";
import { prisma } from "@/lib/prisma";
import { getCommandItemsByDate } from "@/lib/Fournisseur";
interface RevenueData {
  monthlyRevenue: number[];
}
export default function Home() {
  const [selectedBonTimeframe, setSelectedBonTimeframe] =
    useState<string>("Cemois");

  const [qte, setQte] = useState<number | undefined>(undefined);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [data, setData] = useState<any | undefined>(undefined);
  const [monto, setMonto] = useState<number | undefined>(undefined);
  const [alert, setAlert] = useState<number | undefined>(undefined);
  const [quantityOrdered, setQuantityOrdered] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
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
  }, [year]);

  useEffect(() => {
    //fetch bon command info
    const fetchData = async () => {
      let startDate = new Date();
      let endDate = new Date();

      switch (selectedBonTimeframe) {
        case "Hier":
          startDate.setDate(startDate.getDate() - 1);
          endDate.setDate(endDate.getDate() + 1);
          break;
        case "Cettesemaine":
          startDate.setDate(startDate.getDate() - startDate.getDay());
          break;
        case "Cemois":
          startDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            1
          );
          break;
        case "Cetteannée":
          startDate = new Date(startDate.getFullYear(), 0, 1);
          break;
        case "Semaineprécédente":
          const dayOfWeek = startDate.getDay();
          startDate.setDate(startDate.getDate() - dayOfWeek - 7);
          endDate.setDate(endDate.getDate() - dayOfWeek - 1);
          break;
        default: // "aujourd'hui"
          break;
      }

      const result = await getCommandItemsByDate(startDate, endDate);

      const totalQuantity = result.reduce(
        (acc, item) => acc + item.quantite,
        0
      );
      const totalCost = result.reduce(
        (acc, item) => acc + item.quantite * item.produit.prix_Vente,
        0
      );

      setQuantityOrdered(totalQuantity);
      setTotalCost(totalCost);
    };

    fetchData();
  }, [selectedBonTimeframe]);

  if (!data || !qte || !monto || !productsCount) {
    return <div>Chargement des données...</div>;
  }
  return (
    <div className="flex flex-col p-6 overflow-y-scroll h-[90vh]">
      {/* split */}
      <div className="flex gap-5 justify-between">
        <div className="w-[45%] lg:w-[40%] bg-white dark:bg-zinc-800 rounded-lg shadow-md">
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
                MAD {monto}
              </span>
            </div>
          </div>
        </div>

        <div className="w-[50%] lg:w-[50%] bg-white dark:bg-zinc-800 rounded-lg shadow-md">
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
      <div className=" mt-12 h-auto bg-white dark:bg-zinc-800 rounded-lg shadow-md">
        <div className="bg-[#f9f9fb] p-4 rounded-lg rounded-b-none border-1 border-x-0">
          <h2 className="text-lg  font-mono text-zinc-900 dark:text-zinc-100  bg-[#f9f9fb]">
            CA mensuel
          </h2>
        </div>
        <div className="mt-7 h-full w-[60%] p-4">
          {/* CA mensuel chart  */}
          <Bar data={data} />
        </div>
      </div>

      <div className=" mt-12 w-[45%] lg:w-[40%] bg-white dark:bg-zinc-800 rounded-lg shadow-md">
        <div className="bg-[#f9f9fb] p-4 rounded-lg rounded-b-none border-1 border-x-0 flex justify-between">
          <h2 className="text-lg  font-mono text-zinc-900 dark:text-zinc-100  bg-[#f9f9fb]">
            Bon de commande
          </h2>
          <Popover placement="bottom-start" offset={20} showArrow>
            <PopoverTrigger>
              <div className="flex justify-center items-center cursor-pointer text-blue-500">
                <p className="text-zinc-900">{selectedBonTimeframe}</p>
                <RiArrowDropDownLine className="text-2xl" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="p-0 m-0 rounded-none">
              <div className="flex flex-col w-[200px]">
                <div
                  onClick={() => setSelectedBonTimeframe("Aujourdhui")}
                  className="text-small  px-4 py-2 cursor-pointer hover:bg-zinc-200"
                >
                  Aujourd'hui
                </div>
                <div
                  onClick={() => setSelectedBonTimeframe("Hier")}
                  className="text-small  px-4 py-2 cursor-pointer hover:bg-zinc-200"
                >
                  Hier
                </div>
                <div
                  onClick={() => setSelectedBonTimeframe("Cemois")}
                  className="text-small  px-4 py-2 cursor-pointer hover:bg-zinc-200"
                >
                  Ce mois
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="border-t border-zinc-200 dark:border-zinc-700 p-4">
          <div className="flex flex-col gap-4 justify-between items-center mb-2 mx-1 border-b-1 p-2">
            <span className="text-zinc-600 dark:text-zinc-400">
              Quantité commandée
            </span>
            <span className="text-2xl font-semibold text-blue-900 ">
              {quantityOrdered}
            </span>
          </div>
          <div className="flex flex-col gap-4 justify-between items-center mx-1 p-2">
            <span className="text-zinc-600 dark:text-zinc-400">Coût total</span>
            <span className="text-2xl font-semibold text-blue-900 ">
              {totalCost} MAD
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
