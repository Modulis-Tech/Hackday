export type Role = "participant" | "tech" | "jury" | "admin";

export type Team = {
  id: string; name: string; repo_url: string | null; created_at: string;
  github_stats?: GithubStats | null; final_scores?: FinalScore[];
};
export type Participant = { id: string; team_id: string | null; github_username: string; name: string; role: Role; };
export type GithubStats = { team_id: string; commits_count: number; pr_count: number; updated_at: string; };
export type TechEvaluation = { id: string; team_id: string; tech_member_id: string; code_quality_score: number; architecture_score: number; comment: string | null; };
export type JuryEvaluation = { id: string; team_id: string; jury_id: string; pitch_score: number; innovation_score: number; demo_score: number; };
export type FinalScore = { team_id: string; total_score: number; rank: number | null; category: string | null; };

export type LeaderboardTeam = Team & { github_stats: GithubStats | null; final_scores: FinalScore[] };
