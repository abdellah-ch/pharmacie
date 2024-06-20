"use server";
import { prisma } from "./prisma";

export async function CheckIfColisExists(commandeId: number) {
  let colis = await prisma.colis.findFirst({
    where: { commande_id: commandeId },
  });
  if (!colis) {
    return false;
  }
  return colis;
}

export async function CreeColis(commandeId: number) {
  try {
    await prisma.colis.create({
      data: {
        commande_id: commandeId,
        status: "EMBALLE",
      },
      include: {
        commande: {
          include: {
            client: true,
            commandeItems: {
              include: {
                produit: true,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("error creating the colis");
  }
}

export async function updateColisStatusToLivree(
  commandeId: number
): Promise<void> {
  try {
    // Start a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Update the status of all colis related to the commandeId to LIVREE
      const updatedColis = await prisma.colis.updateMany({
        where: {
          commande_id: commandeId,
        },
        data: {
          status: "LIVREE",
        },
      });

      if (updatedColis.count === 0) {
        console.log(`No Colis found for commandeId ${commandeId}`);
        return;
      }

      // Update the status of the corresponding commande to LIVREE
      const updatedCommande = await prisma.commande.update({
        where: {
          commande_id: commandeId,
        },
        data: {
          status: "LIVREE",
        },
      });

      if (!updatedCommande) {
        console.log(`Commande with id ${commandeId} not found`);
        return;
      }

      // Get the products and their quantities from the commande items
      const commandeItems = await prisma.commandeItem.findMany({
        where: {
          commande_id: commandeId,
        },
        include: {
          produit: true,
        },
      });

      // Update the stock levels for each product
      for (const item of commandeItems) {
        await prisma.stock.update({
          where: {
            produit_id: item.produit_id,
          },
          data: {
            stock_disponible: {
              decrement: item.quantite,
            },
            stock_engage: {
              decrement: item.quantite,
            },
          },
        });
        await prisma.produit.update({
          where: {
            produit_id: item.produit_id,
          },
          data: {
            quantite: {
              decrement: item.quantite,
            },
          },
        });
      }

      console.log(
        `Colis and Commande status updated to LIVREE for commandeId ${commandeId}`
      );
    });
  } catch (error) {
    console.error(`Error updating Colis and Commande status: ${error}`);
  } finally {
    await prisma.$disconnect();
  }
}
