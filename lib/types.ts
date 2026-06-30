export interface RoadmapWeek {
  week: number;
  startDate: string;
  endDate: string;
  startKg: number;
  endKg: number;
  calories: number;
  protein: number;
}

export interface WeightLog {
  id?: string;
  week: number;
  kg: number;
  logged_at: string;
}

export interface FoodEntry {
  id: string;
  date: string;
  meal: "breakfast" | "lunch" | "dinner" | "snack";
  name: string;
  grams: number;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  iron_mg: number;
  calcium_mg: number;
  vitamin_d_iu: number;
  vitamin_b12_mcg: number;
  magnesium_mg: number;
  potassium_mg: number;
  zinc_mg: number;
  sodium_mg: number;
  logged_at: string;
}

export interface NutritionResult {
  name: string;
  grams: number;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  iron_mg: number;
  calcium_mg: number;
  vitamin_d_iu: number;
  vitamin_b12_mcg: number;
  magnesium_mg: number;
  potassium_mg: number;
  zinc_mg: number;
  sodium_mg: number;
}

export interface CheckinData {
  id?: string;
  date: string;
  diet: "full" | "partial" | "no" | null;
  workout: "full" | "partial" | "skipped" | null;
  walking: "yes" | "no" | null;
  medication: "yes" | "no" | null;
  sleep: "good" | "average" | "poor" | null;
  mood: "excellent" | "good" | "average" | "low" | null;
  energy: number;
  did_not_follow: boolean;
  completed_at: string | null;
}

export interface NutritionTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  iron: number;
  calcium: number;
  vitaminD: number;
  b12: number;
  magnesium: number;
  potassium: number;
  zinc: number;
  sodium: number;
}
