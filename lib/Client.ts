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

export const getRecentClients = async (limit: number = 5) => {
  try {
    const clients = await prisma.client.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
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
  date: Date | undefined,
  items: CommandeItemInput[]
) => {
  try {
    return await prisma.$transaction(async (prisma) => {
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
          createdAt: date,
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
      for (const item of items) {
        await prisma.stock.update({
          where: { produit_id: item.product_id },
          data: {
            stock_total: { decrement: item.quantity },
            stock_engage: { increment: item.quantity },
          },
        });
      }
    });

    // return newCommand;
  } catch (error) {
    console.error(error);
  }
};

export async function getRecentCommands(limit: number) {
  try {
    const commands = await prisma.commande.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      include: {
        client: true, // Include related client data
        commandeItems: {
          include: {
            produit: true, // Include related product data
          },
        },
      },
    });
    const summary = commands.map((command) => ({
      commandId: command.commande_id,
      date: command.createdAt.toISOString().split("T")[0],
      nom: command.client.nom,
      status: command.status.toString(),
      total: command.total.toString(),
    }));
    return summary;
  } catch (error) {
    console.error("Error fetching recent commands: ", error);
    throw new Error("Could not fetch recent commands");
  }
}

export const getCommandsByClientAndDateRange = async (
  clientName: string,
  startDate: Date,
  endDate: Date
) => {
  try {
    const commands = await prisma.commande.findMany({
      where: {
        AND: [
          {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
          {
            client: {
              nom: {
                contains: clientName,
              },
            },
          },
        ],
      },
      include: {
        client: true, // Include related client data
        commandeItems: {
          include: {
            produit: true, // Include related product data
          },
        },
      },
    });

    const summary = commands.map((command) => ({
      commandId: command.commande_id,
      date: command.createdAt.toISOString().split("T")[0],
      nom: command.client.nom,
      status: command.status.toString(),
      total: command.total.toString(),
    }));

    return summary;
  } catch (error) {
    console.error("Error fetching commands: ", error);
    throw new Error("Could not fetch commands");
  }
};

export const getTotalSalesForYear = async (year: number) => {
  const startDate = new Date(year, 0, 1); // January 1 of the given year
  const endDate = new Date(year + 1, 0, 1); // January 1 of the next year

  const commandes = await prisma.commande.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lt: endDate,
      },
      status: 'LIVREE' // Ensure the status is LIVREE
    },
  });

  const totalSales = commandes.reduce((acc, commande) => acc + commande.total, 0);

  return totalSales;
};


export async function checkCommandStatus(commandId: number): Promise<string | null> {
  try {
    const command = await prisma.commande.findUnique({
      where: { commande_id: commandId },
      select: { status: true },
    });

    if (!command) {
      return null;
    }

    return command.status;
  } catch (error) {
    console.error('Error checking command status:', error);
    return null;
  }
}