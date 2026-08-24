"use client";

import { useState, useCallback } from "react";
import TopNav from "@/components/dashboard/top-nav";
import ConversationsPanel from "@/components/dashboard/conversations-panel";
import KpiCard from "@/components/dashboard/kpi-card";
import AttentionList from "@/components/dashboard/attention-list";
import DeliveryTrend from "@/components/dashboard/delivery-trend";
import RevenueAtRisk from "@/components/dashboard/revenue-at-risk";
import UpcomingMilestones from "@/components/dashboard/upcoming-milestones";
import VendorConcentration from "@/components/dashboard/vendor-concentration";
import SalesDashboard from "@/components/dashboard/sales-dashboard";
import ConversationOverlay from "@/components/conversation/conversation-overlay";
import { ConversationLauncherContext, type LaunchArgs } from "@/components/dashboard/conversation-launcher";
import { KPI_DATA } from "@/lib/dashboard-data";
import { useAppSelector } from "@/store/hooks";

export default function DashboardPage() {
  const [conv, setConv] = useState<{ visible: boolean; context?: string; prompt?: string }>({ visible: false });
  const selectedRole = useAppSelector((s) => s.auth.selectedRole);
  const isSales = selectedRole === "Sales";

  const openConversation = useCallback((args?: LaunchArgs) => {
    setConv({ visible: true, context: args?.context, prompt: args?.prompt });
  }, []);

  return (
    <ConversationLauncherContext.Provider value={openConversation}>
    <div className="h-screen bg-[#F3F4F6] font-patrick-hand relative overflow-hidden">

      {/* Right conversations panel — anchored below nav, never scrolls under it */}
      <div className="absolute top-[64px] right-4 bottom-4 w-[400px]">
        <ConversationsPanel onNewConversation={() => openConversation()} />
      </div>

      {/* Left content — starts at top-0 so it can scroll under the nav */}
      {/* right = 16px page pad + 400px panel + 16px gap = 432px */}
      <div className="no-scrollbar absolute top-0 left-0 bottom-0 overflow-y-auto" style={{ right: 432 }}>
        <div className="px-4 pb-4 pt-[64px] flex flex-col gap-4">
          {isSales ? (
            <SalesDashboard />
          ) : (
            <>
              <div className="grid grid-cols-4 gap-4">
                {KPI_DATA.map((kpi) => (
                  <KpiCard key={kpi.id} {...kpi} />
                ))}
              </div>
              <AttentionList />

              {/* PM data visuals */}
              <div className="grid grid-cols-2 gap-4">
                <DeliveryTrend />
                <RevenueAtRisk />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <UpcomingMilestones />
                <VendorConcentration />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Progressive blur — covers exactly the nav zone (0–64px) */}
      <div className="absolute top-0 left-0 right-0 z-20 h-[64px] pointer-events-none overflow-hidden">
        <div style={{
          position: "absolute", inset: 0,
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          maskImage: "linear-gradient(to bottom, black 0%, black 10%, transparent 40%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 10%, transparent 40%)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
          maskImage: "linear-gradient(to bottom, black 0%, black 30%, transparent 65%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 30%, transparent 65%)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)",
          maskImage: "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(243,244,246,0.97) 0%, rgba(243,244,246,0.55) 55%, rgba(243,244,246,0) 100%)",
        }} />
      </div>

      {/* Nav content — above blur layers */}
      <div className="absolute top-0 left-0 right-0 z-30 px-4 pt-4 pointer-events-none">
        <div className="pointer-events-auto">
          <TopNav />
        </div>
      </div>

      {/* Unified conversation overlay — welcome → chat on one screen */}
      <ConversationOverlay
        visible={conv.visible}
        context={conv.context}
        initialPrompt={conv.prompt}
        onClose={() => setConv((c) => ({ ...c, visible: false }))}
      />
    </div>
    </ConversationLauncherContext.Provider>
  );
}
