"use client";

import React, { useState, useEffect } from "react";
import { X, Check, Lock, Utensils, Activity, Footprints, Pill, Moon, Brain, Battery } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/ui/FormControls";
import { todayISO } from "@/lib/roadmap";
import { getCheckin, saveCheckin } from "@/lib/storage";
import { CheckinData } from "@/lib/types";
import { LucideIcon } from "lucide-react";

interface FieldDef {
  key: keyof CheckinData;
  label: string;
  sub?: string;
  icon: LucideIcon;
  options: { value: string; label: string }[];
}

const CHECKIN_FIELDS: FieldDef[] = [
  {
    key: "diet", label: "Diet quality", sub: "How clean was your eating?", icon: Utensils,
    options: [{ value: "full", label: "Full" }, { value: "partial", label: "Partial" }, { value: "no", label: "Off" }],
  },
  {
    key: "workout", label: "Workout", icon: Activity,
    options: [{ value: "full", label: "Full" }, { value: "partial", label: "Partial" }, { value: "skipped", label: "Skipped" }],
  },
  {
    key: "walking", label: "Walking", icon: Footprints,
    options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }],
  },
  {
    key: "medication", label: "Medication", icon: Pill,
    options: [{ value: "yes", label: "Taken" }, { value: "no", label: "Missed" }],
  },
  {
    key: "sleep", label: "Sleep", icon: Moon,
    options: [{ value: "good", label: "Good" }, { value: "average", label: "Average" }, { value: "poor", label: "Poor" }],
  },
  {
    key: "mood", label: "Mood", icon: Brain,
    options: [{ value: "excellent", label: "Great" }, { value: "good", label: "Good" }, { value: "average", label: "Avg" }, { value: "low", label: "Low" }],
  },
];

const DEFAULT_CHECKIN: Omit<CheckinData, "id"> = {
  date: "",
  diet: null,
  workout: null,
  walking: null,
  medication: null,
  sleep: null,
  mood: null,
  energy: 5,
  did_not_follow: false,
  completed_at: null,
};

export function CheckinTab() {
  const today = todayISO();
  const [data, setData] = useState<Omit<CheckinData, "id">>({ ...DEFAULT_CHECKIN, date: today });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCheckin();
  }, []);

  async function loadCheckin() {
    setLoading(true);
    const existing = await getCheckin(today);
    if (existing) {
      setData(existing);
    } else {
      setData({ ...DEFAULT_CHECKIN, date: today });
    }
    setLoading(false);
  }

  const isComplete = !!data.completed_at;
  const isOff = data.did_not_follow;
  const allFilled = CHECKIN_FIELDS.every((f) => data[f.key] !== null);

  function update(key: string, value: any) {
    if (isComplete || isOff) return;
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function finish() {
    const final = { ...data, completed_at: new Date().toISOString() };
    await saveCheckin(final);
    setData(final);
  }

  async function markOff() {
    const offData: Omit<CheckinData, "id"> = {
      ...DEFAULT_CHECKIN,
      date: today,
      did_not_follow: true,
      completed_at: new Date().toISOString(),
    };
    await saveCheckin(offData);
    setData(offData);
  }

  async function reset() {
    const cleared = { ...DEFAULT_CHECKIN, date: today };
    await saveCheckin(cleared);
    setData(cleared);
  }

  if (loading) {
    return <div className="px-5 py-20 text-center text-white/40 text-sm">Loading…</div>;
  }

  if (isOff) {
    return (
      <div className="px-5 pb-32">
        <Card className="p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-3">
            <X className="w-5 h-5 text-amber-300" />
          </div>
          <div className="text-base font-semibold text-white mb-1">Today marked off-plan</div>
          <div className="text-sm text-white/50 mb-5">No worries — tomorrow&apos;s a new day.</div>
          <Button variant="secondary" onClick={reset} className="w-full">Undo</Button>
        </Card>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="px-5 pb-32 space-y-4">
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
              <Lock className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Today&apos;s check-in is in</div>
              <div className="text-xs text-white/50">
                Submitted {new Date(data.completed_at!).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
              </div>
            </div>
          </div>
          <div className="divide-y divide-white/[0.05]">
            {CHECKIN_FIELDS.map((f) => {
              const v = data[f.key] as string | null;
              const opt = f.options.find((o) => o.value === v);
              const Icon = f.icon;
              return (
                <div key={f.key} className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-white/40" />
                    <span className="text-sm text-white/70">{f.label}</span>
                  </div>
                  <span className="text-sm font-medium text-white">{opt?.label || "—"}</span>
                </div>
              );
            })}
            <div className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-2.5">
                <Battery className="w-4 h-4 text-white/40" />
                <span className="text-sm text-white/70">Energy</span>
              </div>
              <span className="text-sm font-medium text-white tabular-nums">{data.energy} / 10</span>
            </div>
          </div>
        </Card>
        <Button variant="ghost" onClick={reset} className="w-full">Edit today&apos;s check-in</Button>
      </div>
    );
  }

  return (
    <div className="px-5 pb-32 space-y-4">
      <div className="px-1">
        <div className="text-[10px] uppercase tracking-[0.18em] text-white/40 font-medium">Daily check-in</div>
        <div className="text-sm text-white/60 mt-1">Quick taps. Submit at the end of your day.</div>
      </div>

      <Card className="p-5 space-y-5">
        {CHECKIN_FIELDS.map((field) => {
          const Icon = field.icon;
          return (
            <div key={field.key}>
              <div className="flex items-center gap-2 mb-2.5">
                <Icon className="w-3.5 h-3.5 text-white/40" />
                <span className="text-xs font-medium text-white/80">{field.label}</span>
                {field.sub && <span className="text-[10px] text-white/30">· {field.sub}</span>}
              </div>
              <SegmentedControl
                options={field.options}
                value={data[field.key] as string | null}
                onChange={(v) => update(field.key, v)}
              />
            </div>
          );
        })}

        <div>
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <Battery className="w-3.5 h-3.5 text-white/40" />
              <span className="text-xs font-medium text-white/80">Energy</span>
            </div>
            <span className="text-sm font-semibold text-white tabular-nums">{data.energy} / 10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={data.energy}
            onChange={(e) => update("energy", parseInt(e.target.value, 10))}
            className="w-full accent-emerald-400 h-1"
          />
        </div>
      </Card>

      <div className="space-y-2">
        <Button onClick={finish} disabled={!allFilled} icon={Check} className="w-full">
          {allFilled ? "Finish today" : "Fill all fields to finish"}
        </Button>
        <Button variant="danger" onClick={markOff} className="w-full">
          I didn&apos;t follow today
        </Button>
      </div>
    </div>
  );
}
