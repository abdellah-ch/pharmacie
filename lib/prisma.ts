import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined; //add prisma propretie to the global scope
}

export const prisma = globalThis.prisma || new PrismaClient(); //export new PrismaClient() if globalThis.prisma is undefined

if (process.env.NODE_ENV != "production") globalThis.prisma = prisma; //assigns the db object to the globalThis.prisma variable.
