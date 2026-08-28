"use client";

import WidgetChat from "@/components/dashboard/widget-chat";
import { ENG_BULLETINS, type BulletinType } from "@/lib/reliability-data";

const TYPE_CLS: Record<BulletinType, string> = {
  "Safety notification": "bg-gray-900 text-white",
  Standard: "bg-gray-200 text-gray-700",
  "Product update": "border border-gray-300 text-gray-500",
};

export default function EngBulletins() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
      <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex items-start justify-between">
        <div>
          <h3 className="text-base text-gray-900">Standards &amp; bulletins</h3>
          <p className="text-sm text-gray-400 mt-0.5">{ENG_BULLETINS.length} recent updates</p>
        </div>
        <WidgetChat title="Standards & bulletins" />
      </div>
      <div className="p-4 flex flex-col gap-3">
        {ENG_BULLETINS.map((b) => (
          <div key={b.id} className="border border-gray-200 rounded-2xl px-4 py-3">
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <span className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap ${TYPE_CLS[b.type]}`}>{b.type}</span>
              <span className="text-xs text-gray-400">{b.date}</span>
            </div>
            <p className="text-sm text-gray-800 leading-snug">{b.title}</p>
            <p className="text-xs text-gray-400 mt-1">{b.ref} · applies to {b.appliesTo}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
