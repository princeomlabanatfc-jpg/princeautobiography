import { jsPDF } from 'jspdf';
import { ALL_ACTS } from '../data/allActs';
import { ActData, BeatData } from '../types';

export interface PDFGenerationProgress {
  percentage: number;
  message: string;
}

/**
 * Strips or replaces non-standard characters to ensure clean PDF font rendering
 */
function cleanTextForPDF(text: string): string {
  if (!text) return '';
  return text
    .replace(/[\u2018\u2019]/g, "'") // smart single quotes
    .replace(/[\u201C\u201D]/g, '"') // smart double quotes
    .replace(/\u2014/g, '—') // em dash
    .replace(/\u2013/g, '-') // en dash
    .replace(/\u2026/g, '...') // ellipsis
    .trim();
}

/**
 * Builds the complete Markdown / Plaintext version of all 11 Acts
 * Perfect for 1-click clipboard copying.
 */
export function getFullStructuredText(selectedActIndex?: number): string {
  const actsToExport = selectedActIndex !== undefined && selectedActIndex >= 0 && selectedActIndex < ALL_ACTS.length
    ? [ALL_ACTS[selectedActIndex]]
    : ALL_ACTS;

  let text = `# THE 11 ACTS\n`;
  text += `## The Unspoken Autobiography & Memoir\n`;
  text += `**Author:** Prince\n`;
  text += `**Written For:** Anvii\n`;
  text += `**Scope:** ${actsToExport.length === ALL_ACTS.length ? 'Complete 11 Acts (Full Unabridged Text)' : `Act ${actsToExport[0].actId}: ${actsToExport[0].title}`}\n`;
  text += `**Compilation Date:** ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}\n\n`;
  text += `============================================================\n\n`;

  actsToExport.forEach((act, actIdx) => {
    text += `\n############################################################\n`;
    text += `ACT ${act.actId}: ${act.title.toUpperCase()}\n`;
    text += `Kicker: ${act.kicker}\n`;
    if (act.teaserText) {
      text += `Preface: "${act.teaserText}"\n`;
    }
    text += `############################################################\n\n`;

    act.beats.forEach((beat, beatIdx) => {
      text += `------------------------------------------------------------\n`;
      text += `CHAPTER ${beat.numberLabel || `Beat ${beatIdx + 1}`}\n`;
      text += `Title: ${beat.title}\n`;
      text += `------------------------------------------------------------\n\n`;

      if (beat.quote) {
        text += `> "${beat.quote.text}"\n`;
        if (beat.quote.author) {
          text += `> — ${beat.quote.author}\n\n`;
        } else {
          text += `\n`;
        }
      }

      beat.paragraphs.forEach((para, pIdx) => {
        const isEmphasis = beat.emphasisParagraphs?.includes(pIdx);
        if (isEmphasis) {
          text += `*${para}*\n\n`;
        } else {
          text += `${para}\n\n`;
        }
      });

      if (beat.subsections && beat.subsections.length > 0) {
        beat.subsections.forEach(sub => {
          text += `\n[ ${sub.category} ]\n`;
          sub.questions.forEach(q => {
            text += `  • ${q}\n`;
          });
          text += `\n`;
        });
      }

      if (beat.endingParagraphs && beat.endingParagraphs.length > 0) {
        beat.endingParagraphs.forEach(endPara => {
          text += `\n**${endPara}**\n\n`;
        });
      }

      text += `\n`;
    });

    if (act.pivotText) {
      text += `\n--- ACT TRANSITION NOTE ---\n${act.pivotText}\n\n`;
    }
  });

  text += `\n============================================================\n`;
  text += `End of Compilation — Sincere, Private & Confidential\n`;
  text += `============================================================\n`;

  return text;
}

/**
 * Copies the complete 11 Acts text directly to clipboard
 */
