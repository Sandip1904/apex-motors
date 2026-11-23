import { jsPDF } from 'jspdf';
import { VEHICLE_INFO, DEMO_PERFORMANCE_SPECS } from '../data/vehicleCatalog';
import { calculateConfigurationPricing } from './pricing';

/**
 * Generates and downloads a formatted PDF configuration summary using jsPDF.
 * Accepts an optional dataUrl preview captured from the 3D WebGL canvas.
 */
export function exportConfigurationPdf({ config, buildName = 'APEX R-01 Commission', previewDataUrl = null }) {
  try {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pricing = calculateConfigurationPricing(config);
    const exportDate = new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 16;
    let y = 16;

    // Dark luxury header banner
    doc.setFillColor(10, 12, 16);
    doc.rect(0, 0, pageWidth, 36, 'F');
    doc.setFillColor(217, 38, 56);
    doc.rect(0, 36, pageWidth, 1.4, 'F');

    doc.setTextColor(232, 236, 242);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(VEHICLE_INFO.brand, margin, 17);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(168, 176, 190);
    doc.text(`${VEHICLE_INFO.name} — Bespoke Configuration Summary`, margin, 25);

    doc.setTextColor(232, 236, 242);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(buildName, pageWidth - margin, 17, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(168, 176, 190);
    doc.text(`Exported: ${exportDate}`, pageWidth - margin, 25, { align: 'right' });

    y = 45;

    // Optional 3D canvas preview image
    if (previewDataUrl && typeof previewDataUrl === 'string' && previewDataUrl.startsWith('data:image/')) {
      try {
        const imgW = pageWidth - margin * 2;
        const imgH = 58;
        doc.setFillColor(15, 18, 24);
        doc.roundedRect(margin, y, imgW, imgH, 2, 2, 'F');
        doc.addImage(previewDataUrl, 'PNG', margin + 1, y + 1, imgW - 2, imgH - 2, undefined, 'FAST');
        y += imgH + 8;
      } catch {
        // Proceed gracefully without preview if WebGL canvas buffer could not be encoded
      }
    }

    // Price summary strip
    doc.setFillColor(244, 246, 249);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 18, 2, 2, 'F');
    doc.setTextColor(20, 24, 31);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('ESTIMATED TOTAL (ILLUSTRATIVE DEMO PRICING)', margin + 4, y + 6.5);
    doc.setFontSize(14);
    doc.setTextColor(217, 38, 56);
    doc.text(pricing.formattedTotalPrice, margin + 4, y + 14);

    doc.setTextColor(70, 78, 92);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(`Base: ${pricing.formattedBasePrice}`, pageWidth - margin - 4, y + 7, { align: 'right' });
    doc.text(`Options: +${pricing.formattedOptionsTotal}`, pageWidth - margin - 4, y + 13.5, { align: 'right' });

    y += 25;

    const renderSection = (title, items) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 18, 24);
      doc.text(title.toUpperCase(), margin, y);
      doc.setDrawColor(217, 38, 56);
      doc.setLineWidth(0.4);
      doc.line(margin, y + 1.8, margin + 28, y + 1.8);
      y += 6.5;

      doc.setFontSize(8.5);
      items.forEach((item, idx) => {
        if (y > 276) {
          doc.addPage();
          y = 20;
        }
        if (idx % 2 === 0) {
          doc.setFillColor(248, 249, 251);
          doc.rect(margin, y - 3.8, pageWidth - margin * 2, 5.8, 'F');
        }
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(55, 65, 81);
        doc.text(item.label, margin + 2, y);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(17, 24, 39);
        doc.text(item.optionName, margin + 52, y);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(item.price > 0 ? 180 : 107, item.price > 0 ? 28 : 114, item.price > 0 ? 45 : 128);
        doc.text(item.formattedPrice, pageWidth - margin - 2, y, { align: 'right' });
        y += 6;
      });

      y += 4;
    };

    const exteriorItems = pricing.itemized.filter((i) => i.category !== 'Interior');
    const interiorItems = pricing.itemized.filter((i) => i.category === 'Interior');

    renderSection('Exterior, Wheels & Aerodynamics', exteriorItems);
    renderSection('Interior & Cabin Specification', interiorItems);

    // Performance specifications block
    if (y > 235) {
      doc.addPage();
      y = 20;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 18, 24);
    doc.text('PERFORMANCE SPECIFICATIONS (DEMONSTRATION)', margin, y);
    doc.setDrawColor(217, 38, 56);
    doc.line(margin, y + 1.8, margin + 40, y + 1.8);
    y += 7;

    const specs = [
      ['Powertrain', DEMO_PERFORMANCE_SPECS.engineType],
      ['Peak Output', `${DEMO_PERFORMANCE_SPECS.horsepower} ${DEMO_PERFORMANCE_SPECS.horsepowerUnit}`],
      ['Peak Torque', `${DEMO_PERFORMANCE_SPECS.torque} ${DEMO_PERFORMANCE_SPECS.torqueUnit}`],
      ['Top Speed', `${DEMO_PERFORMANCE_SPECS.topSpeed} ${DEMO_PERFORMANCE_SPECS.topSpeedUnit}`],
      ['0–100 km/h', `${DEMO_PERFORMANCE_SPECS.acceleration0to100} seconds`],
      ['Transmission', DEMO_PERFORMANCE_SPECS.transmission],
      ['Drivetrain', DEMO_PERFORMANCE_SPECS.driveType],
      ['Dry Weight / Ratio', `${DEMO_PERFORMANCE_SPECS.dryWeight} kg (${DEMO_PERFORMANCE_SPECS.powerToWeight})`],
    ];

    doc.setFontSize(8.5);
    specs.forEach(([label, val]) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(55, 65, 81);
      doc.text(label, margin + 2, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(17, 24, 39);
      doc.text(val, margin + 45, y);
      y += 5.4;
    });

    // Footer disclaimer
    y += 4;
    doc.setFontSize(7.5);
    doc.setTextColor(115, 122, 134);
    doc.text(
      'All prices are illustrative demonstration values in INR. Performance figures represent conceptual demonstration specifications.',
      margin,
      Math.min(y, 286)
    );

    const slug = buildName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    doc.save(`${slug || 'apex-r01-summary'}.pdf`);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err?.message || 'Unable to generate PDF summary.' };
  }
}
