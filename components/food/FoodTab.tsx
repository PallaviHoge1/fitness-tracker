"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Utensils, Plus, Trash2, Loader2, Sparkles, AlertCircle, Check, Coffee, Sun, Moon, Cookie } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { ProgressBar, EmptyState } from "@/components/ui/FormControls";
import { getCurrentWeek, todayISO, round1 } from "@/lib/roadmap";
import { getFoodEntries, addFoodEntries, deleteFoodEntry } from "@/lib/storage";
import { FoodEntry, NutritionResult, NutritionTotals } from "@/lib/types";
import { LucideIcon } from "lucide-react";

const MEALS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "breakfast", label: "Breakfast", icon: Coffee },
  { id: "lunch", label: "Lunch", icon: Sun },
  { id: "dinner", label: "Dinner", icon: Moon },
  { id: "snack", label: "Snack", icon: Cookie },
];

const EMPTY_TOTALS: NutritionTotals = {
  calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0,
  iron: 0, calcium: 0, vitaminD: 0, b12: 0, magnesium: 0, potassium: 0, zinc: 0, sodium: 0,
};

async function analyzeFood(input: string): Promise<NutritionResult[]> {
  const res = await fetch("/api/analyze-food", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Analysis failed");
  }
  const data = await res.json();
  return data.items;
}

