<div align="center">
  <img src="docs/images/Whatsapp%20Commerce%20Platform%20-%20System%20Architecture.png" alt="WhatsApp Commerce Platform Architecture" width="800"/>

  # WhatsApp Commerce Platform
  
  **A full-stack, enterprise-grade conversational commerce engine built entirely on WhatsApp.**

  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
  [![WhatsApp API](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://developers.facebook.com/docs/whatsapp)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

  *Empowering businesses to sell directly through conversational interfaces using AI, personalized recommendations, and a powerful event-driven backend.*
</div>

---

## 📖 Project Overview

### Why Conversational Commerce?
In the modern digital landscape, the lowest-friction path to a customer is the app they already use every day. By integrating an entire e-commerce journey directly into WhatsApp, we eliminate the need for app downloads, complex sign-ups, and learning new UI paradigms. 

### The Problem Being Solved
Traditional e-commerce platforms suffer from high cart abandonment rates and poor engagement. Conversational commerce bridges this gap by bringing the store directly to the user's chat inbox, offering an intimate, intuitive, and highly responsive shopping experience.

### Business Value
This platform acts as a force multiplier for businesses:
- **Zero Friction Checkout:** Browse, cart, and checkout without ever leaving WhatsApp.
- **Data-Driven Upselling:** Personalized recommendations engine increases average order value (AOV).
- **Reduced Churn:** AI-driven interactions and smart reordering foster customer loyalty.
- **Operational Efficiency:** Admin dashboard provides centralized control over inventory, orders, and analytics.

---

## ✨ Key Features

| Feature | Description | Architecture Highlights |
|---------|-------------|-------------------------|
| 🤖 **AI Shopping Assistant** | Understands natural language queries, extracts intent/budget, and matches products. | NLP Pipeline, Intent Classification |
| 🔍 **Product Search** | Real-time, fuzzy matching product search within the WhatsApp chat. | Repository Pattern, Full-Text Search |
| 🎯 **Personalized Recommendations** | Suggests products based on category affinity, past spend, and popularity. | Scoring Engine, Feature Engineering |
| 🔄 **Smart Reorder** | 1-click reorder of previous meals with real-time inventory validation. | Session Management, Idempotency |
| 🛒 **Cart Management** | Stateful cart operations (add, remove, review) maintained across messages. | Redis/In-Memory Cache, State Machine |
| 💳 **Checkout System** | Secure order placement and calculation logic right in the chat. | Transactional Database Updates |
| 📦 **Order Tracking** | Real-time lifecycle tracking (Pending → Confirmed → Preparing → Shipped → Delivered). | Event-Driven Architecture |
| 🔔 **Event Driven Notifications** | Automated WhatsApp alerts triggered by admin actions (e.g., "Order Dispatched"). | Event Bus, Webhooks |
| 📊 **Admin Dashboard** | Next.js powered portal to manage inventory, update orders, and view metrics. | REST APIs, SSR, Tailwind CSS |
| 📦 **Inventory Management** | Strict availability enforcement across all platform touchpoints (search, AI, cart). | Atomic DB Updates, Constraint Validation |

---

## 📸 Admin Dashboard Screenshots

<details>
<summary><b>Click to expand Admin Dashboard Previews</b></summary>
<br>

| **Admin Overview** | **Recommendation Analytics** |
|:---:|:---:|
| <img src="docs/images/screenshots/Admin%20Dashboard.png" alt="Admin Dashboard" width="400"/> | <img src="docs/images/screenshots/Recommendation%20Page.png" alt="Recommendation Analytics" width="400"/> |
| *Centralized control center for all platform operations.* | *Deep dive into recommendation metrics and AI effectiveness.* |

| **Order Management** | **Product Inventory** |
|:---:|:---:|
| <img src="docs/images/screenshots/Orders%20Page.png" alt="Orders Page" width="400"/> | <img src="docs/images/screenshots/Products%20Page.png" alt="Products Page" width="400"/> |
| *Real-time order tracking and status updates.* | *Strict inventory management and product CRUD operations.* |

| **Category Management** | **Business Analytics** |
|:---:|:---:|
| <img src="docs/images/screenshots/Categories%20Page.png" alt="Categories Page" width="400"/> | <img src="docs/images/screenshots/Analytics%20Page.png" alt="Analytics Page" width="400"/> |
| *Dynamic category organization for the conversational menu.* | *Overall business health, sales trends, and conversion rates.* |

</details>

---

## 🏗️ Architecture

The platform is designed around an **Event-Driven Monolith** architecture. WhatsApp is treated strictly as a dumb transport layer, while the core business logic resides entirely within our isolated services.

### 1. System Architecture
<img src="docs/images/Whatsapp%20Commerce%20Platform%20-%20System%20Architecture.png" alt="System Architecture" width="800"/>

> **Engineering Decision:** Decoupled the Commerce Engine from the WhatsApp integration. This ensures that the platform can easily be extended to support Telegram, Messenger, or webchat without rewriting core business logic.

### 2. Message Processing Lifecycle
*(Representation of the webhook validation, idempotency checks, and routing flow)*

> **Engineering Decision:** Implemented strict idempotency keys to prevent duplicate order creation or state corruption in the event of Meta Cloud API retries.

### 3. Conversation Engine State Machine
<img src="docs/images/Conversation%20Engine%20State%20Machine.png" alt="Conversation Engine State Machine" width="800"/>

> **Engineering Decision:** Used a Finite State Machine (FSM) instead of complex `if/else` trees to govern user sessions. This guarantees predictable routing (IDLE → BROWSING → CART → CHECKOUT) while allowing global interrupt commands (e.g., typing "menu" at any time).

### 4. End-to-End Customer Order Journey
<img src="docs/images/End-to-End%20Customer%20Order%20Journey.png" alt="End-to-End Customer Order Journey" width="800"/>

> **Engineering Decision:** Utilized a swimlane approach separating the Customer interaction, internal Commerce Engine, Database Persistence, and the async Event Bus.

---

## ⚙️ System Design

The backend is structured using Domain-Driven Design (DDD) principles:

- **Controller Layer:** Handles HTTP incoming requests, webhook signature validation, and payload formatting.
- **Service Layer:** Contains core business logic (e.g., `OrderService`, `AiShoppingService`). Strict separation of concerns ensures testability.
- **Repository Layer:** Abstracts all database access. Example: `ProductRepository.findAvailableProducts()` centralizes inventory checks.
- **Prisma Layer:** Type-safe ORM connecting to the Neon PostgreSQL instance.
- **Event Driven Design:** Services emit events (e.g., `ORDER_CREATED`) to an internal Event Bus, which triggers decoupled side effects like sending WhatsApp confirmation messages.
- **Conversation State Machine:** Manages state transitions, ensuring users cannot check out with an empty cart or add products while in a checkout state.

---

## 🧠 Recommendation Engine

<img src="docs/images/Personalized%20Recommendation%20Engine.png" alt="Personalized Recommendation Engine" width="800"/>

The recommendation system doesn't just suggest random popular items; it calculates a personalized score for returning users based on their historical data.

1. **Category Affinity (+20 pts):** Heavily weights items from the user's most frequently ordered categories.
2. **Budget Matching (+10 pts):** Matches items that fall within the user's historical average spend.
3. **Popularity Scoring (0-10 pts):** Blends in trending platform-wide items to encourage discovery.
4. **Explainability Layer:** Generates human-readable reasons (e.g., *"Because you love burgers"*, *"Trending this week"*) to build trust with the customer.

---

## 🛒 AI Shopping Assistant

The platform features an intelligent NLP pipeline capable of extracting structured intent from unstructured user text.

**Example Interaction:**
> **User:** *"I'm really hungry, I want a burger under ₹300"*

**System Extraction:**
```json
{
  "intent": "SEARCH_PRODUCT",
  "category": "Burgers",
  "budget": 300
}
```
**Result:** The system queries the database for available burgers under ₹300 and returns a beautifully formatted WhatsApp interactive message with options to add directly to cart.

---

## 📦 Order Lifecycle

<img src="docs/images/Order%20Lifecycle%20State%20Machine.png" alt="Order Lifecycle State Machine" width="800"/>

Orders flow through a strict state machine, governed by the Admin Dashboard and the Event Bus:

1. **PENDING:** Order created, awaiting admin review.
2. **CONFIRMED:** Admin accepts. Event Bus triggers WhatsApp notification.
3. **PREPARING:** Kitchen begins work.
4. **SHIPPED:** Handed to delivery driver.
5. **DELIVERED:** Completed.
6. **CANCELLED:** Graceful failure path with user notification.

---

## 🗄️ Database Design

<img src="docs/images/Database%20Entity%20Relationship%20Diagram.png" alt="Database Entity Relationship Diagram" width="800"/>

- **User:** Primary customer record tied to a unique `phoneNumber`.
- **ConversationSession:** 1:1 mapped to User. Stores active FSM state and JSON cart context.
- **Category & Product:** 1:N catalog architecture. `Product` contains critical `isActive` flags for inventory.
- **Order & OrderItem:** 1:N relationship. `OrderItem` locks in historical prices to prevent retroactive total changes if product prices update.
- **OrderStatusHistory:** Append-only audit log tracking exactly when an order transitioned states.

---

## 🔒 Security

- **Admin API Key Authentication:** All backend admin routes are protected via strict `x-api-key` middleware.
- **Webhook Security:** Webhook payloads from Meta are validated to ensure they originate from legitimate WhatsApp servers.
- **Inventory Validation:** Double-check validation at the cart level and right before Prisma transaction execution to prevent race conditions on out-of-stock items.
- **Environment Configuration:** Secure secret management for Neon DB URIs, Meta Access Tokens, and internal API keys.

---

## 🚀 Future Roadmap

- [ ] **Voice Ordering:** Processing WhatsApp voice notes using Whisper API.
- [ ] **LLM Powered Assistant:** Upgrading the current NLP intent extractor to a full LLM (e.g., OpenAI/Gemini) for highly conversational interactions.
- [ ] **Payment Gateway Integration:** Integrating Stripe/Razorpay for in-chat payment links.
- [ ] **Predictive Reordering:** Proactively messaging users when they are "due" for their regular order.
- [ ] **Multi-Vendor Marketplace:** Extending the schema to support multiple restaurants/stores on the same number.

---

## 💡 Lessons Learned

- **WhatsApp Integration Limits:** Designing around WhatsApp's interactive message limitations (e.g., max 3 buttons, max 10 list items) forced creative UX decisions, like utilizing pagination and intelligent state routing.
- **State Machines are Lifesavers:** Moving from conditional `if/else` logic to a strict Finite State Machine eliminated weird edge cases where users could trigger actions out of order.
- **Event Driven Architecture:** Decoupling side effects (like sending a message) from the core transaction (like creating an order) dramatically improved system reliability and API response times.
- **Inventory Race Conditions:** Realized that validating stock when adding to the cart isn't enough; you must validate *again* immediately prior to database commit.

---

## 🎓 Internship Highlights / Concepts Demonstrated

This project serves as a comprehensive demonstration of production-ready software engineering:

- **Backend Engineering:** Built a robust Node/Express/TypeScript backend utilizing the Controller-Service-Repository pattern.
- **System Design:** Architected an Event-Driven Monolith capable of handling asynchronous messaging and side-effects.
- **Database Design:** Designed a fully normalized relational schema using PostgreSQL, managing transactional integrity with Prisma.
- **State Management:** Implemented a complex backend-driven Finite State Machine for user session control.
- **Full Stack Development:** Bridged the gap between a headless WhatsApp interface and a rich Next.js/Tailwind admin dashboard.
- **API Integrations:** Deep integration with the Meta WhatsApp Cloud API webhooks and messaging endpoints.
- **Recommendation Systems:** Built a weighted scoring engine utilizing historical user data.

---

## 📊 Project Metrics

- **20+ REST API Endpoints** powering the backend and dashboard.
- **8 Comprehensive Architecture Diagrams** mapping system behavior.
- **Weighted Recommendation Engine** with Explainability Layer.
- **AI Shopping Assistant** with intent extraction.
- **Full Next.js Admin Dashboard** with Server-Side Rendering.
- **Event Bus System** for decoupled notifications.
- **PostgreSQL Database** managed via Prisma ORM.
- **Complete WhatsApp Cloud API Integration.**

---

## ⚡ Quick Start

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/whatsapp-commerce-platform.git
   cd whatsapp-commerce-platform
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd admin-dashboard
   npm install
   ```

### Environment Setup

Create a `.env` file in the root directory:
```env
DATABASE_URL="postgres://user:pass@host/db"
WHATSAPP_TOKEN="your_meta_access_token"
WHATSAPP_PHONE_NUMBER_ID="your_phone_id"
WEBHOOK_VERIFY_TOKEN="your_secure_verify_token"
ADMIN_API_KEY="your_secure_admin_key"
```

### Database Setup

Run Prisma migrations to initialize the Neon PostgreSQL database:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### Run Application

Start the backend server (runs on port 3000):
```bash
npm run dev
```

Start Ngrok for webhooks (in a new terminal):
```bash
ngrok http 3000
```
*Configure this Ngrok URL in your Meta Developer Dashboard.*

Start the Admin Dashboard (runs on port 3001):
```bash
cd admin-dashboard
npm run dev
```

---

## 👨‍💻 Author

**Built with passion by a full-stack engineer focused on building scalable, event-driven systems and beautiful user experiences.**

- 💼 **LinkedIn:** [Your LinkedIn](https://linkedin.com/in/yourprofile)
- 🐙 **GitHub:** [Your GitHub](https://github.com/yourusername)
- 🌐 **Portfolio:** [Your Website](https://yourwebsite.com)

*If you found this project interesting, feel free to star the repository or reach out for a chat about system design and backend architecture!*
