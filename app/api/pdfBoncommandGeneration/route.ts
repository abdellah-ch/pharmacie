import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { prisma } from "../../../lib/prisma"; // Adjust the import path based on your project structure

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bonCommandeId = searchParams.get("bonCommandeId");

  if (!bonCommandeId) {
    return NextResponse.json({ error: "Missing bonCommandeId" }, { status: 400 });
  }

  // Fetch the bonCommande data
  const bonCommande = await prisma.bonCommande.findUnique({
    where: { bonCommande_id: parseInt(bonCommandeId) },
    include: {
      fournisseur: true,
      bonCommandeItems: {
        include: {
          produit: true,
        },
      },
    },
  });

  if (!bonCommande) {
    return NextResponse.json({ error: "BonCommande not found" }, { status: 404 });
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
  page.drawText("BON DE COMMANDE", {
    x: margin,
    y: height - margin,
    size: fontSize + 4,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  page.drawText(`N° de bon de commande ${bonCommande.bonCommande_id}`, {
    x: margin,
    y: height - margin - lineHeight,
    size: fontSize + 4,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  // Fournisseur Information
  const fournisseurY = height - margin - 3 * lineHeight;
  drawCenteredText(
    `Date de la commande: ${bonCommande.createdAt.toLocaleDateString()}`,
    margin,
    fournisseurY,
    rowHeight
  );

  drawCenteredText(
    `Fournisseur: ${bonCommande.fournisseur.nom}`,
    margin,
    fournisseurY - 2 * lineHeight,
    rowHeight
  );
  drawCenteredText(
    `${bonCommande.fournisseur.adresse}`,
    margin,
    fournisseurY - 3 * lineHeight,
    rowHeight
  );
  drawCenteredText(
    `${bonCommande.fournisseur.email}`,
    margin,
    fournisseurY - 4 * lineHeight,
    rowHeight
  );

  // Order Items Table Header
  const tableHeaderY = fournisseurY - 6 * lineHeight;
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
  drawCenteredText("Prix Unitaire", width / 2 + margin, tableHeaderY, rowHeight, {
    font: boldFont,
  });
  drawCenteredText("Montant", width - 3 * margin, tableHeaderY, rowHeight, {
    font: boldFont,
  });

  // Order Items
  let currentItemY = tableHeaderY - rowHeight;
  bonCommande.bonCommandeItems.forEach((item) => {
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
      `${item.prixUnitaire.toFixed(2)}`,
      width / 2 + margin,
      currentItemY,
      rowHeight
    );
    drawCenteredText(
      `${(item.quantite * item.prixUnitaire).toFixed(2)}`,
      width - 3 * margin,
      currentItemY,
      rowHeight
    );
    currentItemY -= rowHeight;
  });

  // Order Summary
  const summaryY = currentItemY - 2 * rowHeight;
  drawCenteredText(
    `Sous-total: MAD ${bonCommande.total.toFixed(2)}`,
    width - 3 * margin,
    summaryY,
    rowHeight
  );
  drawCenteredText(
    `Total: MAD ${bonCommande.total.toFixed(2)}`,
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
      "Content-Disposition": `attachment; filename="bonCommande-${bonCommandeId}.pdf"`,
    },
  });
}