export function FoodTab() {
  const today = todayISO();
  const currentWeek = getCurrentWeek();
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [sheetOpen, setSheetOpen] = useState<string | false>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, []);

  async function loadEntries() {
    setLoading(true);
    const data = await getFoodEntries(today);
    setEntries(data);
    setLoading(false);
  }

  const totals = useMemo<NutritionTotals>(() => {
    return entries.reduce((acc, e) => ({
      calories: acc.calories + (e.calories || 0),
      protein: acc.protein + (e.protein_g || 0),
      carbs: acc.carbs + (e.carbs_g || 0),
      fat: acc.fat + (e.fat_g || 0),
      fiber: acc.fiber + (e.fiber_g || 0),
      iron: acc.iron + (e.iron_mg || 0),
      calcium: acc.calcium + (e.calcium_mg || 0),
      vitaminD: acc.vitaminD + (e.vitamin_d_iu || 0),
      b12: acc.b12 + (e.vitamin_b12_mcg || 0),
      magnesium: acc.magnesium + (e.magnesium_mg || 0),
      potassium: acc.potassium + (e.potassium_mg || 0),
      zinc: acc.zinc + (e.zinc_mg || 0),
      sodium: acc.sodium + (e.sodium_mg || 0),
    }), EMPTY_TOTALS);
  }, [entries]);

  async function handleDelete(id: string) {
    await deleteFoodEntry(id);
    await loadEntries();
  }

  async function handleAdd(items: NutritionResult[], meal: string) {
    const toInsert = items.map((it) => ({
      date: today,
      meal: meal as FoodEntry["meal"],
      name: it.name,
      grams: it.grams,
      calories: it.calories,
      protein_g: it.protein_g,
      carbs_g: it.carbs_g,
      fat_g: it.fat_g,
      fiber_g: it.fiber_g,
      iron_mg: it.iron_mg,
      calcium_mg: it.calcium_mg,
      vitamin_d_iu: it.vitamin_d_iu,
      vitamin_b12_mcg: it.vitamin_b12_mcg,
      magnesium_mg: it.magnesium_mg,
      potassium_mg: it.potassium_mg,
      zinc_mg: it.zinc_mg,
      sodium_mg: it.sodium_mg,
      logged_at: new Date().toISOString(),
    }));
    await addFoodEntries(toInsert);
    await loadEntries();
  }

  const calPct = currentWeek.calories > 0 ? Math.round((totals.calories / currentWeek.calories) * 100) : 0;
  const proteinPct = currentWeek.protein > 0 ? Math.round((totals.protein / currentWeek.protein) * 100) : 0;

  if (loading) {
    return <div className="px-5 py-20 text-center text-white/40 text-sm">Loading…</div>;
  }

  return (
    <div className="px-5 space-y-4 pb-32">
      {/* Daily totals */}
      <Card className="p-5">
        <div className="flex items-baseline justify-between mb-4">
          <div className="text-[10px] uppercase tracking-[0.18em] text-white/40 font-medium">Today&apos;s intake</div>
          <div className="text-[10px] text-white/40 tabular-nums">{entries.length} {entries.length === 1 ? "item" : "items"}</div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/[0.03] rounded-xl p-3.5">
            <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Calories</div>
            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="text-2xl font-semibold text-white tabular-nums">{Math.round(totals.calories)}</span>
              <span className="text-xs text-white/40 tabular-nums">/ {currentWeek.calories}</span>
            </div>
            <ProgressBar value={totals.calories} max={currentWeek.calories} tone={calPct > 110 ? "amber" : "emerald"} />
          </div>
          <div className="bg-white/[0.03] rounded-xl p-3.5">
            <div className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Protein</div>
            <div className="flex items-baseline gap-1.5 mb-2">
              <span className="text-2xl font-semibold text-white tabular-nums">{Math.round(totals.protein)}</span>
              <span className="text-xs text-white/40 tabular-nums">/ {currentWeek.protein}g</span>
            </div>
            <ProgressBar value={totals.protein} max={currentWeek.protein} tone={proteinPct >= 95 ? "emerald" : "amber"} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <MacroPill label="Carbs" value={Math.round(totals.carbs)} unit="g" />
          <MacroPill label="Fat" value={Math.round(totals.fat)} unit="g" />
          <MacroPill label="Fiber" value={Math.round(totals.fiber)} unit="g" />
        </div>

        {entries.length > 0 && (
          <details className="group">
            <summary className="text-[11px] uppercase tracking-wider text-white/40 cursor-pointer hover:text-white/60 list-none flex items-center gap-1">
              <span>Micronutrients</span>
              <span className="text-white/30 group-open:rotate-90 transition-transform">›</span>
            </summary>
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
              <MicroRow label="Iron" value={round1(totals.iron)} unit="mg" />
              <MicroRow label="Calcium" value={Math.round(totals.calcium)} unit="mg" />
              <MicroRow label="Vitamin D" value={Math.round(totals.vitaminD)} unit="IU" />
              <MicroRow label="B12" value={round1(totals.b12)} unit="mcg" />
              <MicroRow label="Magnesium" value={Math.round(totals.magnesium)} unit="mg" />
              <MicroRow label="Potassium" value={Math.round(totals.potassium)} unit="mg" />
              <MicroRow label="Zinc" value={round1(totals.zinc)} unit="mg" />
              <MicroRow label="Sodium" value={Math.round(totals.sodium)} unit="mg" />
            </div>
          </details>
        )}
      </Card>

      {/* Meal sections */}
      {MEALS.map((meal) => (
        <MealSection
          key={meal.id}
          meal={meal}
          entries={entries.filter((e) => e.meal === meal.id)}
          onDelete={handleDelete}
          onAdd={() => setSheetOpen(meal.id)}
        />
      ))}

      <AddFoodSheet
        open={!!sheetOpen}
        meal={sheetOpen || ""}
        onClose={() => setSheetOpen(false)}
        onAdd={(items) => handleAdd(items, sheetOpen as string)}
      />
    </div>
  );
}

function MacroPill({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="bg-white/[0.03] rounded-lg px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-white/40">{label}</div>
      <div className="text-sm font-semibold text-white tabular-nums">
        {value}<span className="text-xs text-white/40 ml-0.5">{unit}</span>
      </div>
    </div>
  );
}

function MicroRow({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-white/50">{label}</span>
      <span className="text-white/80 tabular-nums font-medium">
        {value}<span className="text-white/40 ml-0.5">{unit}</span>
      </span>
    </div>
  );
}

