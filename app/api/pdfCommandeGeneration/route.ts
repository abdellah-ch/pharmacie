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
    text: string,
    x: number,
    y: number,
    rowHeight: number,
    options: any = {}
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
  drawCenteredText(
    `Date de la commande: ${commande.createdAt.toLocaleDateString()}`,
    margin,
    clientY,
    rowHeight
  );

  drawCenteredText(
    `Facturer à: ${commande.client.nom}`,
    margin,
    clientY - 2 * lineHeight,
    rowHeight
  );
  drawCenteredText(
    `${commande.client.adresse}`,
    margin,
    clientY - 3 * lineHeight,
    rowHeight
  );
  drawCenteredText(
    `${commande.client.email}`,
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
  commande.commandeItems.forEach((item) => {
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

  // Order Summary
  const summaryY = currentItemY - 2 * rowHeight;
  drawCenteredText(
    `Sous-total: MAD ${commande.total.toFixed(2)}`,
    width - 3 * margin,
    summaryY,
    rowHeight
  );
  drawCenteredText(
    `Total: MAD ${commande.total.toFixed(2)}`,
    width - 3 * margin,
    summaryY - rowHeight,
    rowHeight,
    { font: boldFont }
  );

  // Serialize the PDFDocument to bytes (a Uint8Array)
  const pdfBytes = await pdfDoc.save();

  // Return the PDF as a binary response
  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="commande-${commandeId}.pdf"`,
    },
  });
}
