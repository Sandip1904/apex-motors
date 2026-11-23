import { useMemo } from 'react';
import { Bookmark, FileDown, Share2, Download, RotateCcw } from 'lucide-react';
import { useCarStore } from '../../store/useCarStore';
import { useUIStore } from '../../store/useUIStore';
import { calculateConfigurationPricing } from '../../utils/pricing';
import { exportConfigurationPdf } from '../../utils/pdfExport';
import { exportConfigAsJsonFile } from '../../utils/configSchema';
import { buildShareableUrl, copyTextToClipboard } from '../../utils/shareUrl';

export default function SummaryPanel() {
  const carState = useCarStore();
  const setSaveModalOpen = useUIStore((s) => s.setSaveModalOpen);
  const openConfirmDialog = useUIStore((s) => s.openConfirmDialog);
  const addToast = useUIStore((s) => s.addToast);
  const canvasScreenshotGetter = useUIStore((s) => s.canvasScreenshotGetter);

  const snapshot = useMemo(
    () => ({
      vehicleId: carState.vehicleId,
      paint: carState.paint,
      customPaintHex: carState.customPaintHex,
      paintFinish: carState.paintFinish,
      wheels: carState.wheels,
      wheelFinish: carState.wheelFinish,
      brakeCalipers: carState.brakeCalipers,
      spoiler: carState.spoiler,
      sideMirrors: carState.sideMirrors,
      bodyKit: carState.bodyKit,
      frontSplitter: carState.frontSplitter,
      rearDiffuser: carState.rearDiffuser,
      windowTint: carState.windowTint,
      headlightStyle: carState.headlightStyle,
      interior: carState.interior,
      lighting: carState.lighting,
    }),
    [carState]
  );

  const pricing = useMemo(() => calculateConfigurationPricing(snapshot), [snapshot]);

  const handleExportPdf = () => {
    const previewDataUrl = canvasScreenshotGetter ? canvasScreenshotGetter() : null;
    const res = exportConfigurationPdf({
      config: snapshot,
      buildName: carState.activeBuildName,
      previewDataUrl,
    });
    if (res.ok) {
      addToast('PDF configuration summary exported.', 'success');
    } else {
      addToast(res.error || 'PDF export failed.', 'error');
    }
  };

  const handleShare = async () => {
    try {
      const url = buildShareableUrl(snapshot, '/configure');
      const copied = await copyTextToClipboard(url);
      if (copied) {
        addToast('Shareable configuration link copied to clipboard.', 'success');
      } else {
        addToast('Could not copy automatically. Link generated in browser address bar.', 'info');
        window.history.replaceState({}, '', url);
      }
    } catch {
      addToast('Unable to encode shareable URL.', 'error');
    }
  };

  const handleExportJson = () => {
    exportConfigAsJsonFile(carState.activeBuildName, snapshot);
    addToast('Configuration JSON downloaded.', 'success');
  };

  const handleReset = () => {
    openConfirmDialog({
      title: 'Reset Configuration',
      message: 'Restore all exterior, interior, and lighting selections back to APEX R-01 factory defaults?',
      confirmLabel: 'Reset Build',
      danger: true,
      onConfirm: () => {
        carState.resetConfiguration();
        addToast('Configuration reset to factory defaults.', 'info');
      },
    });
  };

  return (
    <div className="flex h-full flex-col">
      {/* Live Price Header */}
      <div className="border-b border-white/10 p-4">
        <p className="apex-label">Estimated Total (Demo INR)</p>
        <p className="mt-1 font-display text-2xl font-bold tracking-tight text-white">
          {pricing.formattedTotalPrice}
        </p>
        <div className="mt-2 flex items-center justify-between text-xs text-apex-titanium">
          <span>Base APEX R-01</span>
          <span className="font-mono text-apex-silver">{pricing.formattedBasePrice}</span>
        </div>
        <div className="mt-1 flex items-center justify-between text-xs text-apex-titanium">
          <span>Selected Upgrades ({pricing.paidUpgrades.length})</span>
          <span className="font-mono text-apex-crimson">+{pricing.formattedOptionsTotal}</span>
        </div>
      </div>

      {/* Itemized Specification List */}
      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        <p className="apex-label mb-2">Configuration Breakdown</p>
        {pricing.itemized.map((item) => (
          <div
            key={item.key}
            className="flex items-start justify-between gap-2 border-b border-white/5 pb-2 text-xs"
          >
            <div className="min-w-0">
              <p className="text-apex-titanium">{item.label}</p>
              <p className="truncate font-medium text-apex-platinum">{item.optionName}</p>
            </div>
            <span
              className={`shrink-0 font-mono ${
                item.price > 0 ? 'text-white' : 'text-apex-titanium'
              }`}
            >
              {item.formattedPrice}
            </span>
          </div>
        ))}
      </div>

      {/* Action Footer */}
      <div className="space-y-2 border-t border-white/10 p-4">
        <button
          type="button"
          onClick={() => setSaveModalOpen(true)}
          className="apex-btn-accent w-full"
        >
          <Bookmark className="h-4 w-4" />
          Save Build
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={handleExportPdf} className="apex-btn-primary w-full px-3 text-xs">
            <FileDown className="h-3.5 w-3.5" />
            Export PDF
          </button>
          <button type="button" onClick={handleShare} className="apex-btn-ghost w-full px-3 text-xs">
            <Share2 className="h-3.5 w-3.5" />
            Share Link
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={handleExportJson} className="apex-btn-ghost w-full px-3 text-xs">
            <Download className="h-3.5 w-3.5" />
            Export JSON
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="apex-btn-ghost w-full px-3 text-xs text-apex-titanium hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
