"use client";
import { useActionState } from "react";
import { saveTeam, type TeamState } from "@/app/actions/teams";
const initial: TeamState = {};
export function TeamForm({ team }: { team?: { name: string; repo_url: string | null } | null }) { const [state, action, pending] = useActionState(saveTeam, initial); return <form action={action} className="space-y-4"><label><span className="label">Nom de l’équipe</span><input name="name" defaultValue={team?.name} required placeholder="Les Pumpkin Coders" /></label><label><span className="label">Dépôt GitHub</span><input name="repo_url" type="url" defaultValue={team?.repo_url ?? ""} placeholder="https://github.com/organisation/projet" /></label>{state.error && <p className="text-sm text-red-300">{state.error}</p>}{state.success && <p className="text-sm text-green-300">{state.success}</p>}<button className="btn-primary" disabled={pending}>{pending ? "Enregistrement…" : team ? "Mettre à jour" : "Créer mon équipe"}</button></form>; }
