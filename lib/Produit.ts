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
export async function supprimerProduitAvecStock(produit_id: number): Promise<Produit | null> {
  // Start a transaction to ensure all deletions are performed atomically
  return await prisma.$transaction(async (prisma) => {
    // Delete related stock records
    await prisma.stock.deleteMany({
      where: { produit_id },
    });

    // Delete related ajustementsDeStock records
    await prisma.ajustementsDeStock.deleteMany({
      where: { produit_id },
    });

    await prisma.bonCommandeItem.deleteMany({
      where: { produit_id },
    });
    // Delete related commandeItems records
    await prisma.commandeItem.deleteMany({
      where: { produit_id },
    });

    // Finally, delete the produit record
    return await prisma.produit.delete({
      where: { produit_id },
    });
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
  const products = await prisma.produit.findMany({
    select: {
      quantite: true,
      Seuil_reapprovisionnement: true,
    },
  });

  const lowStockCount = products.filter(
    (product) => product.quantite < product.Seuil_reapprovisionnement
  ).length;

  const totalProductCount = await prisma.produit.count();

  return {
    lowStockCount,
    totalProductCount,
  };
};


interface CreateAjustementInput {
  produit_id: number;
  NumeroRef: string;
  quantite_ajustee: number;
  raison: string;
}

export async function createAjustement(input: CreateAjustementInput) {
  const { produit_id, NumeroRef, quantite_ajustee, raison } = input;

  return await prisma.$transaction(async (prisma) => {
    // Step 1: Create AjustementDeStock record
    const ajustement = await prisma.ajustementsDeStock.create({
      data: {
        produit_id,
        NumeroRef,
        quantite_ajustee,
        raison,
      },
    });

    // Step 2: Update Stock record
    const stock = await prisma.stock.update({
      where: { produit_id },
      data: {
        stock_disponible: {
          increment: quantite_ajustee, // Assuming positive quantite_ajustee means increase
        },
        stock_total: {
          increment: quantite_ajustee,
        },
      },
    });

    // Step 3: Update Produit record
    const produit = await prisma.produit.update({
      where: { produit_id },
      data: {
        quantite: {
          increment: quantite_ajustee,
        },
      },
    });

    return {
      ajustement,
      stock,
      produit,
    };
  });
}