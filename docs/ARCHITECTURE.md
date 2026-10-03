# Architecture

## Vue d’ensemble

Next.js App Router rend les écrans et les Server Actions. Supabase fournit Auth, PostgreSQL et le temps réel de persistance. La route API GitHub utilise la clé de service uniquement côté serveur.

## Score

`activité GitHub = commits + (pull requests × 5)`.

`score final = activité + (moyenne technique × 10) + (moyenne jury × 10)`.

Les triggers PostgreSQL appellent `refresh_final_scores` après chaque nouvelle statistique ou évaluation. Le classement est donc recalculé à chaque écriture.

## Authentification et rôles

Supabase Auth crée l’utilisateur. Un trigger crée immédiatement sa ligne `participants` avec le rôle `participant`. Les rôles `tech`, `jury` et `admin` sont attribués par un administrateur depuis Supabase.

L’interface `/admin` peut synchroniser GitHub grâce à la session d’un utilisateur `admin` et à une politique RLS d’écriture sur `github_stats`. Pour un appel planifié sans session, la route utilise la clé de service côté serveur, protégée par `GITHUB_SYNC_SECRET`.

## Sécurité

RLS est activé sur toutes les tables. Les rôles protègent les Server Actions, l’API de synchronisation et les écrans. Les fonctions SQL `SECURITY DEFINER` ne sont pas exécutables par les rôles `anon` ou `authenticated`. Ne jamais exposer `SUPABASE_SERVICE_ROLE_KEY` ni `GITHUB_SYNC_SECRET` au navigateur.

## Arborescence

```text
app/                 pages, Server Actions et API routes
components/          interface réutilisable
lib/                 Supabase, authentification et utilitaires
supabase/schema.sql  schéma et politiques RLS
types/               contrats TypeScript
docs/                documentation projet
```
