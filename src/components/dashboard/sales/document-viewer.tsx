"use client";

import { useEffect } from "react";
import { X, MessageSquareText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface DocSection {
  heading: string;
  text: string;
}

export interface ViewDoc {
  kind: "drawing" | "report" | "work-order" | "contract";
  docType: string; // e.g. "Single-line diagram", "Field report"
  title: string;
  ref: string;
  fields: { label: string; value: string }[];
  sections: DocSection[];
  preview: "drawing" | "text";
}

/* A stylised single-line diagram so drawings render as an engineering sheet. */
function DrawingCanvas({ doc }: { doc: ViewDoc }) {
  return (
    <div className="border border-gray-300 bg-white">
      {/* Drawing area */}
      <div className="relative aspect-[4/3] bg-[repeating-linear-gradient(0deg,#fafafa,#fafafa_23px,#f0f0f0_24px),repeating-linear-gradient(90deg,#fafafa,#fafafa_23px,#f0f0f0_24px)]">
        <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full" stroke="#171717" fill="none" strokeWidth={1.5}>
          {/* Incoming bus */}
          <line x1="200" y1="20" x2="200" y2="55" />
          <line x1="140" y1="55" x2="260" y2="55" strokeWidth={3} />
          {/* Disconnect */}
          <line x1="200" y1="55" x2="200" y2="80" />
          <line x1="200" y1="80" x2="215" y2="98" />
          <circle cx="200" cy="80" r="2.5" fill="#171717" />
          {/* Breaker */}
          <rect x="192" y="102" width="16" height="16" />
          <line x1="200" y1="118" x2="200" y2="140" />
          {/* Transformer (two coupled windings) */}
          <circle cx="200" cy="158" r="18" />
          <circle cx="200" cy="182" r="18" />
          <line x1="200" y1="200" x2="200" y2="225" />
          {/* Outgoing bus */}
          <line x1="140" y1="225" x2="260" y2="225" strokeWidth={3} />
          <line x1="160" y1="225" x2="160" y2="250" />
          <line x1="240" y1="225" x2="240" y2="250" />
          {/* Feeder breakers */}
          <rect x="152" y="250" width="16" height="16" />
          <rect x="232" y="250" width="16" height="16" />
          {/* Labels */}
          <text x="266" y="58" fontSize="9" fill="#737373" stroke="none">HV BUS</text>
          <text x="222" y="172" fontSize="9" fill="#737373" stroke="none">TX</text>
          <text x="266" y="228" fontSize="9" fill="#737373" stroke="none">LV BUS</text>
        </svg>
      </div>
      {/* Title block */}
      <div className="grid grid-cols-4 border-t border-gray-300 text-[10px]">
        {[
          { l: "Drawing no.", v: doc.ref },
          { l: "Title", v: doc.title },
          ...doc.fields.slice(0, 2).map((f) => ({ l: f.label, v: f.value })),
        ].map((c, i) => (
          <div key={i} className={`px-3 py-2 ${i < 3 ? "border-r border-gray-300" : ""}`}>
            <p className="text-gray-400 tracking-wider">{c.l}</p>
            <p className="text-gray-800 mt-0.5 truncate">{c.v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

interface Props {
  doc: ViewDoc | null;
  onClose: () => void;
  onAsk: (doc: ViewDoc) => void;
}

export default function DocumentViewer({ doc, onClose, onAsk }: Props) {
  const open = !!doc;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!doc) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 font-patrick-hand">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-black/40 animate-in fade-in" />

      {/* Document sheet */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-[760px] max-h-[90vh] flex flex-col overflow-hidden animate-message-in">
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="min-w-0">
            <p className="text-[11px] text-gray-400 tracking-wider">{doc.docType}</p>
            <h2 className="text-xl text-gray-900 truncate">{doc.title}</h2>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => window.print()}
              aria-label="Download"
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <Download size={16} />
            </button>
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body — the document itself */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-6 bg-gray-50">
          <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col gap-6">
            {/* Document header band */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div>
                <p className="text-sm text-gray-900">HITACHI ENERGY</p>
                <p className="text-xs text-gray-400 mt-0.5">{doc.docType}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 tracking-wider">Reference</p>
                <p className="text-sm text-gray-800 mt-0.5">{doc.ref}</p>
              </div>
            </div>

            {/* Drawing preview */}
            {doc.preview === "drawing" && <DrawingCanvas doc={doc} />}

            {/* Title-block / metadata fields */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {doc.fields.map((f) => (
                <div key={f.label}>
                  <p className="text-[11px] text-gray-400 tracking-wider">{f.label}</p>
                  <p className="text-sm text-gray-800 mt-0.5">{f.value}</p>
                </div>
              ))}
            </div>

            {/* Narrative sections */}
            {doc.sections.map((s) => (
              <div key={s.heading}>
                <p className="text-[11px] text-gray-400 tracking-wider mb-1.5">{s.heading}</p>
                <p className="text-sm text-gray-700 leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 flex gap-3 px-6 py-4 border-t border-gray-100">
          <Button
            onClick={() => onAsk(doc)}
            className="flex-1 rounded-full h-auto py-2.5 text-sm cursor-pointer gap-2"
          >
            <MessageSquareText size={15} strokeWidth={1.5} />
            Ask about this document
          </Button>
        </div>
      </div>
    </div>
  );
}
