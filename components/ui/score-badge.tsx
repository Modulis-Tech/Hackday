import { Trophy } from "lucide-react";
export function ScoreBadge({ score }: { score: number }) { return <span className="inline-flex items-center gap-1 rounded-full bg-pumpkin/15 px-2.5 py-1 text-sm font-bold text-ember"><Trophy size={14}/>{Math.round(score)} pts</span>; }
