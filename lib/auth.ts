import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Participant, Role } from "@/types/database";

export async function currentProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("participants").select("*").eq("id", user.id).single();
  return { user, profile: data as Participant | null };
}

export async function requireRole(roles: Role[]) {
  const session = await currentProfile();
  if (!session?.profile) redirect("/login");
  if (!roles.includes(session.profile.role)) redirect("/dashboard");
  return session;
}
