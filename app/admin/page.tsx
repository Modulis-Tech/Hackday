import { AppShell } from "@/components/app-shell";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { RefreshGithub } from "@/components/refresh-github";
import { ShieldCheck } from "lucide-react";
export default async function AdminPage() { await requireRole(["admin"]); const supabase = await createClient(); const { count } = await supabase.from("teams").select("id", { count: "exact", head: true }); return <AppShell><section className="panel max-w-2xl p-7"><p className="text-sm font-bold uppercase tracking-widest text-ember">Administration</p><h1 className="mt-1 flex items-center gap-2 text-3xl font-black"><ShieldCheck className="text-ember"/> Synchronisation GitHub</h1><p className="mt-3 text-stone-400">Interrogez GitHub pour mettre à jour les commits et pull requests de {count ?? 0} équipe(s), puis recalculez automatiquement le classement.</p><div className="mt-7"><RefreshGithub/></div></section></AppShell>; }
