# terminal-x

This repository contains a monorepo skeleton for a modular Discord bot platform.

## Packages

- `@terminal-x/bot` – placeholder for the Discord bot runtime.
- `@terminal-x/api` – placeholder for the API service.
- `@terminal-x/shared` – shared utilities and types.
- `@terminal-x/web` – placeholder for the web admin panel.

This is an initial scaffold; full feature implementation is pending.

## Sprint 2 – Moderation & Automod

This sprint adds a basic moderation system with a `/mod warn` command, an Automod
pipeline for profanity and link filtering, Prisma models for guild moderation
configuration, and API endpoints with a minimal web panel to edit these configs.
