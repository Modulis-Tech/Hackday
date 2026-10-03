import { AppShell } from "@/components/app-shell";
import { LeaderboardTable } from "@/components/leaderboard-table";
import { SCORE_HELP } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import type { LeaderboardTeam } from "@/types/database";
import { Trophy } from "lucide-react";
export const revalidate = 30;
export default async function LeaderboardPage() { const supabase = await createClient(); const { data } = await supabase.from("teams").select("*, github_stats(*), final_scores(*)").order("created_at"); const teams = ((data ?? []) as LeaderboardTeam[]).sort((a, b) => (a.final_scores?.[0]?.total_score ?? 0) - (b.final_scores?.[0]?.total_score ?? 0)).reverse(); return <AppShell><section className="panel p-6 sm:p-8"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-bold uppercase tracking-widest text-ember">Live leaderboard</p><h1 className="mt-1 text-3xl font-black">Le classement</h1><p className="mt-2 max-w-2xl text-sm text-stone-400">{SCORE_HELP}</p></div><div className="flex items-center gap-2 text-sm font-bold text-ember"><Trophy size={18}/> Mise à jour régulière</div></div><div className="mt-7">{teams.length ? <LeaderboardTable teams={teams}/> : <p className="rounded-xl bg-white/5 p-8 text-center text-stone-400">Les équipes apparaîtront ici dès leur inscription.</p>}</div></section></AppShell>; }
