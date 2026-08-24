"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { REPEATED_REPAIRS, type RepairAsset } from "@/lib/sales-data";
import WidgetChat from "@/components/dashboard/widget-chat";

function RepairCard({ asset }: { asset: RepairAsset }) {
  return (
    <div className="snap-start shrink-0 basis-[88%] border border-gray-100 rounded-xl p-4">
      {/* Asset image */}
      <div className="h-28 rounded-lg bg-gray-100 flex items-center justify-center mb-3 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/transformer.png" alt={asset.code} className="h-full object-contain grayscale" />
      </div>
      <p className="text-sm text-gray-900">{asset.code}</p>
      <p className="text-xs text-gray-400 mb-3">{asset.location}</p>

      <p className="text-xs text-gray-400 mb-2">Recent repairs</p>
      <div className="flex flex-col gap-1.5">
        {asset.repairs.map((rp) => (
          <div key={rp.label} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{rp.label}</span>
            <span className="text-xs text-gray-400">{rp.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RepeatedRepairs() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.88, behavior: "smooth" });
  };

  return (
    <div className="bg-white rounded-xl p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-base text-gray-900">Repeated Repair Assets</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => scrollBy(-1)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Previous"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            onClick={() => scrollBy(1)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Next"
          >
            <ChevronRight size={15} />
          </button>
          <WidgetChat title="Repeated Repair Assets" triggerClassName="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-gray-500 transition-colors cursor-pointer" />
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory"
      >
        {REPEATED_REPAIRS.map((asset) => (
          <RepairCard key={asset.code} asset={asset} />
        ))}
      </div>
    </div>
  );
}
