"use client";
import { useEffect, useState } from "react";
import { HACKATHON_END } from "@/lib/constants";

const units = ["J", "H", "M", "S"];
function remaining() { const d = Math.max(0, new Date(HACKATHON_END).getTime() - Date.now()); return [Math.floor(d / 864e5), Math.floor(d / 36e5) % 24, Math.floor(d / 6e4) % 60, Math.floor(d / 1e3) % 60]; }
export function Countdown() { const [values, setValues] = useState(remaining); useEffect(() => { const id = setInterval(() => setValues(remaining()), 1000); return () => clearInterval(id); }, []); return <div className="flex gap-2">{values.map((value, index) => <div key={units[index]} className="rounded-xl bg-black/25 px-3 py-2 text-center"><strong className="block text-xl tabular-nums text-ember">{String(value).padStart(2, "0")}</strong><span className="text-[10px] font-bold text-stone-500">{units[index]}</span></div>)}</div>; }
