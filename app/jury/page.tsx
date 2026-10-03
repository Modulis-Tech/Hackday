import { AppShell } from "@/components/app-shell";
import { EvaluationForm } from "@/components/evaluation-form";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Mic2 } from "lucide-react";
export default async function JuryPage() { await requireRole(["jury", "admin"]); const supabase = await createClient(); const { data: teams } = await supabase.from("teams").select("id,name,repo_url").order("name"); return <AppShell><section><p className="text-sm font-bold uppercase tracking-widest text-ember">Notation en direct</p><h1 className="mt-1 flex items-center gap-2 text-3xl font-black"><Mic2 className="text-ember"/> Jury</h1><p className="mt-2 text-stone-400">Chaque note est visible dans le calcul global dès la prochaine synchronisation.</p><div className="mt-6 grid gap-5 lg:grid-cols-2">{(teams ?? []).map((team) => <article key={team.id} className="panel p-5"><h2 className="mb-5 font-black">{team.name}</h2><EvaluationForm teamId={team.id} kind="jury"/></article>)}</div></section></AppShell>; }
