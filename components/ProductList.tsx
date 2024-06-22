"use client";
import { getRecentProducts } from "@/lib/Produit";
import { useRouter } from "next/navigation";

import { useProductsStore, useProduitInfoState } from "@/stores/productStore";
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

const ProductList = () => {
  const { products, fetchProducts, loading } = useProductsStore();

  const [selectionBehavior, setSelectionBehavior] = useState("toggle");
  const router = useRouter();

  const { onOpen, onSelect } = useProduitInfoState();
  useEffect(() => {
    fetchProducts(15);
  }, [fetchProducts]);
  products.forEach((product) => {
    product.montantTotal = product.quantite * product.prix_Achat;
  });
  const handleRowClick = (produit_id: number) => {
    const selectedProduct = products.find(
      (product) => product.produit_id === produit_id
    );
    if (selectedProduct) {
      onSelect(selectedProduct);
      onOpen();
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  // console.log(products);
  const columns = [
    {
      key: "designation",
      label: "nom",
    },
    {
      key: "code_produit",
      label: "Code Produit",
    },
    {
      key: "quantite",
      label: "Stock Disponible",
    },
    {
      key: "montantTotal",
      label: "Montant Total",
    },
    {
      key: "Seuil_reapprovisionnement",
      label: "Seuil reapprovisinnoement",
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

          handleRowClick(Number(selected[0]));
          onOpen();
          // router.push(`/Inventaire/Produits/${selected[0]}`);
          // rt(selected[0]);
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={products}>
          {(item) => (
            <TableRow
              key={item.produit_id}
              className={
                item.Seuil_reapprovisionnement > item.quantite
                  ? "bg-red-400 cursor-pointer"
                  : "cursor-pointer"
              }
            >
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

export default ProductList;
