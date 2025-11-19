import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

const mergePDFs = async (firstPageBase64, uploadedFiles) => {
  const mergedPdf = await PDFDocument.create();

  // 1️⃣ Add first page from frontend (Base64)
  const firstPageBytes = Uint8Array.from(atob(firstPageBase64), c => c.charCodeAt(0));
  const firstPdf = await PDFDocument.load(firstPageBytes);
  const [copiedPage] = await mergedPdf.copyPages(firstPdf, [0]);
  mergedPdf.addPage(copiedPage);

  // 2️⃣ Add uploaded PDFs
  for (const filePath of uploadedFiles) {
    const pdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    pages.forEach(page => mergedPdf.addPage(page));
  }

  // 3️⃣ Save final merged PDF
  const folderPath = path.join(process.cwd(), 'uploads', 'merged');
  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

  const fileName = `merged_${Date.now()}.pdf`;
  const filePath = path.join(folderPath, fileName);

  const mergedBytes = await mergedPdf.save();
  fs.writeFileSync(filePath, mergedBytes);

  return filePath; 
};
