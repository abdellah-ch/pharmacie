"use client";
import { getRecentProducts } from "@/lib/Produit";
import { useRouter } from "next/navigation";

import { useProductsStore, useProduitInfoState } from "@/stores/productStore";
import { useClient } from "@/stores/clientStore";

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

const ClientsList = () => {
  //   const { products, fetchProducts, loading } = useProductsStore();
  const { clients, loading, fetchClient } = useClient();
  //   products.forEach((product) => {
  //     product.montantTotal = product.quantite * product.prix_Achat;
  //   });
  //   const [selectionBehavior, setSelectionBehavior] = useState("toggle");
  //   const router = useRouter();

  const { onOpen, onSelect } = useProduitInfoState();
  useEffect(() => {
    fetchClient(15);
  }, [fetchClient]);

  const handleRowClick = (produit_id: number) => {
    // const selectedProduct = products.find(
    //   (product) => product.produit_id === produit_id
    // );
    // if (selectedProduct) {
    //   onSelect(selectedProduct);
    // }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  // console.log(products);
  const columns = [
    {
      key: "nom",
      label: "nom du client",
    },
    {
      key: "email",
      label: "email",
    },
    {
      key: "telephone",
      label: "télephone",
    },
    {
      key: "nomSociete",
      label: "nom de la societe",
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
          //   onOpen();
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
        <TableBody items={clients}>
          {(item) => (
            <TableRow key={item.client_id} className="cursor-pointer">
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientsList;
