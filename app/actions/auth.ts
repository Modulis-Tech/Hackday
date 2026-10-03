"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type FormState = { error?: string; message?: string };
export async function signIn(_: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? ""); const password = String(formData.get("password") ?? "");
  const supabase = await createClient(); const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message }; redirect("/dashboard");
}
export async function signUp(_: FormState, formData: FormData): Promise<FormState> {
  const name = String(formData.get("name") ?? "").trim(); const github_username = String(formData.get("github_username") ?? "").trim(); const email = String(formData.get("email") ?? ""); const password = String(formData.get("password") ?? "");
  if (!name || !github_username) return { error: "Le nom et le pseudo GitHub sont requis." };
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name, github_username } } });
  if (error) return { error: error.message };
  if (data.user && data.session) redirect("/dashboard");
  return { message: "Vérifiez votre boîte e-mail pour confirmer votre inscription." };
}
export async function signOut() { const supabase = await createClient(); await supabase.auth.signOut(); redirect("/"); }
