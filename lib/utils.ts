import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function scoreActivity(stats: { commits_count: number; pr_count: number } | null) {
  return (stats?.commits_count ?? 0) + (stats?.pr_count ?? 0) * 5;
}
export function repositoryPath(repoUrl: string) {
  const match = repoUrl.match(/github\.com[/:]([^/]+)\/([^/#]+?)(?:\.git)?\/?$/i);
  return match ? `${match[1]}/${match[2]}` : null;
}
