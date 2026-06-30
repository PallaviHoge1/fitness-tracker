"use client";

import React from "react";
import { getCurrentWeek, getPhase, todayISO, formatDateShort } from "@/lib/roadmap";

export function Header() {
  const week = getCurrentWeek();
  const phase = getPhase(week.week);
  const overallPct = ((week.week - 1) / 57) * 100;

  return (
    <div className="px-5 pt-6 pb-4">
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-white/40 font-medium">
            Week {week.week} of 57
          </div>
          <div className="text-xl font-semibold text-white tracking-tight mt-0.5">
            {formatDateShort(todayISO())}
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06]">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: phase.hex }} />
          <span className="text-xs text-white/70 font-medium">{phase.label}</span>
        </div>
      </div>
      <div className="relative h-1 bg-white/[0.05] rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-emerald-400 transition-all duration-700"
          style={{ width: `${overallPct}%` }}
        />
      </div>
    </div>
  );
}
