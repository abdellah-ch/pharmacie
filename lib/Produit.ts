"use server";
import { Categorie, Produit, Stock, AjustementsDeStock } from "@prisma/client";
import { prisma } from "./prisma";

// Ajouter un produit
export async function ajouterProduitAvecStock(
  code_produit: string,
  description: string,
  designation: string,
  prix_Achat: number,
  prix_Vente: number,
  date_expiration: Date | null,
  quantite: number,
  photo: string | null,
  categorie_id: number,
  Seuil_reapprovisionnement: number
): Promise<Produit> {
  return await prisma.produit.create({
    data: {
      code_produit,
      description,
      designation,
      prix_Achat,
      prix_Vente,
      date_expiration,
      quantite,
      photo,
      categorie_id,
      Seuil_reapprovisionnement,
      stock: {
        create: {
          stock_disponible: quantite,
          stock_engage: 0,
          stock_total: quantite,
        },
      },
    },
    include: {
      stock: true,
    },
  });
}

//Ajouter Categorie
// Ajouter une catégorie
export async function ajouterCategorie(nom: string): Promise<Categorie> {
  return await prisma.categorie.create({
    data: {
      nom,
    },
  });
}
//obtenir les recent Produit
export async function getRecentProducts(limit: number = 15) {
  return await prisma.produit.findMany({
    take: 15,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      categorie: true,
      stock: true,
    },
  });
}

//search for products limit to five
export async function fetchSearchedProducts(searchQuery: string) {
  return await prisma.produit.findMany({
    where: {
      designation: {
        contains: searchQuery,
      },
    },
    include: {
      categorie: true,
      stock: true,
    },
    take: 5,
  });
}

//
//Obtenir Les categories

export async function fetchCategories(
  searchQuery: string = "",
  limit: number = 5
) {
  return await prisma.categorie.findMany({
    where: {
      nom: {
        contains: searchQuery,
      },
    },
    take: limit,
  });
}

// Mettre à jour un produit
export async function mettreAJourProduit(
  produit_id: number,
  nouvellesDonnees: Partial<Produit> //provide {propreties to update}
): Promise<Produit | null> {
  return await prisma.produit.update({
    where: { produit_id },
    data: nouvellesDonnees,
  });
}

// Mettre à jour le stock d'un produit
export async function mettreAJourStockProduit(
  produit_id: number,
  nouvellesDonnees: Partial<Stock>
): Promise<Stock | null> {
  return await prisma.stock.update({
    where: { produit_id },
    data: nouvellesDonnees,
  });
}

// Supprimer un produit
export async function supprimerProduitAvecStock(
  produit_id: number
): Promise<Produit | null> {
  return await prisma.produit.delete({
    where: { produit_id },
    include: {
      stock: true,
    },
  });
}

// Obtenir un produit par son ID
export async function obtenirProduitParID(
  produit_id: number
): Promise<Produit | null> {
  return await prisma.produit.findUnique({
    where: { produit_id },
  });
}

export async function obtenirStockProduitParID(
  produit_id: number
): Promise<Stock | null> {
  return await prisma.stock.findUnique({
    where: { produit_id },
  });
}

// Obtenir tous les produits
export async function obtenirTousLesProduits(): Promise<Produit[]> {
  return await prisma.produit.findMany();
}

// Obtenir les produits par catégorie
export async function obtenirProduitsParCategorie(
  categorie_id: number
): Promise<Produit[]> {
  return await prisma.produit.findMany({
    where: { categorie_id },
  });
}

// Obtenir les produits avec un seuil de réapprovisionnement critique
export async function obtenirProduitsSeuilReapprovisionnementCritique(
  Seuil_reapprovisionnement: number
): Promise<Produit[]> {
  return await prisma.produit.findMany({
    where: {
      quantite: { lt: Seuil_reapprovisionnement },
    },
  });
}

// Ajouter un ajustement de stock
export async function ajouterAjustementDeStock(
  produit_id: number,
  quantite_ajustee: number,
  raison: string,
  utilisateur_id: number // This should be the ID of the user who made the adjustment
): Promise<AjustementsDeStock> {
  return await prisma.ajustementsDeStock.create({
    data: {
      produit_id,
      quantite_ajustee,
      raison,
      utilisateur_id,
      timestamp: new Date(),
    },
  });
}

// Obtenir tous les ajustements de stock pour un produit donné
export async function obtenirAjustementsDeStockPourProduit(
  produit_id: number
): Promise<AjustementsDeStock[]> {
  return await prisma.ajustementsDeStock.findMany({
    where: {
      produit_id,
    },
  });
}

export const getTotalStockInfo = async () => {
  const stocks = await prisma.stock.findMany({
    select: {
      stock_disponible: true,
      produit: {
        select: {
          prix_Achat: true,
        },
      },
    },
  });

  let totalValue = 0;
  let totalQuantity = 0;

  stocks.forEach((stock) => {
    const stockValue = stock.stock_disponible * stock.produit.prix_Achat;
    totalValue += stockValue;
    totalQuantity += stock.stock_disponible;
  });

  return { totalValue, totalQuantity };
};

export const getStockCounts = async () => {
  const lowStockCount = await prisma.produit.count({
    where: {
      quantite: {
        lt: prisma.produit.fields.Seuil_reapprovisionnement,
      },
    },
  });

  const totalProductCount = await prisma.produit.count();

  return {
    lowStockCount,
    totalProductCount,
  };
};
