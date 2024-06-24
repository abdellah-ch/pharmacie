"use server";
import { prisma } from "./prisma";

interface CreateFournisseurInput {
  nom: string;
  email: string;
  nomSociete?: string | undefined;
  telephone?: string | undefined;
  adresse?: string | undefined;
  codePostal?: number | undefined;
  Region?: string | undefined;
}

export async function ajouterFournisseur(data: CreateFournisseurInput) {
  try {
    return await prisma.fournisseur.create({
      data,
    });
  } catch (error) {
    console.error(error);
  }
}

export async function obtenirFournisseurs(limit: number = 10) {
  try {
    return await prisma.fournisseur.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });
  } catch (error) {
    console.error(error);
  }
}

export async function searchFournisseurs(
  searchQuery: string = "",
  limit: number = 10
) {
  return await prisma.fournisseur.findMany({
    where: {
      nom: {
        contains: searchQuery,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });
}

interface BonCommandeItemInput {
  productName: string;
  quantity: number;
  monto: number;
  product_id: number;
  product_img: string | null;
  stock: number | undefined;
  prix_vente: number;
}

export const InsertBonCommande = async (
  fournisseurId: number,
  date: Date | undefined,
  items: BonCommandeItemInput[]
) => {
  try {
    return await prisma.$transaction(async (prisma) => {
      let total = 0;

      // Calculate total
      for (const item of items) {
        total += item.quantity * item.prix_vente;
      }
      if (date) {
        date = new Date(date);
      }

      // Create BonCommande
      const newBonCommande = await prisma.bonCommande.create({
        data: {
          fournisseur_id: fournisseurId,
          total,
          status: "EMIS",
          createdAt: date,
          bonCommandeItems: {
            create: items.map((item) => ({
              produit_id: item.product_id,
              quantite: item.quantity,
              prixUnitaire: item.prix_vente,
            })),
          },
        },
        include: {
          bonCommandeItems: true,
        },
      });
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to insert BonCommande");
  }
};

export async function getRecentBonCommandes(limit: number) {
  try {
    const bonCommandes = await prisma.bonCommande.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      include: {
        fournisseur: true, // Include related fournisseur data
        bonCommandeItems: {
          include: {
            produit: true, // Include related product data
          },
        },
      },
    });

    const summary = bonCommandes.map((bonCommande) => ({
      bonCommandId: bonCommande.bonCommande_id,
      date: bonCommande.createdAt.toISOString().split("T")[0],
      nom: bonCommande.fournisseur.nom,
      status: bonCommande.status.toString(),
      total: bonCommande.total.toString(),
      // items: bonCommande.bonCommandeItems.map((item) => ({
      //   produitNom: item.produit.designation,
      //   quantite: item.quantite,
      // })),
    }));

    return summary;
  } catch (error) {
    console.error("Error fetching recent bon commandes: ", error);
    throw new Error("Could not fetch recent bon commandes");
  }
}

export const getBonCommandesByFournisseurAndDateRange = async (
  fournisseurName: string,
  startDate: Date,
  endDate: Date
) => {
  try {
    const bonCommandes = await prisma.bonCommande.findMany({
      where: {
        AND: [
          {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
          {
            fournisseur: {
              nom: {
                contains: fournisseurName,
              },
            },
          },
        ],
      },
      include: {
        fournisseur: true, // Include related fournisseur data
        bonCommandeItems: {
          include: {
            produit: true, // Include related product data
          },
        },
      },
    });

    const summary = bonCommandes.map((bonCommande) => ({
      bonCommandId: bonCommande.bonCommande_id,
      date: bonCommande.createdAt.toISOString().split("T")[0],
      nom: bonCommande.fournisseur.nom,
      status: bonCommande.status.toString(),
      total: bonCommande.total.toString(),
    }));

    return summary;
  } catch (error) {
    console.error("Error fetching bon commandes: ", error);
    throw new Error("Could not fetch bon commandes");
  }
};


export async function getBonCommandeStatus(bonCommandeId: number): Promise<string | null> {
  try {
    const bonCommande = await prisma.bonCommande.findUnique({
      where: { bonCommande_id: bonCommandeId },
      select: { status: true },
    });

    if (!bonCommande) {
      console.error("BonCommande not found");
      return null;
    }

    return bonCommande.status;
  } catch (error) {
    console.error("Error fetching BonCommande status:", error);
    return null;
  }
}

export async function updateBonCommandeStatusToRecu(bonCommandeId: number): Promise<void> {
  try {
    // Start a transaction
    await prisma.$transaction(async (prisma) => {
      // Update BonCommande status to RECU
      const updatedBonCommande = await prisma.bonCommande.update({
        where: { bonCommande_id: bonCommandeId },
        data: { status: 'RECU' },
        include: {
          bonCommandeItems: true
        }
      });

      // Iterate over each BonCommandeItem to update the product quantities and stock
      for (const item of updatedBonCommande.bonCommandeItems) {
        const produitId = item.produit_id;
        const quantite = item.quantite;

        // Update the Produit model
        await prisma.produit.update({
          where: { produit_id: produitId },
          data: {
            quantite: {
              increment: quantite
            }
          }
        });

        // Update the Stock model
        await prisma.stock.update({
          where: { produit_id: produitId },
          data: {
            stock_disponible: {
              increment: quantite
            },
            stock_total: {
              increment: quantite
            }
          }
        });
      }
    });

    console.log(`BonCommande ${bonCommandeId} status updated to RECU and stock quantities updated successfully.`);
  } catch (error) {
    console.error("Error updating BonCommande status and stock quantities:", error);
    throw error;
  }
}


export async function getCommandItemsByDate(startDate:any,endDate:any){
      const result = await prisma.bonCommandeItem.findMany({
        where: {
          bonCommande: {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
        include: {
          produit: true,
        },
      });
      return result;
}