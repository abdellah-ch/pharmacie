import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { prisma } from "../../../lib/prisma"; // Adjust the import path based on your project structure

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const commandeId = searchParams.get("commandeId");

  if (!commandeId) {
    return NextResponse.json({ error: "Missing commandeId" }, { status: 400 });
  }

  // Fetch the commande data
  const commande = await prisma.commande.findUnique({
    where: { commande_id: parseInt(commandeId) },
    include: {
      client: true,
      commandeItems: {
        include: {
          produit: true,
        },
      },
    },
  });

  if (!commande) {
    return NextResponse.json({ error: "Commande not found" }, { status: 404 });
  }

  // Create a PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([700, 500]);
  const { width, height } = page.getSize();
  const fontSize = 12;
  const margin = 50;
  const lineHeight = fontSize + 6;
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Helper function to draw text
  const drawText = (text, x, y, options = {}) => {
    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font: regularFont,
      ...options,
    });
  };

  // Header
  page.drawText("COMMANDE CLIENT", {
    x: margin,
    y: height - margin,
    size: fontSize + 4,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  page.drawText(`N° de commande client ${commande.commande_id}`, {
    x: margin,
    y: height - margin - lineHeight,
    size: fontSize + 4,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  // Client Information
  const clientY = height - margin - 3 * lineHeight;
  drawText(
    `Date de la commande: ${commande.createdAt.toLocaleDateString()}`,
    margin,
    clientY
  );

  drawText(
    `Facturer à: ${commande.client.nom}`,
    margin,
    clientY - 4 * lineHeight
  );
  drawText(`${commande.client.adresse}`, margin, clientY - 5 * lineHeight);
  drawText(`${commande.client.email}`, margin, clientY - 6 * lineHeight);

  // Order Items Table Header
  const tableHeaderY = clientY - 8 * lineHeight;
  page.drawText(`# Article & Description`, {
    x: margin,
    y: tableHeaderY,
    size: fontSize,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  page.drawText(`Quantité`, {
    x: width / 2 - margin,
    y: tableHeaderY,
    size: fontSize,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  page.drawText(`Taux`, {
    x: width / 2 + margin,
    y: tableHeaderY,
    size: fontSize,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  page.drawText(`Montant`, {
    x: width - 3 * margin,
    y: tableHeaderY,
    size: fontSize,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  // Order Items
  let currentItemY = tableHeaderY - lineHeight;
  commande.commandeItems.forEach((item, index) => {
    drawText(`${item.produit.designation}`, margin, currentItemY);
    drawText(`${item.quantite}`, width / 2 - margin, currentItemY);
    drawText(
      `${item.produit.prix_Vente.toFixed(2)}`,
      width / 2 + margin,
      currentItemY
    );
    drawText(
      `${(item.quantite * item.produit.prix_Vente).toFixed(2)}`,
      width - 3 * margin,
      currentItemY
    );
    currentItemY -= lineHeight;
  });

  // Order Summary
  const summaryY = currentItemY - lineHeight;
  drawText(
    `Sous-total: ${commande.total.toFixed(2)}`,
    width - 3 * margin,
    summaryY
  );
  drawText(
    `Total: MAD${commande.total.toFixed(2)}`,
    width - 3 * margin,
    summaryY - lineHeight
  );

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();

  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="commande-${commandeId}.pdf"`,
    },
  });
}
