import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

interface Institution {
  id: number;
  institutionName: string;
  addressLine: string | null;
  post: string | null;
  district: string | null;
  pin: string | null;
  phone: string | null;
  phone2: string | null;
}

interface Settings {
  institutionName: string;
  place: string;
  district: string;
  pin: string;
  contactNumber: string;
  logoUrl: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const institutions: Institution[] = body.institutions || [];
    const settings: Settings = body.settings || null;

    if (institutions.length === 0) {
      return NextResponse.json(
        { error: 'No institutions provided' },
        { status: 400 }
      );
    }

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // A4 dimensions in points (1 point = 1/72 inch)
    // A4: 210mm x 297mm = 595.28pt x 841.89pt
    const pageWidth = 595.28;
    const pageHeight = 841.89;
    
    // Each slip: 105mm x 148.5mm = 297.64pt x 420.95pt
    const slipWidth = 297.64;
    const slipHeight = 420.95;

    let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
    let slipIndex = 0;

    for (const inst of institutions) {
      const col = slipIndex % 2;
      const row = Math.floor(slipIndex / 2) % 2;

      // If page is full (4 slips per page: 2x2 grid), add new page
      if (slipIndex > 0 && slipIndex % 4 === 0) {
        currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      }

      // Calculate position (2x2 grid, no margins)
      const x = col * slipWidth;
      const y = pageHeight - slipHeight - row * slipHeight;

      // Draw dashed border (cutting guide) - 0.5pt
      currentPage.drawRectangle({
        x,
        y,
        width: slipWidth,
        height: slipHeight,
        borderColor: rgb(0.6, 0.6, 0.6),
        borderWidth: 0.5,
        borderDashArray: [3, 3],
      });

      // Internal padding - 8mm = 22.68pt
      const padding = 22.68;
      let currentY = y + slipHeight - padding;

      // ===== HEADER SECTION (FROM) - Centered =====
      const headerStartX = x + padding;
      const headerWidth = slipWidth - padding * 2;

      // Logo (height: 8mm = 22.68pt) - Centered
      if (settings?.logoUrl) {
        const logoWidth = 22.68;
        const logoX = x + padding + (headerWidth - logoWidth) / 2;
        
        currentPage.drawRectangle({
          x: logoX,
          y: currentY - 22.68,
          width: logoWidth,
          height: 22.68,
          borderColor: rgb(0.8, 0.8, 0.8),
          borderWidth: 0.5,
        });
        currentY -= 25.68; // 22.68 + 3mm spacing
      }

      // FROM Label (6pt, bold, uppercase) - Centered
      const fromLabel = 'FROM';
      const fromLabelWidth = boldFont.widthOfTextAtSize(fromLabel, 6);
      const fromLabelX = x + padding + (headerWidth - fromLabelWidth) / 2;
      
      currentPage.drawText(fromLabel, {
        x: fromLabelX,
        y: currentY,
        size: 6,
        font: boldFont,
        color: rgb(0.4, 0.4, 0.4),
      });
      currentY -= 9;

      // Institution Name (8pt bold, uppercase) - Centered
      const senderName = settings?.institutionName || 'INSTITUTION NAME';
      const senderNameWidth = boldFont.widthOfTextAtSize(senderName.toUpperCase(), 8);
      const senderNameX = x + padding + (headerWidth - senderNameWidth) / 2;
      
      currentPage.drawText(senderName.toUpperCase(), {
        x: senderNameX,
        y: currentY,
        size: 8,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
      currentY -= 12;

      // Sender Address (8pt, line-height: 1.2) - Centered
      const senderAddress = `${settings?.place || ''}, ${settings?.district || ''} - ${settings?.pin || ''}`;
      const senderAddressWidth = font.widthOfTextAtSize(senderAddress, 8);
      const senderAddressX = x + padding + (headerWidth - senderAddressWidth) / 2;
      
      currentPage.drawText(senderAddress, {
        x: senderAddressX,
        y: currentY,
        size: 8,
        font,
        color: rgb(0.2, 0.2, 0.2),
      });
      currentY -= 10;

      // Contact Number (8pt) - Centered
      if (settings?.contactNumber) {
        const contactText = `Ph: ${settings.contactNumber}`;
        const contactTextWidth = boldFont.widthOfTextAtSize('Ph: ', 8) + font.widthOfTextAtSize(settings.contactNumber, 8);
        const contactX = x + padding + (headerWidth - contactTextWidth) / 2;
        
        const contactLabelWidth = boldFont.widthOfTextAtSize('Ph: ', 8);
        
        currentPage.drawText('Ph: ', {
          x: contactX,
          y: currentY,
          size: 8,
          font: boldFont,
          color: rgb(0, 0, 0),
        });
        
        currentPage.drawText(settings.contactNumber, {
          x: contactX + contactLabelWidth,
          y: currentY,
          size: 8,
          font,
          color: rgb(0.2, 0.2, 0.2),
        });
        currentY -= 12;
      }

      // Index Number - Serial Number [1] (10pt bold, bordered box)
      const indexBoxSize = 28.35; // 10mm
      const indexBoxX = x + slipWidth - padding - indexBoxSize;
      const indexBoxY = y + slipHeight - padding - indexBoxSize;
      
      currentPage.drawRectangle({
        x: indexBoxX,
        y: indexBoxY,
        width: indexBoxSize,
        height: indexBoxSize,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });
      
      const indexText = String(slipIndex + 1);
      const indexTextWidth = boldFont.widthOfTextAtSize(indexText, 10);
      currentPage.drawText(indexText, {
        x: indexBoxX + (indexBoxSize - indexTextWidth) / 2,
        y: indexBoxY + 7,
        size: 10,
        font: boldFont,
        color: rgb(0, 0, 0),
      });

      currentY -= 8;

      // ===== RECIPIENT SECTION (TO) =====
      // Draw solid black border box for TO section
      const toBoxPadding = 14.17; // 5mm
      const toBoxX = x + padding;
      const toBoxWidth = slipWidth - padding * 2;
      
      // Calculate TO box height based on content
      let toBoxHeight = 150; // Base height
      
      // Estimate content height
      let contentHeight = 0;
      contentHeight += 15.5; // "TO" header (11pt)
      contentHeight += 17; // Institution name (12pt)
      if (inst.addressLine) contentHeight += 14; // Address (10pt)
      if (inst.post || inst.district || inst.pin) contentHeight += 14;
      if (inst.phone || inst.phone2) contentHeight += 28; // Phone (10pt)
      toBoxHeight = contentHeight + toBoxPadding * 2;

      const toBoxY = currentY - toBoxHeight;

      // Draw TO box border
      currentPage.drawRectangle({
        x: toBoxX,
        y: toBoxY,
        width: toBoxWidth,
        height: toBoxHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1.5,
      });

      // "TO" Header (11pt, bold, uppercase, centered)
      const toLabel = 'TO';
      const toLabelWidth = boldFont.widthOfTextAtSize(toLabel, 11);
      currentPage.drawText(toLabel, {
        x: toBoxX + (toBoxWidth - toLabelWidth) / 2,
        y: currentY - toBoxPadding - 13,
        size: 11,
        font: boldFont,
        color: rgb(0, 0, 0),
      });

      currentY = currentY - toBoxPadding - 28;

      // Institution Name (Recipient) - 12pt, Extra Bold (Black), Uppercase, Centered
      const instNameUpper = inst.institutionName.toUpperCase();
      const instNameWidth = boldFont.widthOfTextAtSize(instNameUpper, 12);
      const instNameX = toBoxX + toBoxPadding + (toBoxWidth - toBoxPadding * 2 - instNameWidth) / 2;
      
      currentPage.drawText(instNameUpper, {
        x: instNameX,
        y: currentY,
        size: 12,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
      currentY -= 17;

      // Address Line (10pt, not bold, centered)
      if (inst.addressLine) {
        const addressWidth = font.widthOfTextAtSize(inst.addressLine, 10);
        const addressX = toBoxX + toBoxPadding + (toBoxWidth - toBoxPadding * 2 - addressWidth) / 2;
        
        currentPage.drawText(inst.addressLine, {
          x: addressX,
          y: currentY,
          size: 10,
          font,
          color: rgb(0.1, 0.1, 0.1),
        });
        currentY -= 14;
      }

      // PO (10pt, bold label)
      if (inst.post) {
        const poLabel = 'PO: ';
        const poLabelWidth = boldFont.widthOfTextAtSize(poLabel, 10);
        
        currentPage.drawText(poLabel, {
          x: toBoxX + toBoxPadding,
          y: currentY,
          size: 10,
          font: boldFont,
          color: rgb(0, 0, 0),
        });
        
        currentPage.drawText(inst.post, {
          x: toBoxX + toBoxPadding + poLabelWidth,
          y: currentY,
          size: 10,
          font,
          color: rgb(0.1, 0.1, 0.1),
        });
        currentY -= 14;
      }

      // DISTRICT (10pt, bold label)
      if (inst.district) {
        const districtLabel = 'DISTRICT: ';
        const districtLabelWidth = boldFont.widthOfTextAtSize(districtLabel, 10);
        
        currentPage.drawText(districtLabel, {
          x: toBoxX + toBoxPadding,
          y: currentY,
          size: 10,
          font: boldFont,
          color: rgb(0, 0, 0),
        });
        
        currentPage.drawText(inst.district, {
          x: toBoxX + toBoxPadding + districtLabelWidth,
          y: currentY,
          size: 10,
          font,
          color: rgb(0.1, 0.1, 0.1),
        });
        currentY -= 14;
      }

      // PIN (10pt, bold label)
      if (inst.pin) {
        const pinLabel = 'PIN: ';
        const pinLabelWidth = boldFont.widthOfTextAtSize(pinLabel, 10);
        
        currentPage.drawText(pinLabel, {
          x: toBoxX + toBoxPadding,
          y: currentY,
          size: 10,
          font: boldFont,
          color: rgb(0, 0, 0),
        });
        
        currentPage.drawText(inst.pin, {
          x: toBoxX + toBoxPadding + pinLabelWidth,
          y: currentY,
          size: 10,
          font,
          color: rgb(0.1, 0.1, 0.1),
        });
        currentY -= 14;
      }

      // PH: Both phone numbers in one row
      if (inst.phone || inst.phone2) {
        const phoneLabel = 'PH: ';
        const phoneLabelWidth = boldFont.widthOfTextAtSize(phoneLabel, 10);
        
        currentPage.drawText(phoneLabel, {
          x: toBoxX + toBoxPadding,
          y: currentY,
          size: 10,
          font: boldFont,
          color: rgb(0, 0, 0),
        });
        
        let phoneX = toBoxX + toBoxPadding + phoneLabelWidth;
        
        if (inst.phone) {
          const phoneWidth = font.widthOfTextAtSize(inst.phone, 10);
          currentPage.drawText(inst.phone, {
            x: phoneX,
            y: currentY,
            size: 10,
            font,
            color: rgb(0.1, 0.1, 0.1),
          });
          phoneX += phoneWidth;
        }
        
        if (inst.phone && inst.phone2) {
          const separator = ' | ';
          const sepWidth = font.widthOfTextAtSize(separator, 10);
          currentPage.drawText(separator, {
            x: phoneX,
            y: currentY,
            size: 10,
            font,
            color: rgb(0.3, 0.3, 0.3),
          });
          phoneX += sepWidth;
        }
        
        if (inst.phone2) {
          const phone2Width = font.widthOfTextAtSize(inst.phone2, 10);
          currentPage.drawText(inst.phone2, {
            x: phoneX,
            y: currentY,
            size: 10,
            font,
            color: rgb(0.1, 0.1, 0.1),
          });
        }
        
        currentY -= 14;
      }

      // ===== FOOTER SECTION =====
      // Date at bottom (8pt) - positioned at bottom of slip
      const date = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      
      const dateLabel = 'Date: ';
      const dateLabelWidth = boldFont.widthOfTextAtSize(dateLabel, 8);
      
      // Position date at bottom of slip (8pt = 11.34pt spacing from bottom)
      currentPage.drawText(dateLabel, {
        x: x + padding,
        y: y + padding + 11.34,
        size: 8,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
      
      currentPage.drawText(date, {
        x: x + padding + dateLabelWidth,
        y: y + padding + 11.34,
        size: 8,
        font,
        color: rgb(0.1, 0.1, 0.1),
      });

      slipIndex++;
    }

    // Serialize the PDFDocument to bytes
    const pdfBytes = await pdfDoc.save();
    const buffer = pdfBytes.buffer as ArrayBuffer;

    return new NextResponse(new Blob([buffer], { type: 'application/pdf' }), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="delivery-slips.pdf"',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
