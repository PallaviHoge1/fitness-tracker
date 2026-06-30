import { supabase } from "./supabase";
import { WeightLog, FoodEntry, CheckinData } from "./types";
import { todayISO } from "./roadmap";

// ─── Weight Logs ───────────────────────────────────────────

export async function getWeightLog(week: number): Promise<WeightLog | null> {
  const { data } = await supabase
    .from("weight_logs")
    .select("*")
    .eq("week", week)
    .maybeSingle();
  return data;
}

export async function saveWeightLog(week: number, kg: number): Promise<WeightLog | null> {
  const { data } = await supabase
    .from("weight_logs")
    .upsert({ week, kg, logged_at: todayISO() }, { onConflict: "week" })
    .select()
    .single();
  return data;
}

export async function getAllWeightLogs(): Promise<WeightLog[]> {
  const { data } = await supabase
    .from("weight_logs")
    .select("*")
    .order("week", { ascending: false });
  return data || [];
}

// ─── Food Entries ──────────────────────────────────────────

export async function getFoodEntries(date: string): Promise<FoodEntry[]> {
  const { data } = await supabase
    .from("food_entries")
    .select("*")
    .eq("date", date)
    .order("logged_at", { ascending: true });
  return data || [];
}

export async function addFoodEntries(entries: Omit<FoodEntry, "id">[]): Promise<FoodEntry[]> {
  const { data } = await supabase
    .from("food_entries")
    .insert(entries)
    .select();
  return data || [];
}

export async function deleteFoodEntry(id: string): Promise<void> {
  await supabase.from("food_entries").delete().eq("id", id);
}

// ─── Check-ins ─────────────────────────────────────────────

export async function getCheckin(date: string): Promise<CheckinData | null> {
  const { data } = await supabase
    .from("checkins")
    .select("*")
    .eq("date", date)
    .maybeSingle();
  return data;
}

export async function saveCheckin(checkin: Omit<CheckinData, "id">): Promise<CheckinData | null> {
  const { data } = await supabase
    .from("checkins")
    .upsert(checkin, { onConflict: "date" })
    .select()
    .single();
  return data;
}
