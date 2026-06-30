"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

// ─── SegmentedControl ──────────────────────────────────────

interface SegmentOption {
  value: string;
  label: string;
}

interface SegmentedControlProps {
  options: SegmentOption[];
  value: string | null;
  onChange: (value: string) => void;
  size?: "sm" | "md";
}

export function SegmentedControl({ options, value, onChange, size = "md" }: SegmentedControlProps) {
  const sizing = size === "sm" ? "py-1.5 text-xs" : "py-2 text-sm";
  return (
    <div className="flex bg-white/[0.04] rounded-xl p-1 border border-white/[0.06] w-full">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 px-2 rounded-lg font-medium transition-all ${sizing} ${
            value === opt.value
              ? "bg-white/[0.1] text-white shadow-sm"
              : "text-white/50 hover:text-white/80"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── ProgressBar ───────────────────────────────────────────

interface ProgressBarProps {
  value: number;
  max: number;
  tone?: "emerald" | "amber" | "red";
  height?: string;
}

export function ProgressBar({ value, max, tone = "emerald", height = "h-2" }: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const overage = max > 0 && value > max;
  const tones = { emerald: "bg-emerald-400", amber: "bg-amber-400", red: "bg-red-400" };
  return (
    <div className={`w-full ${height} bg-white/[0.06] rounded-full overflow-hidden`}>
      <div
        className={`h-full ${overage ? "bg-amber-400" : tones[tone]} transition-all duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ─── NumberField ───────────────────────────────────────────

interface NumberFieldProps {
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
  placeholder?: string;
  autoFocus?: boolean;
}

export function NumberField({ value, onChange, suffix, placeholder, autoFocus }: NumberFieldProps) {
  return (
    <div className="relative">
      <input
        type="number"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white text-base tabular-nums focus:outline-none focus:border-emerald-400/40 focus:bg-white/[0.06] placeholder-white/30"
      />
      {suffix && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/40 pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
  );
}

// ─── EmptyState ────────────────────────────────────────────

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  hint?: string;
}

export function EmptyState({ icon: Icon, title, hint }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
      <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-3">
        <Icon className="w-5 h-5 text-white/40" />
      </div>
      <div className="text-sm font-medium text-white/80">{title}</div>
      {hint && <div className="text-xs text-white/40 mt-1">{hint}</div>}
    </div>
  );
}
