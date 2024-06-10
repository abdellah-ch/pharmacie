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
