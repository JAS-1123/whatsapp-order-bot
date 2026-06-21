# 01. Project Overview (Master Architecture Document)

## Introduction
The WhatsApp Ordering Bot is a high-performance, event-driven backend application designed to handle food ordering via Meta's WhatsApp Cloud API. By treating WhatsApp exclusively as a transport layer, it allows users to natively browse menus, manage a stateful shopping cart, and place orders directly in chat without downloading a separate application.

## Core Architecture Philosophy
The system is built on **Clean Architecture** principles. We enforce strict boundaries between our Transport Layer (Express/Webhooks), Business Logic (Services/State Machine), and Data Layer (Repositories/Prisma).

### Key Architectural Decisions
1. **Decoupled Transport**: WhatsApp is just a UI. If we switch to Telegram tomorrow, the `Conversation Engine` and `Services` remain untouched. Only the `Integrations` layer changes.
2. **Event-Driven Side-Effects**: Database transactions must be lightning fast. When an order completes, the DB transaction finishes instantly and we return a `200 OK` to the user. An in-memory **Event Bus** asynchronously fires handlers to trigger WhatsApp push messages (`ORDER_CONFIRMED`). This ensures network latency from Meta never impacts our server's core response times.
3. **Repository Pattern**: All database access goes through `Repositories`. Services never import Prisma directly. This allows us to mock the DB in tests and protects business logic from schema changes.
4. **Idempotency**: Webhooks are guaranteed to fire at least once. If our server is slow, Meta will retry. We hash every incoming message ID in Redis. If a duplicate arrives, we instantly return `200 OK` without processing, protecting users from double-billing.

## Core Features
1. **Stateful Conversation Engine**: A finite state machine tracks if the user is `IDLE`, `BROWSING`, or at `CHECKOUT`. This context is persisted via `SessionService`.
2. **AI & Recommendation Engines**: Smart NLP intent matching ("I want a burger" -> Product Search) and weighted recommendation scoring (Category Affinity + Budget Match + Popularity).
3. **Shopping Cart Management**: Carts are handled entirely in memory/cache to prevent database bloat from abandoned sessions, using automated TTL cleanup.
4. **Order Tracking & Notifications**: Users receive automated status updates (Pending -> Preparing -> Shipped -> Delivered) pushed directly to their chat via the Event Bus.
5. **Secure Admin Dashboard API**: Secured administrative endpoints (`x-api-key`) allow React/Next.js dashboard apps to transition order statuses and manage inventory.

## Tech Stack & Environment
- **Runtime**: Node.js (v18+)
- **Language**: TypeScript (Strict mode enabled)
- **Web Framework**: Express.js (Helmet secured, Zod validated)
- **ORM**: Prisma (Type-safe query builder)
- **Database**: PostgreSQL (Neon Cloud - Serverless with Read Replicas)
- **Architecture**: Monolithic with Event-Driven Domains

### Environment Variables
```env
# Application Setup
PORT=3000
NODE_ENV=development # Enables detailed logging when dev, JSON when prod

# Security
ADMIN_API_KEY=your_secret_key # Secures the Admin REST routes

# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@endpoint/db?sslmode=require

# WhatsApp Meta API
WHATSAPP_TOKEN=EA...         # Bearer token for sending messages
WHATSAPP_PHONE_NUMBER_ID=... # Originating phone number ID
VERIFY_TOKEN=your_custom_token # Used once during webhook setup
```

## Primary Directory Structure
```
src/
├── api/             # HTTP ingress. Controllers for Webhook, Admin, Health.
├── config/          # Zod schema environment validations (fail-fast startup).
├── conversation/    # The Core State Machine (states.ts, engine.ts).
├── database/        # Prisma client instantiation (Singleton pattern).
├── events/          # In-memory Event Bus (eventBus.ts, handlers/).
├── integrations/    # External API wrappers (WhatsApp API, Formatter).
├── middleware/      # Express pipeline (Auth, Error handling, Logging).
├── repositories/    # Database abstraction layer (UserRepository, OrderRepository).
├── routes/          # Express Router registry.
├── services/        # Core business logic (CartService, RecommendationService).
├── types/           # Global TypeScript interfaces.
└── utils/           # Shared utilities (logger, error classes).
```

## The Request Lifecycle (Webhook Flow)
1. **Meta API** sends a POST to `/api/webhook`.
2. **WebhookController** validates the payload shape and signature.
3. **Idempotency Service** checks if `message.id` exists. If yes, return 200.
4. **MessageHandler** parses the text/button payload and normalizes it.
5. **ConversationEngine** loads the user's `ConversationSession` from the DB.
6. The engine evaluates the current state (`BROWSING`), processes the input ("add to cart"), and delegates to the **CartService**.
7. The new state is saved, and a response is formatted via **WhatsAppFormatter** and sent back to the user asynchronously.

## Debugging Guide
- **Webhooks not hitting local?** Check Ngrok tunnel and ensure the URL is updated in the Meta Developer Dashboard.
- **Bot not responding?** Check if the Meta 24-hour customer service window has expired. You can only send templated messages outside this window.
- **Double responses?** Verify the Idempotency layer is functioning and Redis/Cache is reachable. Meta retries aggressively if your endpoint takes > 3 seconds to respond.
