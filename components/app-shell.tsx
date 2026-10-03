import Link from "next/link";
import { Code2, LayoutDashboard, LogOut, Medal, Scale, ShieldCheck, Users } from "lucide-react";
import { currentProfile } from "@/lib/auth";
import { signOut } from "@/app/actions/auth";

const navigation = [{ href: "/dashboard", label: "Mon équipe", icon: LayoutDashboard }, { href: "/leaderboard", label: "Classement", icon: Medal }];
export async function AppShell({ children }: { children: React.ReactNode }) {
  const session = await currentProfile(); const role = session?.profile?.role;
  const links = [...navigation, ...(role === "tech" || role === "admin" ? [{ href: "/tech", label: "Technique", icon: Code2 }] : []), ...(role === "jury" || role === "admin" ? [{ href: "/jury", label: "Jury", icon: Scale }] : []), ...(role === "admin" ? [{ href: "/admin", label: "Administration", icon: ShieldCheck }] : [])];
  return <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 sm:px-6"><header className="flex h-20 items-center justify-between"><Link href="/" className="flex items-center gap-2 font-black tracking-tight"><span className="grid h-9 w-9 place-items-center rounded-xl bg-pumpkin"><Users size={19}/></span><span>HACK<span className="text-ember">DAY</span></span></Link>{session?.profile && <form action={signOut}><button className="btn-secondary px-3" title="Déconnexion"><LogOut size={17}/><span className="hidden sm:inline">Sortir</span></button></form>}</header><div className="grid flex-1 gap-6 pb-8 md:grid-cols-[190px_1fr]"><aside className="panel h-max p-2"><nav className="flex gap-1 overflow-x-auto md:flex-col">{links.map(({ href, label, icon: Icon }) => <Link key={href} href={href as "/dashboard" | "/leaderboard" | "/tech" | "/jury" | "/admin"} className="flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-stone-300 hover:bg-white/10 hover:text-white"><Icon size={17}/>{label}</Link>)}</nav></aside><main>{children}</main></div></div>;
}