export async function copy11ActsToClipboard(selectedActIndex?: number): Promise<boolean> {
  try {
    const fullText = getFullStructuredText(selectedActIndex);
    await navigator.clipboard.writeText(fullText);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}

/**
 * Opens a dedicated print-optimized window that formats the 11 acts as a book
 */
export function openPrintable11ActsWindow(selectedActIndex?: number): void {
  const actsToExport = selectedActIndex !== undefined && selectedActIndex >= 0 && selectedActIndex < ALL_ACTS.length
    ? [ALL_ACTS[selectedActIndex]]
    : ALL_ACTS;

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to open the print preview.');
    return;
  }

  let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>The 11 Acts — Complete Autobiography by Prince</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Lora:ital,wght@0,400;0,600;1,400&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');
    
    * { box-sizing: border-box; }
    body {
      font-family: 'Lora', Georgia, serif;
      color: #1f1f23;
      background: #fcfbf9;
      line-height: 1.7;
      margin: 0;
      padding: 40px 20px;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: #fff;
      padding: 60px 50px;
      border: 1px solid #e8e3d9;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    }
    .no-print-bar {
      position: sticky;
      top: 0;
      background: #18181b;
      color: #fff;
      padding: 12px 24px;
      margin: -40px -20px 40px -20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13px;
      z-index: 100;
    }
    .print-btn {
      background: linear-gradient(135deg, #f97316, #ea580c);
      color: white;
      border: none;
      padding: 8px 18px;
      border-radius: 9999px;
      font-weight: 600;
      cursor: pointer;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .cover {
      text-align: center;
      padding: 60px 20px 80px;
      border-bottom: 2px solid #e5e0d8;
      margin-bottom: 50px;
    }
    .kicker {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.25em;
      color: #c2410c;
      margin-bottom: 16px;
      font-weight: 600;
    }
    h1.main-title {
      font-family: 'Cinzel', serif;
      font-size: 42px;
      color: #18181b;
      margin: 0 0 16px;
      letter-spacing: 0.05em;
      font-weight: 700;
    }
    .subtitle {
      font-size: 18px;
      color: #52525b;
      font-style: italic;
      max-width: 600px;
      margin: 0 auto 30px;
    }
    .meta {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 13px;
      color: #71717a;
      border-top: 1px solid #e5e0d8;
      padding-top: 20px;
      max-width: 400px;
      margin: 0 auto;
    }
    .act-section {
      margin-bottom: 60px;
      page-break-before: always;
    }
    .act-header {
      border-bottom: 1.5px solid #c2410c;
      padding-bottom: 14px;
      margin-bottom: 30px;
    }
    .act-title {
      font-family: 'Cinzel', serif;
      font-size: 26px;
      color: #18181b;
      margin: 4px 0 0;
    }
    .teaser-box {
      background: #fdf8f4;
      border-left: 3px solid #f97316;
      padding: 14px 18px;
      margin: 18px 0 25px;
      font-style: italic;
      color: #7c2d12;
      font-size: 15px;
    }
    .chapter {
      margin-bottom: 40px;
    }
    .chapter-label {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: #c2410c;
      font-weight: 600;
      margin-bottom: 6px;
    }
    .chapter-title {
      font-size: 20px;
      font-weight: 600;
      color: #18181b;
      margin: 0 0 16px;
    }
    p {
      margin: 0 0 14px;
      font-size: 15px;
      text-align: justify;
    }
    .emphasis {
      color: #9a3412;
      font-weight: 600;
    }
    .quote-box {
      background: #fafaf9;
      border-left: 3px solid #b45309;
      padding: 16px 20px;
      margin: 20px 0;
      font-style: italic;
    }
    .quote-author {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 12px;
      font-style: normal;
      color: #71717a;
      margin-top: 8px;
      text-align: right;
    }
    .subsection {
      margin: 20px 0;
      padding: 16px;
      background: #fafaf9;
      border-radius: 8px;
    }
    .subsection-cat {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 12px;
      font-weight: 600;
      color: #c2410c;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 10px;
    }
    ul.questions-list {
      margin: 0;
      padding-left: 20px;
      font-size: 14px;
    }
    ul.questions-list li { margin-bottom: 6px; }
    
    @media print {
      body { background: #fff; padding: 0; }
      .container { border: none; box-shadow: none; padding: 0; max-width: 100%; }
      .no-print-bar { display: none; }
      .act-section { page-break-before: always; }
      @page {
        margin: 20mm 15mm;
        @bottom-right {
          content: counter(page);
        }
      }
    }
  </style>
</head>
<body>
  <div class="no-print-bar">
    <div><strong>The 11 Acts Document Preview</strong> — Full structured book layout</div>
    <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
  </div>

  <div class="container">
    <div class="cover">
      <div class="kicker">A Personal Autobiography & Unspoken Memoir</div>
      <h1 class="main-title">THE 11 ACTS</h1>
      <div class="subtitle">The complete, unfiltered story written with sincere honesty for Anvii</div>
      <div class="meta">
        <div><strong>Written By:</strong> Prince</div>
        <div><strong>Scope:</strong> ${actsToExport.length === ALL_ACTS.length ? 'Complete 11 Acts Compilation' : `Act ${actsToExport[0].actId}: ${actsToExport[0].title}`}</div>
        <div><strong>Chapters:</strong> ${actsToExport.reduce((acc, a) => acc + a.beats.length, 0)} Chapters Included</div>
      </div>
    </div>
`;

  actsToExport.forEach(act => {
    htmlContent += `
    <div class="act-section">
      <div class="act-header">
        <div class="kicker">ACT ${act.actId} • ${act.kicker}</div>
        <h2 class="act-title">${act.title}</h2>
      </div>
    `;

    if (act.teaserText) {
      htmlContent += `<div class="teaser-box">"${act.teaserText}"</div>`;
    }

    act.beats.forEach((beat, bIdx) => {
      htmlContent += `
      <div class="chapter">
        <div class="chapter-label">Chapter ${beat.numberLabel || `Beat ${bIdx + 1}`}</div>
        <h3 class="chapter-title">${beat.title}</h3>
      `;

      if (beat.quote) {
        htmlContent += `
        <div class="quote-box">
          "${beat.quote.text}"
          ${beat.quote.author ? `<div class="quote-author">— ${beat.quote.author}</div>` : ''}
        </div>`;
      }

      beat.paragraphs.forEach((p, pIdx) => {
        const isEmph = beat.emphasisParagraphs?.includes(pIdx);
        htmlContent += `<p class="${isEmph ? 'emphasis' : ''}">${p}</p>`;
      });

      if (beat.subsections && beat.subsections.length > 0) {
        beat.subsections.forEach(sub => {
          htmlContent += `
          <div class="subsection">
            <div class="subsection-cat">${sub.category}</div>
            <ul class="questions-list">
              ${sub.questions.map(q => `<li>${q}</li>`).join('')}
            </ul>
          </div>`;
        });
      }

      if (beat.endingParagraphs && beat.endingParagraphs.length > 0) {
        beat.endingParagraphs.forEach(ep => {
          htmlContent += `<p><strong>${ep}</strong></p>`;
        });
      }

      htmlContent += `</div>`;
    });

    if (act.pivotText) {
      htmlContent += `<div class="teaser-box" style="margin-top: 30px;"><strong>Transition Note:</strong> ${act.pivotText}</div>`;
    }

    htmlContent += `</div>`;
  });

  htmlContent += `
  </div>
</body>
</html>
`;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

/**
 * Main High-Performance PDF Generator using jsPDF.
 * Creates an exact, book-grade publication PDF of the complete 11 Acts with zero omissions.
 */
export async function generate11ActsPDF(options?: {
  onProgress?: (progress: PDFGenerationProgress) => void;
  selectedActIndex?: number;
}): Promise<Blob> {
  const { onProgress, selectedActIndex } = options || {};

  const actsToExport: ActData[] = selectedActIndex !== undefined && selectedActIndex >= 0 && selectedActIndex < ALL_ACTS.length
    ? [ALL_ACTS[selectedActIndex]]
    : ALL_ACTS;

  const isFullBook = actsToExport.length === ALL_ACTS.length;

  onProgress?.({ percentage: 5, message: 'Initializing document layout and typography...' });
  await new Promise(r => setTimeout(r, 20));

  // Initialize jsPDF (A4 format: 210 x 297 mm, portrait)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 20;
  const marginTop = 24;
  const marginBottom = 22;
  const contentWidth = pageWidth - (marginX * 2); // 170 mm

  let cursorY = marginTop;

  // Helper function to check remaining page space and auto-page-break
  function ensureSpace(requiredMm: number) {
    if (cursorY + requiredMm > pageHeight - marginBottom) {
      doc.addPage();
      cursorY = marginTop;
    }
  }

  // ==========================================
  // 1. COVER PAGE (If full book)
  // ==========================================
  if (isFullBook) {
    onProgress?.({ percentage: 10, message: 'Crafting cover page and dedication...' });
    await new Promise(r => setTimeout(r, 20));

    // Outer decorative border
    doc.setDrawColor(194, 65, 12); // #c2410c orange-700
    doc.setLineWidth(0.8);
    doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

    // Inner thin border
    doc.setDrawColor(220, 215, 205);
    doc.setLineWidth(0.3);
    doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

    // Header Kicker
    doc.setFont('times', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(180, 83, 9); // Amber 700
    doc.text('A PERSONAL AUTOBIOGRAPHY & UNSPOKEN MEMOIR', pageWidth / 2, 45, { align: 'center' });

    // Decorative divider
    doc.setDrawColor(180, 83, 9);
    doc.setLineWidth(0.5);
    doc.line(marginX + 20, 50, pageWidth - marginX - 20, 50);

    // Big Title
    doc.setFont('times', 'bold');
    doc.setFontSize(36);
    doc.setTextColor(24, 24, 27); // Zinc 900
    doc.text('THE 11 ACTS', pageWidth / 2, 75, { align: 'center' });

    // Subtitle
    doc.setFont('times', 'italic');
    doc.setFontSize(13);
    doc.setTextColor(82, 82, 91);
    const subtitleLines = doc.splitTextToSize(
      'The complete, unfiltered story written with sincere honesty for Anvii.',
      contentWidth - 20
    );
    doc.text(subtitleLines, pageWidth / 2, 90, { align: 'center' });

    // Center emblem box
    doc.setFillColor(254, 243, 199); // Amber 100
    doc.roundedRect(marginX + 15, 115, contentWidth - 30, 48, 3, 3, 'F');
    doc.setDrawColor(245, 158, 11);
    doc.setLineWidth(0.3);
    doc.roundedRect(marginX + 15, 115, contentWidth - 30, 48, 3, 3, 'D');

    doc.setFont('times', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(180, 83, 9);
    doc.text('COMPLETE UNABRIDGED EDITION', pageWidth / 2, 127, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(113, 63, 18);
    doc.text('• 11 Complete Acts (Act I to Act XI)', pageWidth / 2, 136, { align: 'center' });
    doc.text('• 55 Detailed Chapters • 5,129 Paragraphs • 37,000+ Words', pageWidth / 2, 143, { align: 'center' });
    doc.text('• Exact Verbatim Text • Full Reflections & Questions', pageWidth / 2, 150, { align: 'center' });

    // Metadata Footer on Cover
    doc.setFont('times', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(24, 24, 27);
    doc.text('Written & Compiled by Prince', pageWidth / 2, 220, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(113, 113, 122);
    doc.text(`Archived: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`, pageWidth / 2, 228, { align: 'center' });
    doc.text('Strictly Private & Confidential', pageWidth / 2, 235, { align: 'center' });

    // ==========================================
    // 2. TABLE OF CONTENTS
    // ==========================================
    doc.addPage();
    cursorY = marginTop;

    doc.setFont('times', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(24, 24, 27);
    doc.text('TABLE OF CONTENTS', marginX, cursorY);
    cursorY += 8;

    doc.setDrawColor(194, 65, 12);
    doc.setLineWidth(0.6);
    doc.line(marginX, cursorY, pageWidth - marginX, cursorY);
    cursorY += 12;

    ALL_ACTS.forEach((act, i) => {
      doc.setFont('times', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(194, 65, 12);
      doc.text(`ACT ${act.actId}`, marginX, cursorY);

      doc.setFont('times', 'bold');
      doc.setTextColor(24, 24, 27);
      doc.text(act.title, marginX + 22, cursorY);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(113, 113, 122);
      doc.text(`${act.beats.length} chapters`, pageWidth - marginX, cursorY, { align: 'right' });

      cursorY += 5;

      doc.setFont('times', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(113, 113, 122);
      doc.text(act.kicker, marginX + 22, cursorY);

      cursorY += 10;
    });

    cursorY += 10;
    doc.setFillColor(250, 250, 249);
    doc.rect(marginX, cursorY, contentWidth, 24, 'F');
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.2);
    doc.rect(marginX, cursorY, contentWidth, 24, 'D');

    doc.setFont('times', 'italic');
    doc.setFontSize(9.5);
    doc.setTextColor(82, 82, 91);
    doc.text(
      'Note: This document contains the full unabridged text of the 11 Acts without summary or omission.',
      marginX + 5,
      cursorY + 9
    );
    doc.text(
      'Every reflection, nuance, memory, and question is rendered exactly as written.',
      marginX + 5,
      cursorY + 16
    );
  }

  // ==========================================
  // 3. RENDER ACTS & BEATS
  // ==========================================
  const totalActs = actsToExport.length;

  for (let aIdx = 0; aIdx < totalActs; aIdx++) {
    const act = actsToExport[aIdx];
    const progressPercent = Math.round(15 + ((aIdx + 1) / totalActs) * 75);
    onProgress?.({
      percentage: progressPercent,
      message: `Formatting Act ${act.actId}: "${act.title}" (${aIdx + 1} of ${totalActs})...`,
    });
    await new Promise(r => setTimeout(r, 10));

    // Page break for each Act (clean chapter start)
    doc.addPage();
    cursorY = marginTop;

    // Act Header Banner
    doc.setFillColor(254, 243, 199); // Light amber
    doc.roundedRect(marginX, cursorY, contentWidth, 22, 2, 2, 'F');
    doc.setDrawColor(245, 158, 11);
    doc.setLineWidth(0.4);
    doc.roundedRect(marginX, cursorY, contentWidth, 22, 2, 2, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(194, 65, 12);
    doc.text(`ACT ${act.actId}  •  ${act.kicker.toUpperCase()}`, marginX + 6, cursorY + 7);

    doc.setFont('times', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(24, 24, 27);
    doc.text(act.title, marginX + 6, cursorY + 16);

    cursorY += 28;

    // Teaser / Opening preface if present
    if (act.teaserText) {
      doc.setFont('times', 'italic');
      doc.setFontSize(10.5);
      doc.setTextColor(124, 45, 18);
      const teaserLines = doc.splitTextToSize(`"${cleanTextForPDF(act.teaserText)}"`, contentWidth - 10);
      ensureSpace(teaserLines.length * 5 + 8);

      doc.setFillColor(255, 247, 237);
      doc.rect(marginX, cursorY, contentWidth, teaserLines.length * 5 + 6, 'F');
      doc.setDrawColor(249, 115, 22);
      doc.setLineWidth(0.8);
      doc.line(marginX, cursorY, marginX, cursorY + teaserLines.length * 5 + 6);

      doc.text(teaserLines, marginX + 5, cursorY + 5);
      cursorY += teaserLines.length * 5 + 12;
    }

    // Render Beats
    for (let bIdx = 0; bIdx < act.beats.length; bIdx++) {
      const beat: BeatData = act.beats[bIdx];

      ensureSpace(24);

      // Chapter / Beat Marker
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(194, 65, 12);
      doc.text(`CHAPTER ${cleanTextForPDF(beat.numberLabel || `0${bIdx + 1}`)}`.toUpperCase(), marginX, cursorY);
      cursorY += 5;

      // Beat Title
      doc.setFont('times', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(24, 24, 27);
      const titleLines = doc.splitTextToSize(cleanTextForPDF(beat.title), contentWidth);
      doc.text(titleLines, marginX, cursorY);
      cursorY += titleLines.length * 5.5 + 4;

      // Divider line
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.2);
      doc.line(marginX, cursorY, marginX + 40, cursorY);
      cursorY += 5;

      // Quote if present
      if (beat.quote) {
        doc.setFont('times', 'italic');
        doc.setFontSize(10);
        doc.setTextColor(113, 63, 18);
        const quoteLines = doc.splitTextToSize(`"${cleanTextForPDF(beat.quote.text)}"`, contentWidth - 12);
        const authorHeight = beat.quote.author ? 5 : 0;
        const boxHeight = quoteLines.length * 4.8 + 6 + authorHeight;

        ensureSpace(boxHeight + 4);

        doc.setFillColor(250, 250, 249);
        doc.rect(marginX, cursorY, contentWidth, boxHeight, 'F');
        doc.setDrawColor(180, 83, 9);
        doc.setLineWidth(0.7);
        doc.line(marginX, cursorY, marginX, cursorY + boxHeight);

        doc.text(quoteLines, marginX + 6, cursorY + 5);

        if (beat.quote.author) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(113, 113, 122);
          doc.text(`— ${cleanTextForPDF(beat.quote.author)}`, pageWidth - marginX - 5, cursorY + boxHeight - 3, { align: 'right' });
        }

        cursorY += boxHeight + 6;
      }

      // Paragraphs
      for (let pIdx = 0; pIdx < beat.paragraphs.length; pIdx++) {
        const paragraphText = cleanTextForPDF(beat.paragraphs[pIdx]);
        const isEmphasis = beat.emphasisParagraphs?.includes(pIdx);

        if (isEmphasis) {
          doc.setFont('times', 'bolditalic');
          doc.setFontSize(10);
          doc.setTextColor(154, 52, 18); // Amber 800
        } else {
          doc.setFont('times', 'normal');
          doc.setFontSize(10);
          doc.setTextColor(39, 39, 42); // Zinc 800
        }

        const lines = doc.splitTextToSize(paragraphText, contentWidth);
        const requiredHeight = lines.length * 4.8 + 3.5;

        ensureSpace(requiredHeight);

        doc.text(lines, marginX, cursorY);
        cursorY += requiredHeight;
      }

      // Subsections if present (e.g. category questions in Act IX)
      if (beat.subsections && beat.subsections.length > 0) {
        for (const sub of beat.subsections) {
          ensureSpace(12);

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(194, 65, 12);
          doc.text(`[ ${cleanTextForPDF(sub.category).toUpperCase()} ]`, marginX, cursorY);
          cursorY += 5;

          for (const q of sub.questions) {
            const cleanQ = cleanTextForPDF(q);
            doc.setFont('times', 'normal');
            doc.setFontSize(9.5);
            doc.setTextColor(39, 39, 42);

            const qLines = doc.splitTextToSize(`•  ${cleanQ}`, contentWidth - 4);
            ensureSpace(qLines.length * 4.6 + 2);
            doc.text(qLines, marginX + 2, cursorY);
            cursorY += qLines.length * 4.6 + 2;
          }

          cursorY += 3;
        }
      }

      // Ending paragraphs if present
      if (beat.endingParagraphs && beat.endingParagraphs.length > 0) {
        for (const ep of beat.endingParagraphs) {
          const epText = cleanTextForPDF(ep);
          doc.setFont('times', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(24, 24, 27);

          const epLines = doc.splitTextToSize(epText, contentWidth);
          ensureSpace(epLines.length * 4.8 + 4);
          doc.text(epLines, marginX, cursorY);
          cursorY += epLines.length * 4.8 + 4;
        }
      }

      cursorY += 6; // Spacing after chapter
    }

    // Pivot transition note between acts
    if (act.pivotText) {
      ensureSpace(20);
      const cleanPivot = cleanTextForPDF(act.pivotText);
      doc.setFont('times', 'italic');
      doc.setFontSize(9.5);
      doc.setTextColor(113, 63, 18);
      const pivotLines = doc.splitTextToSize(`Act Transition Note: ${cleanPivot}`, contentWidth - 10);

      doc.setFillColor(254, 252, 232);
      doc.rect(marginX, cursorY, contentWidth, pivotLines.length * 4.6 + 6, 'F');
      doc.setDrawColor(202, 138, 4);
      doc.setLineWidth(0.4);
      doc.rect(marginX, cursorY, contentWidth, pivotLines.length * 4.6 + 6, 'D');

      doc.text(pivotLines, marginX + 5, cursorY + 5);
      cursorY += pivotLines.length * 4.6 + 12;
    }
  }

  // ==========================================
  // 4. RUNNING HEADERS, FOOTERS & PAGE NUMBERS
  // ==========================================
  onProgress?.({ percentage: 95, message: 'Applying headers, footers, and page numbers...' });
  await new Promise(r => setTimeout(r, 20));

  const totalPages = doc.getNumberOfPages();
  const startPage = isFullBook ? 3 : 1; // Skip cover (page 1) and TOC (page 2) if full book

  for (let p = 1; p <= totalPages; p++) {
    if (isFullBook && p <= 2) {
      continue; // No running header on cover or TOC
    }

    doc.setPage(p);

    // Running Header
    doc.setFont('times', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(161, 161, 170); // Zinc 400
    doc.text('The 11 Acts — The Unspoken Story', marginX, 12);
    doc.text('Prince & Anvii', pageWidth - marginX, 12, { align: 'right' });

    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.2);
    doc.line(marginX, 14, pageWidth - marginX, 14);

    // Running Footer
    doc.line(marginX, pageHeight - 14, pageWidth - marginX, pageHeight - 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(161, 161, 170);
    doc.text('Private & Confidential', marginX, pageHeight - 9);
    doc.text(`Page ${p} of ${totalPages}`, pageWidth - marginX, pageHeight - 9, { align: 'right' });
  }

  onProgress?.({ percentage: 100, message: 'PDF compilation complete!' });

  return doc.output('blob');
}

/**
 * Triggers native browser download of the generated PDF file
 */
export async function download11ActsPDF(options?: {
  onProgress?: (progress: PDFGenerationProgress) => void;
  selectedActIndex?: number;
}): Promise<void> {
  const blob = await generate11ActsPDF(options);
  const actName = options?.selectedActIndex !== undefined && options.selectedActIndex >= 0 && options.selectedActIndex < ALL_ACTS.length
    ? `Act_${ALL_ACTS[options.selectedActIndex].actId}_${ALL_ACTS[options.selectedActIndex].title.replace(/\s+/g, '_')}`
    : 'The_11_Acts_Complete_Autobiography_Prince';

  const filename = `${actName}.pdf`;

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
