# Hacktoberfest Hack Day

Application open source de gestion d’un hackathon en temps réel : équipes, dépôt GitHub, évaluation technique, jury et classement public.

## Fonctionnalités

- Inscription Supabase et rôles `participant`, `tech`, `jury`, `admin`.
- Création d’équipe, profil GitHub et dépôt suivi.
- Évaluations technique et jury, historisées par évaluateur.
- Synchronisation GitHub des commits et pull requests.
- Classement public calculé automatiquement et catégories spéciales.

## Démarrage rapide

1. Installez Node.js 20+ et créez un projet Supabase.
2. Copiez `.env.example` vers `.env.local`, puis renseignez au minimum `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Exécutez le contenu de [supabase/schema.sql](supabase/schema.sql) dans l’éditeur SQL Supabase.
4. Dans Supabase Auth, définissez l’URL de redirection sur `http://localhost:3000/auth/callback`.
5. Installez et lancez l’application :

```bash
npm install
npm run dev
```

## Rôles

Les nouvelles inscriptions sont des participants. Un administrateur attribue les rôles dans la table `participants` :

```sql
update public.participants set role = 'tech' where github_username = 'octocat';
```

## Synchronisation GitHub

Depuis l’interface `/admin`, un administrateur lance la synchronisation. Cette action utilise sa session Supabase et les politiques RLS ; aucune clé de service n’est nécessaire pour ce flux.

Pour une synchronisation planifiée, configurez `SUPABASE_SERVICE_ROLE_KEY` et `GITHUB_SYNC_SECRET`, puis appelez `POST /api/github/sync` avec `Authorization: Bearer <GITHUB_SYNC_SECRET>`. `GITHUB_TOKEN` est conseillé pour augmenter la limite API GitHub.

## Projet Supabase connecté

Le schéma initial est déjà appliqué au projet Supabase configuré. Il comprend les six tables métier, les politiques RLS, la création automatique du profil à l’inscription et les triggers de recalcul du classement.

Après votre inscription, attribuez les rôles depuis le SQL Editor Supabase :

```sql
update public.participants set role = 'admin' where github_username = 'votre_pseudo_github';
```

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Guide de contribution](CONTRIBUTING.md)
- [Sécurité](SECURITY.md)
- [Licence](LICENSE)
