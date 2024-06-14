"use client";
import { getRecentProducts } from "@/lib/Produit";
import { useRouter } from "next/navigation";

import { useProductsStore, useProduitInfoState } from "@/stores/productStore";
import { useClient, useCommadeClientState } from "@/stores/clientStore";

import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Radio,
  RadioGroup,
} from "@nextui-org/react";

const CommandeList = () => {
  //   const { products, fetchProducts, loading } = useProductsStore();
  const { commandes, loading, fetchCommands } = useClient();
  console.log(commandes);

  //   products.forEach((product) => {
  //     product.montantTotal = product.quantite * product.prix_Achat;
  //   });
  //   const [selectionBehavior, setSelectionBehavior] = useState("toggle");
  //   const router = useRouter();

  const { onOpen, onSelect } = useCommadeClientState();
  // alert(commade);

  useEffect(() => {
    fetchCommands(15);
  }, [fetchCommands]);

  const handleRowClick = (command_id: number) => {
    // alert(command_id);

    // const selectedProduct = products.find(
    //   (product) => product.produit_id === produit_id
    // );
    // if (selectedProduct) {

    onSelect(command_id);
    // onOpen();
    // }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  // console.log(products);
  const columns = [
    {
      key: "date",
      label: "date de la commande",
    },
    {
      key: "nom",
      label: "nom",
    },
    {
      key: "status",
      label: "status",
    },
    {
      key: "total",
      label: "montant total",
    },
  ];
  //   const columns = [
  //     {
  //       key: "Nom",
  //       label: "Nom",
  //     },
  //     {
  //       key: "CodeProduit",
  //       label: "CodeProduit",
  //     },
  //     {
  //       key: "StockDisponible",
  //       label: "StockDisponible",
  //     },
  //     {
  //       key: "Niveau Alert",
  //       label: "Niveau Alert",
  //     },
  //   ];

  return (
    <div className="flex flex-col gap-3 text-black">
      <Table
        aria-label="Rows actions table example with dynamic content"
        selectionMode="multiple"
        selectionBehavior="replace"
        onRowAction={(key) => {
          // router.push(`/Inventaire/Produits/${key}`);
          handleRowClick(Number(key));
          onOpen();
        }}
        onSelectionChange={(key) => {
          const selected = Array.from(key);
          // onOpen();
          // router.push(`/Inventaire/Produits/${selected[0]}`);
          // rt(selected[0]);
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={commandes}>
          {(item) => (
            <TableRow key={item.commandId} className="cursor-pointer">
              {(columnKey) => (
                <TableCell>
                  {columnKey === "total"
                    ? getKeyValue(item, columnKey) + "  MAD"
                    : getKeyValue(item, columnKey)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CommandeList;
