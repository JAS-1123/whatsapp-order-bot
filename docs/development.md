# Local Development Guide

This document outlines the commands available to orchestrate the local development environment seamlessly.

## Quick Start

To spin up the entire stack, run:
```bash
npm run dev
```

This single command utilizes `concurrently` to execute the following processes in parallel:
1. **Express Server** (`ts-node-dev` with live-reloading)
2. **Ngrok Tunnel** (Exposing port 3000 to the public internet)
3. **Ngrok Poller** (Automatically captures and prints the public ngrok URL to your terminal)

*Note: Press `Ctrl+C` once to gracefully shut down the Express server, disconnect from the database, and terminate the ngrok tunnel.*

## Database Management

To easily visualize and manipulate your local database schema/content:
```bash
npm run db:studio
```
This launches Prisma Studio on `http://localhost:5555`.

To completely wipe and reset the local development database:
```bash
npm run db:reset
```
*Warning: This will drop all data and re-apply migrations from scratch. The seed script will automatically run to repopulate core catalogs.*

## Under the Hood

The `npm run dev` script combines three sub-scripts:
- `npm run dev:server`
- `npm run dev:ngrok`
- `npm run dev:ngrok-url`

You can run these individually if you only want to spin up the server without exposing it via ngrok.
