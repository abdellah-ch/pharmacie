import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { prisma } from "../../../lib/prisma"; // Adjust the import path based on your project structure
import { writeFileSync, existsSync } from "fs";
import { join } from "path";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const commandeId = searchParams.get("commandeId");

  if (!commandeId) {
    return NextResponse.json({ error: "Missing commandeId" }, { status: 400 });
  }

  const pdfPath = join(process.cwd(), `public/colis-${commandeId}.pdf`);

  if (existsSync(pdfPath)) {
    return NextResponse.json({
      pdfUrl: `/colis-${commandeId}.pdf`,
    });
  }

  // Fetch the existing Colis data
  const colis = await prisma.colis.findFirst({
    where: { commande_id: parseInt(commandeId) },
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

  if (!colis) {
    return NextResponse.json({ error: "Colis not found" }, { status: 404 });
  }

  // If colis exists, generate the PDF
  await generateColisPdf(colis, pdfPath);
  return NextResponse.json({ pdfUrl: `/colis-${commandeId}.pdf` });
}

// Function to generate Colis PDF
async function generateColisPdf(colis: any, pdfPath: any) {
  // Create a PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 700]);
  const { width, height } = page.getSize();
  const fontSize = 12;
  const margin = 50;
  const lineHeight = fontSize + 6;
  const rowHeight = lineHeight + 10; // Adjust row height for better spacing
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Helper function to draw text centered in the row
  const drawCenteredText = (
    text: any,
    x: any,
    y: any,
    rowHeight: any,
    options = {}
  ) => {
    const textY = y - (rowHeight - fontSize) / 2;
    page.drawText(text, {
      x,
      y: textY,
      size: fontSize,
      font: regularFont,
      ...options,
    });
  };

  // Header
  page.drawText("COLIS", {
    x: margin,
    y: height - margin,
    size: fontSize + 4,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  page.drawText(`N° de colis ${colis.colis_id}`, {
    x: margin,
    y: height - margin - lineHeight,
    size: fontSize + 4,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  // Client Information
  const clientY = height - margin - 3 * lineHeight;
  drawCenteredText(
    `Date de la colis: ${colis.createdAt.toLocaleDateString()}`,
    margin,
    clientY,
    rowHeight
  );

  drawCenteredText(
    `Livrer à: ${colis.commande.client.nom}`,
    margin,
    clientY - 2 * lineHeight,
    rowHeight
  );
  drawCenteredText(
    `${colis.commande.client.adresse}`,
    margin,
    clientY - 3 * lineHeight,
    rowHeight
  );
  drawCenteredText(
    `${colis.commande.client.email}`,
    margin,
    clientY - 4 * lineHeight,
    rowHeight
  );

  // Order Items Table Header
  const tableHeaderY = clientY - 6 * lineHeight;
  page.drawRectangle({
    x: margin - 5,
    y: tableHeaderY - rowHeight + 5,
    width: width - 2 * margin + 10,
    height: rowHeight,
    color: rgb(0.8, 0.8, 0.8),
  });

  drawCenteredText("# Article & Description", margin, tableHeaderY, rowHeight, {
    font: boldFont,
  });
  drawCenteredText("Quantité", width / 2 - margin, tableHeaderY, rowHeight, {
    font: boldFont,
  });
  drawCenteredText("Taux", width / 2 + margin, tableHeaderY, rowHeight, {
    font: boldFont,
  });
  drawCenteredText("Montant", width - 3 * margin, tableHeaderY, rowHeight, {
    font: boldFont,
  });

  // Order Items
  let currentItemY = tableHeaderY - rowHeight;
  colis.commande.commandeItems.forEach((item: any, index: any) => {
    page.drawRectangle({
      x: margin - 5,
      y: currentItemY - rowHeight + 5,
      width: width - 2 * margin + 10,
      height: rowHeight,
      borderColor: rgb(0.8, 0.8, 0.8),
      borderWidth: 1,
    });
    drawCenteredText(
      `${item.produit.designation}`,
      margin,
      currentItemY,
      rowHeight
    );
    drawCenteredText(
      `${item.quantite}`,
      width / 2 - margin,
      currentItemY,
      rowHeight
    );
    drawCenteredText(
      `${item.produit.prix_Vente.toFixed(2)}`,
      width / 2 + margin,
      currentItemY,
      rowHeight
    );
    drawCenteredText(
      `${(item.quantite * item.produit.prix_Vente).toFixed(2)}`,
      width - 3 * margin,
      currentItemY,
      rowHeight
    );
    currentItemY -= rowHeight;
  });

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();

  // Save PDF to a file
  writeFileSync(pdfPath, pdfBytes);
}
