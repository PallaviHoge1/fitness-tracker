"use client";

import React from "react";
import { Scale, Utensils, CheckCircle2 } from "lucide-react";

const TABS = [
  { id: "weight", label: "Weight", icon: Scale },
  { id: "food", label: "Food", icon: Utensils },
  { id: "checkin", label: "Check-in", icon: CheckCircle2 },
] as const;

export type TabId = (typeof TABS)[number]["id"];

interface BottomNavProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="max-w-md mx-auto px-4 pb-4">
        <div className="bg-[#141416]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-1.5 shadow-2xl flex">
          {TABS.map((t) => {
            const Icon = t.icon;
            const isActive = active === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onChange(t.id)}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-xl transition-all ${
                  isActive ? "bg-white/[0.06] text-white" : "text-white/40 hover:text-white/70"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px] font-medium tracking-wide">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
