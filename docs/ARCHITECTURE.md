# Architecture

## Vue d’ensemble

Next.js App Router rend les écrans et les Server Actions. Supabase fournit Auth, PostgreSQL et le temps réel de persistance. La route API GitHub utilise la clé de service uniquement côté serveur.

## Score

`activité GitHub = commits + (pull requests × 5)`.

`score final = activité + (moyenne technique × 10) + (moyenne jury × 10)`.

Les triggers PostgreSQL appellent `refresh_final_scores` après chaque nouvelle statistique ou évaluation. Le classement est donc recalculé à chaque écriture.

## Sécurité

RLS est activé sur toutes les tables. Les rôles protègent les Server Actions et les écrans. Ne jamais exposer `SUPABASE_SERVICE_ROLE_KEY` ni `GITHUB_SYNC_SECRET` au navigateur.

## Arborescence

```text
app/                 pages, Server Actions et API routes
components/          interface réutilisable
lib/                 Supabase, authentification et utilitaires
supabase/schema.sql  schéma et politiques RLS
types/               contrats TypeScript
docs/                documentation projet
```