function MealSection({
  meal,
  entries,
  onDelete,
  onAdd,
}: {
  meal: { id: string; label: string; icon: LucideIcon };
  entries: FoodEntry[];
  onDelete: (id: string) => void;
  onAdd: () => void;
}) {
  const Icon = meal.icon;
  const cal = entries.reduce((s, e) => s + (e.calories || 0), 0);

  return (
    <div>
      <button onClick={onAdd} className="w-full flex items-center justify-between px-1 mb-2 group">
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 text-white/40" />
          <span className="text-[10px] uppercase tracking-[0.18em] text-white/40 font-medium">{meal.label}</span>
          {cal > 0 && <span className="text-[10px] text-white/30 tabular-nums">· {Math.round(cal)} kcal</span>}
        </div>
        <span className="text-xs text-emerald-400 opacity-70 group-hover:opacity-100 flex items-center gap-1">
          <Plus className="w-3 h-3" />Add
        </span>
      </button>
      <Card>
        {entries.length === 0 ? (
          <div className="px-4 py-5 text-xs text-white/30 text-center">Nothing logged yet</div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {entries.map((e) => (
              <div key={e.id} className="flex items-center justify-between p-3.5">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-white capitalize truncate">{e.name}</div>
                  <div className="text-[11px] text-white/40 mt-0.5 tabular-nums">
                    {e.grams}g · {Math.round(e.calories)} kcal · {round1(e.protein_g)}g protein
                  </div>
                </div>
                <button onClick={() => onDelete(e.id)} className="p-2 -m-2 ml-2 text-white/30 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function AddFoodSheet({
  open,
  meal,
  onClose,
  onAdd,
}: {
  open: boolean;
  meal: string;
  onClose: () => void;
  onAdd: (items: NutritionResult[]) => void;
}) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<NutritionResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mealMeta = MEALS.find((m) => m.id === meal);

  function reset() {
    setInput("");
    setPreview(null);
    setError(null);
    setLoading(false);
  }

  function close() {
    reset();
    onClose();
  }

  async function analyze() {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const items = await analyzeFood(input.trim());
      setPreview(items);
    } catch (e: any) {
      setError(e.message || "Couldn't analyze that. Try rephrasing.");
    } finally {
      setLoading(false);
    }
  }

  function confirm() {
    if (preview) {
      onAdd(preview);
      close();
    }
  }

  return (
    <Sheet open={open} onClose={close} title={mealMeta ? `Add to ${mealMeta.label}` : "Add food"}>
      {!preview ? (
        <div className="space-y-4">
          <div>
            <label className="text-xs text-white/50 mb-2 block">What did you eat?</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. 2 boiled eggs, chicken breast 200g, 1 cup brown rice"
              rows={3}
              autoFocus
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-emerald-400/40 focus:bg-white/[0.06] placeholder-white/30 resize-none"
            />
            <p className="text-[11px] text-white/40 mt-2">
              Multiple items? Separate with commas. AI will estimate weights if you don&apos;t specify.
            </p>
          </div>
          {error && (
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <span className="text-xs text-red-300">{error}</span>
            </div>
          )}
          <Button
            onClick={analyze}
            disabled={!input.trim() || loading}
            icon={loading ? Loader2 : Sparkles}
            className={`w-full ${loading ? "[&_svg]:animate-spin" : ""}`}
          >
            {loading ? "Analyzing…" : "Analyze nutrition"}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-xs text-white/50">
            {preview.length} {preview.length === 1 ? "item" : "items"} detected
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto -mx-1 px-1">
            {preview.map((item, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3.5">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-sm font-medium text-white capitalize">{item.name}</span>
                  <span className="text-xs text-white/40 tabular-nums">{item.grams}g</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 text-center">
                  <NutBadge label="kcal" value={Math.round(item.calories)} />
                  <NutBadge label="P" value={round1(item.protein_g)} />
                  <NutBadge label="C" value={round1(item.carbs_g)} />
                  <NutBadge label="F" value={round1(item.fat_g)} />
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={() => setPreview(null)}>Re-analyze</Button>
            <Button onClick={confirm} icon={Check}>Add to log</Button>
          </div>
        </div>
      )}
    </Sheet>
  );
}

function NutBadge({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white/[0.04] rounded-lg py-1.5">
      <div className="text-[9px] uppercase tracking-wider text-white/40">{label}</div>
      <div className="text-xs font-semibold text-white tabular-nums">{value}</div>
    </div>
  );
}
