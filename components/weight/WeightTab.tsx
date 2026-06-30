"use client";

import React, { useState, useEffect } from "react";
import { Scale, Plus, CheckCircle2, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { NumberField, EmptyState } from "@/components/ui/FormControls";
import { getCurrentWeek, getPhase, formatDateShort, round1, ROADMAP } from "@/lib/roadmap";
import { getWeightLog, saveWeightLog, getAllWeightLogs } from "@/lib/storage";
import { WeightLog } from "@/lib/types";

export function WeightTab() {
  const currentWeek = getCurrentWeek();
  const phase = getPhase(currentWeek.week);

  const [thisWeekLog, setThisWeekLog] = useState<WeightLog | null>(null);
  const [history, setHistory] = useState<WeightLog[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [log, logs] = await Promise.all([
      getWeightLog(currentWeek.week),
      getAllWeightLogs(),
    ]);
    setThisWeekLog(log);
    setHistory(logs);
    setLoading(false);
  }

  const lastTwo = history.slice(0, 2);
  const delta = lastTwo.length === 2 ? round1(lastTwo[0].kg - lastTwo[1].kg) : null;

  async function save() {
    const kg = parseFloat(draft);
    if (isNaN(kg) || kg < 30 || kg > 300) return;
    await saveWeightLog(currentWeek.week, round1(kg));
    setDraft("");
    setSheetOpen(false);
    await loadData();
  }

  const isTuesday = new Date().getDay() === 2;

  if (loading) {
    return (
      <div className="px-5 py-20 text-center text-white/40 text-sm">Loading…</div>
    );
  }

  return (
    <div className="px-5 space-y-4 pb-32">
      <Card className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-white/40 font-medium">
              This week&apos;s target
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-4xl font-semibold text-white tabular-nums tracking-tight">
                {currentWeek.endKg}
              </span>
              <span className="text-base text-white/40">kg</span>
            </div>
            <div className="text-xs text-white/50 mt-1.5">
              from {currentWeek.startKg} kg · {formatDateShort(currentWeek.startDate)} →{" "}
              {formatDateShort(currentWeek.endDate)}
            </div>
          </div>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${phase.hex}15`, border: `1px solid ${phase.hex}30` }}
          >
            <Scale className="w-5 h-5" style={{ color: phase.hex }} />
          </div>
        </div>

        {thisWeekLog ? (
          <div className="bg-emerald-400/[0.06] border border-emerald-400/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-medium text-emerald-300">
                Logged {formatDateShort(thisWeekLog.logged_at)}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-semibold text-white tabular-nums">
                  {thisWeekLog.kg}
                </span>
                <span className="text-sm text-white/40">kg</span>
              </div>
              {delta !== null && (
                <div className="flex items-center gap-1 text-sm font-medium tabular-nums">
                  <TrendingDown className={`w-4 h-4 ${delta < 0 ? "text-emerald-400" : "text-white/40"}`} />
                  <span className={delta < 0 ? "text-emerald-300" : "text-white/60"}>
                    {delta > 0 ? "+" : ""}{delta} kg
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <Button icon={Plus} onClick={() => setSheetOpen(true)} className="w-full">
              Log this week&apos;s weight
            </Button>
            {!isTuesday && (
              <p className="text-[11px] text-white/40 text-center mt-2.5">
                Weigh-in day is Tuesday — logging today still counts for this week.
              </p>
            )}
          </>
        )}
      </Card>

      <div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-white/40 font-medium px-1 mb-2">
          History
        </div>
        <Card className="divide-y divide-white/[0.05]">
          {history.length === 0 ? (
            <EmptyState icon={Scale} title="No weigh-ins yet" hint="Your weekly history will build up here." />
          ) : (
            history.map((h, idx) => {
              const next = history[idx + 1];
              const change = next ? round1(h.kg - next.kg) : null;
              const target = ROADMAP.find((w) => w.week === h.week);
              const vsTarget = target ? round1(h.kg - target.endKg) : null;
              return (
                <div key={h.week} className="flex items-center justify-between p-4">
                  <div>
                    <div className="text-sm font-medium text-white">Week {h.week}</div>
                    <div className="text-xs text-white/40">{formatDateShort(h.logged_at)}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    {vsTarget !== null && (
                      <div className="text-right">
                        <div className="text-[10px] uppercase tracking-wider text-white/40">vs target</div>
                        <div className={`text-xs font-medium tabular-nums ${vsTarget <= 0 ? "text-emerald-300" : "text-amber-300"}`}>
                          {vsTarget > 0 ? "+" : ""}{vsTarget} kg
                        </div>
                      </div>
                    )}
                    <div className="text-right min-w-[60px]">
                      <div className="text-lg font-semibold text-white tabular-nums">{h.kg}</div>
                      {change !== null && (
                        <div className={`text-xs tabular-nums ${change < 0 ? "text-emerald-400" : "text-white/40"}`}>
                          {change > 0 ? "+" : ""}{change}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </Card>
      </div>

      <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} title={`Log Week ${currentWeek.week} weight`}>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-white/50 mb-2 block">Today&apos;s weight</label>
            <NumberField value={draft} onChange={setDraft} suffix="kg" placeholder="0.0" autoFocus />
          </div>
          <div className="bg-white/[0.03] rounded-xl p-3 text-xs text-white/50 leading-relaxed">
            Target for end of this week:{" "}
            <span className="text-white/80 font-medium">{currentWeek.endKg} kg</span>.
            Previous: {currentWeek.startKg} kg.
          </div>
          <Button onClick={save} disabled={!draft} className="w-full">
            Save weigh-in
          </Button>
        </div>
      </Sheet>
    </div>
  );
}
