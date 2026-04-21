"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Load the pdf.js worker from the CDN matched to the installed pdfjs-dist version.
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type PdfViewerProps = {
  fileUrl: string;
  authToken: string | null;
  watermark?: string | null;
  onLoad?: (numPages: number) => void;
};

export default function PdfViewer({ fileUrl, authToken, watermark, onLoad }: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const fileProp = useMemo(
    () => ({
      url: fileUrl,
      httpHeaders: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      withCredentials: false,
    }),
    [fileUrl, authToken]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const maxW = Math.min(el.clientWidth - 32, 1100);
      setWidth(maxW > 0 ? maxW : undefined);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        setPageNumber((p) => (numPages ? Math.min(numPages, p + 1) : p));
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        setPageNumber((p) => Math.max(1, p - 1));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [numPages]);

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-[70vh] w-full flex-col items-center"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Print-disable + selection deterrents */}
      <style jsx global>{`
        @media print {
          body {
            display: none !important;
          }
        }
      `}</style>

      {/* Toolbar overlay */}
      <div className="sticky top-4 z-20 mb-4 flex items-center gap-2 rounded-full border border-white/15 bg-black/80 px-3 py-2 font-sans text-xs text-white/80 backdrop-blur">
        <button
          type="button"
          className="rounded px-2 py-1 hover:text-ravok-gold disabled:opacity-40"
          onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
          disabled={pageNumber <= 1}
          aria-label="Previous page"
        >
          ◂
        </button>
        <span className="border-x border-white/15 px-3 tabular-nums text-ravok-beige">
          {numPages ? `${pageNumber} / ${numPages}` : "…"}
        </span>
        <button
          type="button"
          className="rounded px-2 py-1 hover:text-ravok-gold disabled:opacity-40"
          onClick={() => setPageNumber((p) => (numPages ? Math.min(numPages, p + 1) : p))}
          disabled={!numPages || pageNumber >= numPages}
          aria-label="Next page"
        >
          ▸
        </button>
        <button
          type="button"
          className="rounded px-2 py-1 hover:text-ravok-gold"
          onClick={() => setScale((s) => Math.max(0.5, +(s - 0.1).toFixed(2)))}
          aria-label="Zoom out"
        >
          −
        </button>
        <span className="tabular-nums text-ravok-slate">{Math.round(scale * 100)}%</span>
        <button
          type="button"
          className="rounded px-2 py-1 hover:text-ravok-gold"
          onClick={() => setScale((s) => Math.min(2.5, +(s + 0.1).toFixed(2)))}
          aria-label="Zoom in"
        >
          +
        </button>
      </div>

      {error ? (
        <div className="mt-12 rounded border border-red-500/30 bg-red-500/10 p-4 font-sans text-sm text-red-300">
          {error}
        </div>
      ) : (
        <Document
          file={fileProp}
          onLoadSuccess={({ numPages: n }) => {
            setNumPages(n);
            onLoad?.(n);
          }}
          onLoadError={(err) => setError(err?.message ?? "Failed to load document.")}
          loading={
            <div className="mt-16 font-sans text-sm text-ravok-slate">Loading document…</div>
          }
          className="flex justify-center select-none"
        >
          <Page
            pageNumber={pageNumber}
            width={width}
            scale={scale}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            className="shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
          />
        </Document>
      )}

      {watermark && (
        <div
          className="pointer-events-none fixed bottom-4 right-6 z-30 font-sans text-[9px] uppercase tracking-[0.3em] text-white/40"
          aria-hidden
        >
          {watermark}
        </div>
      )}
    </div>
  );
}
