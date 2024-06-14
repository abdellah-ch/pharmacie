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
