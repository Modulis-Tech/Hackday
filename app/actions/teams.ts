"use server";
import { revalidatePath } from "next/cache";
import { currentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { repositoryPath } from "@/lib/utils";
export type TeamState = { error?: string; success?: string };

export async function saveTeam(_: TeamState, formData: FormData): Promise<TeamState> {
  const session = await currentProfile(); if (!session?.profile) return { error: "Veuillez vous connecter." };
  const name = String(formData.get("name") ?? "").trim(); const repo_url = String(formData.get("repo_url") ?? "").trim();
  if (!name) return { error: "Le nom de l’équipe est requis." }; if (repo_url && !repositoryPath(repo_url)) return { error: "Utilisez une URL de dépôt GitHub valide." };
  const supabase = await createClient();
  if (session.profile.team_id) { const { error } = await supabase.from("teams").update({ name, repo_url: repo_url || null }).eq("id", session.profile.team_id); if (error) return { error: error.message }; }
  else { const { data, error } = await supabase.from("teams").insert({ name, repo_url: repo_url || null }).select("id").single(); if (error) return { error: error.message }; const { error: joinError } = await supabase.from("participants").update({ team_id: data.id }).eq("id", session.profile.id); if (joinError) return { error: joinError.message }; }
  revalidatePath("/dashboard"); revalidatePath("/leaderboard"); return { success: "Équipe enregistrée." };
}
