"use server";
import { prisma } from "./prisma";

interface CreateClientInput {
  nom: string;
  email: string;
  nomSociete?: string | undefined;
  telephone?: string | undefined;
  adresse?: string | undefined;
  codePostal?: number | undefined;
  Region?: string | undefined;
}

export async function createClient(data: CreateClientInput) {
  try {
    const client = await prisma.client.create({
      data,
    });
    return client;
  } catch (error) {
    console.error("Failed to create client", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export const getRecentClients = async () => {
  try {
    const clients = await prisma.client.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });
    return clients;
  } catch (error) {
    console.error("Failed to fetch recent clients", error);
    throw new Error("Failed to fetch recent clients");
  }
};

export const searchClients = async (searchQuery: string) => {
  try {
    const clients = await prisma.client.findMany({
      where: {
        nom: {
          contains: searchQuery,
        },
      },

      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    return clients;
  } catch (error) {
    console.error("Failed to search clients", error);
    throw new Error("Failed to search clients");
  }
};

//create the client command

interface CommandeItemInput {
  productName: string;
  quantity: number;
  monto: number;
  product_id: number;
  product_img: string | null;
  stock: number | undefined;
  prix_vente: number;
}
export const InsertCommandInfo = async (
  clientId: number,
  items: CommandeItemInput[]
) => {
  try {
    let total = 0;

    for (const item of items) {
      total += item.monto;
    }

    //create
    const newCommand = await prisma.commande.create({
      data: {
        client_id: clientId,
        total,
        status: "ENCOURS",
        commandeItems: {
          create: items.map((item) => ({
            produit_id: item.product_id,
            quantite: item.quantity,
          })),
        },
      },
      include: {
        commandeItems: true,
      },
    });

    //TODO: update product stock

    return newCommand;
  } catch (error) {
    console.error(error);
  }
};
