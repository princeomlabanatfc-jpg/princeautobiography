import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileDown, 
  Copy, 
  Printer, 
  Check, 
  BookOpen, 
  Sparkles, 
  X, 
  Layers, 
  ChevronRight, 
  FileText,
  Clock,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { ALL_ACTS } from '../data/allActs';
import { 
  download11ActsPDF, 
  copy11ActsToClipboard, 
  openPrintable11ActsWindow, 
  PDFGenerationProgress 
} from '../utils/pdfGenerator';

interface DownloadPDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentActIndex?: number;
}

export const DownloadPDFModal: React.FC<DownloadPDFModalProps> = ({
  isOpen,
  onClose,
  currentActIndex = 0
}) => {
  const [selectedScope, setSelectedScope] = useState<'ALL' | number>('ALL');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<PDFGenerationProgress>({ percentage: 0, message: '' });
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const totalChapters = ALL_ACTS.reduce((acc, act) => acc + act.beats.length, 0);

  const handleDownloadPDF = async () => {
    try {
      setIsGenerating(true);
      setDownloadSuccess(false);
      setProgress({ percentage: 0, message: 'Starting PDF preparation...' });

      const actIdx = selectedScope === 'ALL' ? undefined : selectedScope;

      await download11ActsPDF({
        selectedActIndex: actIdx,
        onProgress: (p) => setProgress(p),
      });

      setDownloadSuccess(true);
      setTimeout(() => {
        setIsGenerating(false);
      }, 1000);
    } catch (err) {
      console.error('Error generating PDF:', err);
      setIsGenerating(false);
      alert('An error occurred while generating the PDF. Please try again.');
    }
  };

  const handleCopyText = async () => {
    const actIdx = selectedScope === 'ALL' ? undefined : selectedScope;
    const success = await copy11ActsToClipboard(actIdx);
    if (success) {
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 3000);
    }
  };

  const handlePrintPreview = () => {
    const actIdx = selectedScope === 'ALL' ? undefined : selectedScope;
    openPrintable11ActsWindow(actIdx);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => !isGenerating && onClose()}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-[#121217] border border-white/15 rounded-3xl shadow-2xl overflow-hidden z-10 text-[#eae5dc]"
          style={{ backgroundColor: 'rgba(18, 18, 23, 0.98)' }}
        >
          {/* Header Banner */}
          <div className="p-6 sm:p-7 border-b border-white/10 relative bg-gradient-to-r from-orange-950/40 via-amber-950/20 to-black/40">
            <button
              onClick={onClose}
              disabled={isGenerating}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all cursor-pointer disabled:opacity-30"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-orange-300 font-semibold mb-2">
              <BookOpen className="w-4 h-4 text-orange-400" />
              <span>Full Archive Export</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl text-white/95 font-medium leading-tight">
              Download The 11 Acts
            </h2>

            <p className="font-sans text-xs sm:text-sm text-white/70 mt-1 max-w-lg leading-relaxed">
              Export the complete, unabridged autobiography with every chapter, reflection, and nuance formatted into a publication-grade PDF or plain structured text.
            </p>

            {/* Quick Metrics Pills */}
            <div className="flex flex-wrap items-center gap-2.5 mt-4 text-[11px] font-sans text-white/80">
              <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
                <Layers className="w-3 h-3 text-orange-300" />
                11 Acts
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
                <FileText className="w-3 h-3 text-amber-300" />
                {totalChapters} Chapters
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-rose-300" />
                37,000+ Words
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                100% Unabridged
              </span>
            </div>
          </div>

          {/* Scrollable Body Content */}
          <div className="p-6 sm:p-7 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
            
            {/* Scope Selection Box */}
            <div className="space-y-3">
              <label className="text-xs font-sans uppercase tracking-wider text-white/60 font-semibold block">
                Select Export Scope:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Complete Book Option */}
                <button
                  type="button"
                  onClick={() => setSelectedScope('ALL')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedScope === 'ALL'
                      ? 'bg-orange-500/15 border-orange-400 text-white shadow-lg ring-1 ring-orange-400/40'
                      : 'bg-white/[0.03] border-white/10 hover:border-white/20 text-white/70'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-serif text-base font-medium text-white">
                      Complete 11 Acts (Full Book)
                    </span>
                    {selectedScope === 'ALL' && (
                      <span className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-white text-[10px]">
                        ✓
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-sans text-white/60 mt-1">
                    All 11 Acts • 55 Chapters • Cover page & TOC
                  </span>
                </button>

                {/* Single Act Option */}
                <div className="relative">
                  <select
                    value={selectedScope === 'ALL' ? '' : selectedScope}
                    onChange={(e) => {
                      if (e.target.value === '') {
                        setSelectedScope('ALL');
                      } else {
                        setSelectedScope(Number(e.target.value));
                      }
                    }}
                    className={`w-full h-full min-h-[72px] p-3.5 rounded-2xl border bg-[#18181f] text-xs font-sans appearance-none cursor-pointer transition-all focus:outline-none ${
                      selectedScope !== 'ALL'
                        ? 'border-orange-400 text-white ring-1 ring-orange-400/40 bg-orange-500/10'
                        : 'border-white/10 hover:border-white/20 text-white/70'
                    }`}
                  >
                    <option value="" className="bg-[#18181f] text-white">
                      Or select a single Act...
                    </option>
                    {ALL_ACTS.map((act, idx) => (
                      <option key={act.actId} value={idx} className="bg-[#18181f] text-white">
                        Act {act.actId}: {act.title} ({act.beats.length} chapters)
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
                    <ChevronRight className="w-4 h-4 rotate-90" />
                  </div>
                </div>
              </div>
            </div>

            {/* Act Content Breakdown preview */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-sans text-white/60 font-medium">
                <span>Included Content Structure</span>
                <span className="text-orange-300">Exact 1:1 Match</span>
              </div>

              <div className="space-y-1.5 text-xs font-sans text-white/75">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  <span>Exact verbatim text for every chapter and reflection</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  <span>Formatted quotes, emphasis paragraphs & category subsections</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  <span>Act transition prefaces, notes, and the future letter</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  <span>Book pagination with running headers & footers</span>
                </div>
              </div>
            </div>

            {/* Progress Bar (during generation) */}
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-orange-950/40 border border-orange-500/40 space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs font-sans">
                  <span className="text-orange-200 font-medium">{progress.message}</span>
                  <span className="text-orange-300 font-bold">{progress.percentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-orange-400"
                    animate={{ width: `${progress.percentage}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </motion.div>
            )}

            {/* Success Message */}
            {downloadSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-200 text-xs font-sans flex items-center gap-2.5"
              >
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>PDF downloaded successfully! Check your browser downloads.</span>
              </motion.div>
            )}
          </div>

          {/* Modal Actions Footer */}
          <div className="p-6 border-t border-white/10 bg-black/40 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Secondary Actions (Copy & Print) */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleCopyText}
                disabled={isGenerating}
                className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-sans font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
                title="Copy structured text to clipboard"
              >
                {copiedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-white/60" />
                    <span>Copy Full Text</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handlePrintPreview}
                disabled={isGenerating}
                className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs font-sans font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
                title="Open print view"
              >
                <Printer className="w-3.5 h-3.5 text-white/60" />
                <span>Print View</span>
              </button>
            </div>

            {/* Primary Download Button */}
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="btn-primary-gradient w-full sm:w-auto px-7 py-3 rounded-xl text-white text-xs font-sans uppercase tracking-wider font-bold shadow-xl hover:shadow-orange-500/30 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              style={{
                backgroundColor: '#ea580c',
                backgroundImage: 'linear-gradient(135deg, #f97316 0%, #f59e0b 50%, #ea580c 100%)',
              }}
            >
              <FileDown className="w-4 h-4 text-white" />
              <span>
                {isGenerating 
                  ? 'Generating PDF...' 
                  : selectedScope === 'ALL' 
                  ? 'Download Complete 11 Acts PDF' 
                  : `Download Act ${ALL_ACTS[selectedScope as number].actId} PDF`}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
