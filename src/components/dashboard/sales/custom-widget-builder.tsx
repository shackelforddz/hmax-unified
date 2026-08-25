"use client";

import { useState, useEffect } from "react";
import { X, LineChart, BarChart3, PieChart, Hash, Sparkles } from "lucide-react";
import CustomWidgetView from "./custom-widget-view";
import { buildWidget, type WidgetType, type CustomWidgetConfig } from "@/lib/custom-widget";

const VISUALS: { type: WidgetType; label: string; icon: typeof LineChart }[] = [
  { type: "line", label: "Line", icon: LineChart },
  { type: "bar", label: "Bar", icon: BarChart3 },
  { type: "donut", label: "Donut", icon: PieChart },
  { type: "kpi", label: "KPI", icon: Hash },
];

const EXAMPLES = ["Portfolio margin trend", "Revenue at risk by trigger", "Fleet health over time", "Asset condition breakdown"];

interface Props {
  onAdd: (config: CustomWidgetConfig) => void;
  onClose: () => void;
}

export default function CustomWidgetBuilder({ onAdd, onClose }: Props) {
  const [type, setType] = useState<WidgetType>("line");
  const [prompt, setPrompt] = useState("");
  const [preview, setPreview] = useState<CustomWidgetConfig | null>(null);

  const generate = () => setPreview(buildWidget(prompt || "Untitled metric", type));

  // Keep the preview in sync with the chosen visual once one exists (editing).
  useEffect(() => {
    if (preview) setPreview(buildWidget(prompt || "Untitled metric", type));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const add = () => onAdd(preview ?? buildWidget(prompt || "Untitled metric", type));

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 font-patrick-hand">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Dialog */}
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-message-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg text-gray-900">Create a custom widget</h2>
            <p className="text-sm text-gray-400">Pick a visual, describe the data, and preview it.</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="grid grid-cols-2 gap-6 p-6">
          {/* Controls */}
          <div className="flex flex-col gap-5">
            <div>
              <label className="text-xs text-gray-500 mb-2 block">Visual</label>
              <div className="grid grid-cols-4 gap-2">
                {VISUALS.map(({ type: t, label, icon: Icon }) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs transition-colors cursor-pointer ${
                      type === t ? "border-black bg-gray-50 text-gray-900" : "border-gray-200 text-gray-500 hover:border-gray-400"
                    }`}
                  >
                    <Icon size={18} strokeWidth={1.5} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-2 block">What do you want to see?</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Portfolio margin trend over the last 6 months"
                className="w-full h-24 px-3 py-2.5 text-sm text-gray-700 placeholder-gray-300 border border-gray-200 rounded-lg outline-none focus:border-gray-400 resize-none"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setPrompt(ex)}
                    className="text-xs text-gray-500 border border-gray-200 rounded-full px-2.5 py-1 hover:border-gray-400 transition-colors cursor-pointer"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generate}
              className="self-start flex items-center gap-2 bg-black text-white text-sm px-5 py-2.5 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <Sparkles size={14} strokeWidth={1.5} />
              {preview ? "Regenerate preview" : "Generate preview"}
            </button>
          </div>

          {/* Preview */}
          <div>
            <label className="text-xs text-gray-500 mb-2 block">Preview</label>
            {preview ? (
              <div className="bg-gray-50 rounded-xl p-3">
                <CustomWidgetView config={preview} static />
              </div>
            ) : (
              <div className="h-[240px] border border-dashed border-gray-200 rounded-xl flex items-center justify-center text-center px-6">
                <p className="text-sm text-gray-400">
                  Choose a visual and describe your data, then generate a preview.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="text-sm text-gray-600 border border-gray-200 px-5 py-2 rounded-full hover:border-gray-400 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={add}
            disabled={!preview}
            className={`text-sm px-5 py-2 rounded-full transition-colors ${
              preview ? "bg-black text-white hover:bg-zinc-800 cursor-pointer" : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Add to dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
