import { MAP_MARKERS } from "@/lib/sales-data";
import WidgetChat from "@/components/dashboard/widget-chat";

export default function FleetMap() {
  return (
    <div
      className="relative rounded-xl overflow-hidden h-full min-h-[420px] bg-gray-100 bg-cover bg-center grayscale"
      style={{ backgroundImage: "url(/milan-map.png)" }}
    >
      {/* Asset markers */}
      {MAP_MARKERS.map((m, i) => (
        <span
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
          style={{ left: `${m.x}%`, top: `${m.y}%` }}
        >
          {m.ping && (
            <span className="absolute inline-flex h-12 w-12 rounded-full bg-gray-900/30 animate-ping [animation-duration:2.5s]" />
          )}
          <span className="relative inline-flex w-3 h-3 rounded-full bg-gray-900 ring-4 ring-gray-900/15" />
        </span>
      ))}

      {/* Chat affordance */}
      <div className="absolute top-4 right-4">
        <WidgetChat
          title="Fleet map"
          triggerClassName="w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        />
      </div>
    </div>
  );
}
