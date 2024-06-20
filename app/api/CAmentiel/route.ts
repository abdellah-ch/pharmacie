// File: pages/api/revenue.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma"; // Adjust the import path based on your project structure

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const year = parseInt(
    searchParams.get("year") || new Date().getFullYear().toString()
  );

  if (isNaN(year)) {
    return NextResponse.json({ error: "Invalid year" }, { status: 400 });
  }

  // Fetch the sum of total for each month of the specified year
  const monthlyRevenue = await prisma.commande.findMany({
    where: {
      createdAt: {
        gte: new Date(`${year}-01-01T00:00:00Z`),
        lt: new Date(`${year + 1}-01-01T00:00:00Z`),
      },
      status: "LIVREE", // Assuming you only want to consider delivered orders
    },
    select: {
      createdAt: true,
      total: true,
    },
  });

  const result = Array(12).fill(0);

  // Sum the total revenue for each month
  monthlyRevenue.forEach((entry: any) => {
    const month = new Date(entry.createdAt).getMonth();
    result[month] += entry.total;
  });

  return NextResponse.json({ year, monthlyRevenue: result });
}
