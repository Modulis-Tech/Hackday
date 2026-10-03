"use server";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
export type EvaluationState = { error?: string; success?: string };
function score(data: FormData, field: string) { const n = Number(data.get(field)); return Number.isInteger(n) && n >= 0 && n <= 10 ? n : null; }

export async function submitTechEvaluation(_: EvaluationState, formData: FormData): Promise<EvaluationState> {
  const { profile } = await requireRole(["tech", "admin"]); const team_id = String(formData.get("team_id")); const code_quality_score = score(formData, "code_quality_score"); const architecture_score = score(formData, "architecture_score");
  if (!team_id || code_quality_score === null || architecture_score === null) return { error: "Les notes doivent être comprises entre 0 et 10." };
  const supabase = await createClient(); const { error } = await supabase.from("tech_evaluations").upsert({ team_id, tech_member_id: profile.id, code_quality_score, architecture_score, comment: String(formData.get("comment") ?? "") }, { onConflict: "team_id,tech_member_id" });
  if (error) return { error: error.message }; revalidatePath("/tech"); revalidatePath("/leaderboard"); return { success: "Évaluation technique enregistrée." };
}
export async function submitJuryEvaluation(_: EvaluationState, formData: FormData): Promise<EvaluationState> {
  const { profile } = await requireRole(["jury", "admin"]); const team_id = String(formData.get("team_id")); const pitch_score = score(formData, "pitch_score"); const innovation_score = score(formData, "innovation_score"); const demo_score = score(formData, "demo_score");
  if (!team_id || pitch_score === null || innovation_score === null || demo_score === null) return { error: "Les notes doivent être comprises entre 0 et 10." };
  const supabase = await createClient(); const { error } = await supabase.from("jury_evaluations").upsert({ team_id, jury_id: profile.id, pitch_score, innovation_score, demo_score }, { onConflict: "team_id,jury_id" });
  if (error) return { error: error.message }; revalidatePath("/jury"); revalidatePath("/leaderboard"); return { success: "Note du jury enregistrée." };
}
