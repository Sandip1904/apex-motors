import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bookmark,
  Copy,
  Trash2,
  Edit3,
  Check,
  X,
  Upload,
  Download,
  Share2,
  FileDown,
  GitCompare,
  SlidersHorizontal,
  ArrowUpRight,
} from 'lucide-react';
import { useBuildStore } from '../store/useBuildStore';
import { useCarStore } from '../store/useCarStore';
import { useUIStore } from '../store/useUIStore';
import { PAINT_COLORS, PAINT_FINISHES, WHEEL_OPTIONS } from '../data/vehicleCatalog';
import { findOption, formatINR } from '../utils/pricing';
import { exportConfigAsJsonFile } from '../utils/configSchema';
import { buildShareableUrl, copyTextToClipboard } from '../utils/shareUrl';
import { exportConfigurationPdf } from '../utils/pdfExport';

export default function MyBuildsPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const builds = useBuildStore((s) => s.builds);
  const renameBuild = useBuildStore((s) => s.renameBuild);
  const duplicateBuild = useBuildStore((s) => s.duplicateBuild);
  const deleteBuild = useBuildStore((s) => s.deleteBuild);
  const importBuildFromJson = useBuildStore((s) => s.importBuildFromJson);
  const compareIds = useBuildStore((s) => s.compareIds);
  const toggleCompareId = useBuildStore((s) => s.toggleCompareId);

  const applyConfiguration = useCarStore((s) => s.applyConfiguration);
  const addToast = useUIStore((s) => s.addToast);
  const openConfirmDialog = useUIStore((s) => s.openConfirmDialog);
  const setSaveModalOpen = useUIStore((s) => s.setSaveModalOpen);

  const [editingId, setEditingId] = useState(null);
  const [draftName, setDraftName] = useState('');

  const handleRestore = (build) => {
    applyConfiguration(build, build.name);
    addToast(`Restored "${build.name}" into the configurator.`, 'success');
    navigate('/configure');
  };

  const handleStartRename = (build) => {
    setEditingId(build.id);
    setDraftName(build.name);
  };

  const handleCommitRename = (id) => {
    if (renameBuild(id, draftName)) {
      addToast('Build renamed.', 'success');
    }
    setEditingId(null);
  };

  const handleDelete = (build) => {
    openConfirmDialog({
      title: 'Delete Saved Build',
      message: `Permanently delete "${build.name}" from your local garage? This action cannot be undone.`,
      confirmLabel: 'Delete',
      danger: true,
      onConfirm: () => {
        deleteBuild(build.id);
        addToast(`Deleted "${build.name}".`, 'info');
      },
    });
  };

  const handleShare = async (build) => {
    try {
      const url = buildShareableUrl(build, '/configure');
      const copied = await copyTextToClipboard(url);
      addToast(
        copied ? 'Shareable build link copied to clipboard.' : 'Link generated. Copy from browser bar.',
        'success'
      );
    } catch {
      addToast('Unable to generate share link.', 'error');
    }
  };

  const handleExportPdf = (build) => {
    const res = exportConfigurationPdf({ config: build, buildName: build.name });
    if (res.ok) addToast(`Exported PDF for "${build.name}".`, 'success');
    else addToast(res.error || 'PDF export failed.', 'error');
  };

  const handleFileImport = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = importBuildFromJson(String(reader.result || ''));
      if (result.ok) {
        addToast(`Imported "${result.build.name}" into My Builds.`, 'success');
      } else {
        addToast(result.error || 'Import failed.', 'error');
      }
      event.target.value = '';
    };
    reader.onerror = () => {
      addToast('Failed to read selected JSON file.', 'error');
      event.target.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div className="mx-auto max-w-[1440px] space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="apex-label text-apex-crimson">Local Garage (localStorage)</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-white">My Saved Builds</h1>
          <p className="mt-1 text-sm text-apex-silver">
            Manage, restore, rename, duplicate, compare, or import/export your APEX R-01 commissions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileImport}
            className="hidden"
            aria-label="Import configuration JSON file"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="apex-btn-ghost text-xs"
          >
            <Upload className="h-3.5 w-3.5" />
            Import JSON
          </button>

          <button
            type="button"
            onClick={() => setSaveModalOpen(true)}
            className="apex-btn-accent text-xs"
          >
            <Bookmark className="h-3.5 w-3.5" />
            Save Current Build
          </button>

          {builds.length >= 2 && (
            <Link to="/compare" className="apex-btn-primary text-xs">
              <GitCompare className="h-3.5 w-3.5" />
              Compare ({compareIds.length})
            </Link>
          )}
        </div>
      </div>

      {builds.length === 0 ? (
        <div className="apex-panel flex flex-col items-center justify-center rounded-3xl px-6 py-20 text-center">
          <Bookmark className="mb-4 h-12 w-12 text-apex-steel" />
          <h2 className="font-display text-xl font-semibold text-white">Your Garage Is Empty</h2>
          <p className="mt-2 max-w-md text-sm text-apex-silver">
            Configure your APEX R-01 and save builds to compare specifications, export PDFs, or share links.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/configure" className="apex-btn-accent">
              <SlidersHorizontal className="h-4 w-4" />
              Configure APEX R-01
            </Link>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="apex-btn-ghost"
            >
              <Upload className="h-4 w-4" />
              Import JSON Build
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {builds.map((build) => {
            const paintOpt = findOption(PAINT_COLORS, build.paint);
            const finishOpt = findOption(PAINT_FINISHES, build.paintFinish);
            const wheelOpt = findOption(WHEEL_OPTIONS, build.wheels);
            const swatch = build.paint === 'custom' ? build.customPaintHex : paintOpt.hex;
            const inCompare = compareIds.includes(build.id);

            return (
              <article key={build.id} className="apex-card flex flex-col justify-between p-5">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className="h-10 w-10 shrink-0 rounded-xl border border-white/20 shadow-inner"
                        style={{ backgroundColor: swatch }}
                      />
                      <div className="min-w-0">
                        {editingId === build.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="text"
                              value={draftName}
                              maxLength={64}
                              onChange={(e) => setDraftName(e.target.value)}
                              className="w-40 rounded border border-apex-crimson bg-apex-obsidian px-2 py-1 text-sm text-white focus:outline-none"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleCommitRename(build.id)}
                              className="rounded bg-apex-crimson p-1 text-white"
                              aria-label="Confirm rename"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="rounded bg-white/10 p-1 text-apex-silver"
                              aria-label="Cancel rename"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <h2 className="truncate font-display text-lg font-bold text-white">
                            {build.name}
                          </h2>
                        )}
                        <p className="font-mono text-xs text-apex-titanium">
                          Updated {new Date(build.updatedAt).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleCompareId(build.id)}
                      className={`shrink-0 rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                        inCompare
                          ? 'border-apex-crimson bg-apex-crimson/15 text-apex-crimson'
                          : 'border-white/10 bg-white/5 text-apex-silver hover:border-white/25'
                      }`}
                    >
                      {inCompare ? 'Comparing' : 'Compare'}
                    </button>
                  </div>

                  <div className="mt-4 space-y-1.5 border-y border-white/10 py-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-apex-titanium">Paint &amp; Finish</span>
                      <span className="font-medium text-apex-platinum">
                        {paintOpt.name} · {finishOpt.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-apex-titanium">Wheels</span>
                      <span className="font-medium text-apex-platinum">{wheelOpt.name}</span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-apex-titanium">Demo Estimate</span>
                      <span className="font-mono font-bold text-white">
                        {formatINR(build.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <button
                    type="button"
                    onClick={() => handleRestore(build)}
                    className="apex-btn-primary w-full py-2 text-xs"
                  >
                    Restore in 3D Configurator
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>

                  <div className="grid grid-cols-5 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleStartRename(build)}
                      className="apex-btn-ghost px-0 py-2"
                      title="Rename build"
                      aria-label="Rename build"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        duplicateBuild(build.id);
                        addToast(`Duplicated "${build.name}".`, 'success');
                      }}
                      className="apex-btn-ghost px-0 py-2"
                      title="Duplicate build"
                      aria-label="Duplicate build"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleShare(build)}
                      className="apex-btn-ghost px-0 py-2"
                      title="Copy shareable link"
                      aria-label="Copy shareable link"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => exportConfigAsJsonFile(build.name, build)}
                      className="apex-btn-ghost px-0 py-2"
                      title="Export JSON"
                      aria-label="Export JSON"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(build)}
                      className="apex-btn-ghost px-0 py-2 text-red-400 hover:border-red-500/40 hover:bg-red-500/10"
                      title="Delete build"
                      aria-label="Delete build"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleExportPdf(build)}
                    className="apex-btn-ghost w-full py-1.5 text-[11px]"
                  >
                    <FileDown className="h-3.5 w-3.5" />
                    Export PDF Summary
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
