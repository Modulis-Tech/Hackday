import { NextRequest, NextResponse } from "next/server";
import { currentProfile } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { repositoryPath } from "@/lib/utils";

type GithubResponse = { headers: Headers; ok: boolean; status: number };
function countFromLink(response: GithubResponse, items: unknown[]) { const last = response.headers.get("link")?.match(/[?&]page=(\d+)>; rel="last"/); return last ? Number(last[1]) * 100 : items.length; }
async function githubCount(path: string, token?: string) { const response = await fetch(`https://api.github.com/repos/${path}`, { headers: { Accept: "application/vnd.github+json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }, next: { revalidate: 0 } }); if (!response.ok) throw new Error(`GitHub a répondu ${response.status}`); const items = await response.json(); return countFromLink(response, items); }

export async function POST(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const serviceToken = process.env.GITHUB_SYNC_SECRET;
  if (token !== serviceToken) { const session = await currentProfile(); if (session?.profile?.role !== "admin") return NextResponse.json({ error: "Non autorisé" }, { status: 401 }); }
  const body = await request.json().catch(() => ({})); const teamId = typeof body.team_id === "string" ? body.team_id : null;
  const supabase = createAdminClient(); let query = supabase.from("teams").select("id,name,repo_url").not("repo_url", "is", null); if (teamId) query = query.eq("id", teamId); const { data: teams, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 }); const results = [];
  for (const team of teams ?? []) { const path = team.repo_url ? repositoryPath(team.repo_url) : null; if (!path) { results.push({ team: team.name, error: "URL GitHub invalide" }); continue; } try { const [commits_count, pr_count] = await Promise.all([githubCount(`${path}/commits?per_page=100`, process.env.GITHUB_TOKEN), githubCount(`${path}/pulls?state=all&per_page=100`, process.env.GITHUB_TOKEN)]); const { error: upsertError } = await supabase.from("github_stats").upsert({ team_id: team.id, commits_count, pr_count, updated_at: new Date().toISOString() }); if (upsertError) throw upsertError; results.push({ team: team.name, commits_count, pr_count }); } catch (reason) { results.push({ team: team.name, error: reason instanceof Error ? reason.message : "Erreur inconnue" }); } }
  await supabase.rpc("refresh_final_scores"); return NextResponse.json({ synced: results.filter((item) => !("error" in item)).length, results });
}
