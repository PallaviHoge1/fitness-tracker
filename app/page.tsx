"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { BottomNav, TabId } from "@/components/layout/BottomNav";
import { WeightTab } from "@/components/weight/WeightTab";
import { FoodTab } from "@/components/food/FoodTab";
import { CheckinTab } from "@/components/checkin/CheckinTab";

export default function Home() {
  const [tab, setTab] = useState<TabId>("weight");

  return (
    <div className="min-h-screen">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/[0.03] rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/[0.02] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-md mx-auto">
        <Header />
        {tab === "weight" && <WeightTab />}
        {tab === "food" && <FoodTab />}
        {tab === "checkin" && <CheckinTab />}
        <BottomNav active={tab} onChange={setTab} />
      </div>
    </div>
  );
}
