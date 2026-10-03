-- Hacktoberfest Hack Day database schema. Run in the Supabase SQL editor.
create extension if not exists "uuid-ossp";

create type public.user_role as enum ('participant', 'tech', 'jury', 'admin');

create table public.teams (
  id uuid primary key default uuid_generate_v4(), name text not null unique,
  repo_url text, created_at timestamptz not null default now()
);
create table public.participants (
  id uuid primary key references auth.users(id) on delete cascade,
  team_id uuid references public.teams(id) on delete set null,
  github_username text not null, name text not null, role public.user_role not null default 'participant'
);
create table public.github_stats (
  team_id uuid primary key references public.teams(id) on delete cascade,
  commits_count integer not null default 0 check (commits_count >= 0),
  pr_count integer not null default 0 check (pr_count >= 0), updated_at timestamptz not null default now()
);
create table public.tech_evaluations (
  id uuid primary key default uuid_generate_v4(), team_id uuid not null references public.teams(id) on delete cascade,
  tech_member_id uuid not null references public.participants(id) on delete cascade,
  code_quality_score smallint not null check (code_quality_score between 0 and 10),
  architecture_score smallint not null check (architecture_score between 0 and 10), comment text,
  created_at timestamptz not null default now(), unique(team_id, tech_member_id)
);
create table public.jury_evaluations (
  id uuid primary key default uuid_generate_v4(), team_id uuid not null references public.teams(id) on delete cascade,
  jury_id uuid not null references public.participants(id) on delete cascade,
  pitch_score smallint not null check (pitch_score between 0 and 10),
  innovation_score smallint not null check (innovation_score between 0 and 10),
  demo_score smallint not null check (demo_score between 0 and 10),
  created_at timestamptz not null default now(), unique(team_id, jury_id)
);
create table public.final_scores (
  team_id uuid primary key references public.teams(id) on delete cascade,
  total_score numeric(10,2) not null default 0, rank integer, category text, updated_at timestamptz not null default now()
);

-- Creates the participant profile for both immediate and email-confirmed sign-ups.
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.participants (id, name, github_username, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', 'Participant'), coalesce(new.raw_user_meta_data->>'github_username', ''), 'participant');
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

alter table public.teams enable row level security;
alter table public.participants enable row level security;
alter table public.github_stats enable row level security;
alter table public.tech_evaluations enable row level security;
alter table public.jury_evaluations enable row level security;
alter table public.final_scores enable row level security;

create policy "public leaderboard readable" on public.teams for select using (true);
create policy "public stats readable" on public.github_stats for select using (true);
create policy "public scores readable" on public.final_scores for select using (true);
create policy "users read profiles" on public.participants for select using (auth.uid() = id);
create policy "users update own profile" on public.participants for update using (auth.uid() = id);
create policy "participants create teams" on public.teams for insert with check (auth.uid() is not null);
create policy "participants update their team" on public.teams for update using (exists (select 1 from public.participants p where p.id = auth.uid() and p.team_id = teams.id));
create policy "tech submit evaluation" on public.tech_evaluations for all using (exists (select 1 from public.participants p where p.id = auth.uid() and p.role in ('tech', 'admin')));
create policy "jury submit evaluation" on public.jury_evaluations for all using (exists (select 1 from public.participants p where p.id = auth.uid() and p.role in ('jury', 'admin')));

create or replace function public.refresh_final_scores() returns void language sql security definer as $$
  insert into public.final_scores (team_id, total_score, rank, category, updated_at)
  select t.id,
    coalesce(g.commits_count, 0) + coalesce(g.pr_count, 0) * 5
    + coalesce(te.avg_score, 0) * 10 + coalesce(je.avg_score, 0) * 10,
    rank() over (order by (coalesce(g.commits_count, 0) + coalesce(g.pr_count, 0) * 5 + coalesce(te.avg_score, 0) * 10 + coalesce(je.avg_score, 0) * 10) desc),
    case when row_number() over (order by (coalesce(g.commits_count, 0) + coalesce(g.pr_count, 0) * 5 + coalesce(te.avg_score, 0) * 10 + coalesce(je.avg_score, 0) * 10) desc) = 1 then 'Meilleur Projet Global'
         when row_number() over (order by coalesce(g.commits_count, 0) desc) = 1 then 'Meilleur Committer' end, now()
  from public.teams t left join public.github_stats g on g.team_id = t.id
  left join (select team_id, avg((code_quality_score + architecture_score) / 2.0) avg_score from public.tech_evaluations group by team_id) te on te.team_id = t.id
  left join (select team_id, avg((pitch_score + innovation_score + demo_score) / 3.0) avg_score from public.jury_evaluations group by team_id) je on je.team_id = t.id
  on conflict (team_id) do update set total_score = excluded.total_score, rank = excluded.rank, category = excluded.category, updated_at = now();
$$;

create or replace function public.refresh_scores_trigger() returns trigger language plpgsql security definer as $$ begin
  perform public.refresh_final_scores(); return coalesce(new, old);
end; $$;
create trigger refresh_scores_after_github_stats after insert or update or delete on public.github_stats for each statement execute function public.refresh_scores_trigger();
create trigger refresh_scores_after_tech after insert or update or delete on public.tech_evaluations for each statement execute function public.refresh_scores_trigger();
create trigger refresh_scores_after_jury after insert or update or delete on public.jury_evaluations for each statement execute function public.refresh_scores_trigger();
