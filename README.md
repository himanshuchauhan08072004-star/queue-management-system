# QueueFlow — Queue Management System

A full-stack Queue Management System built for a Queue Manager to create service
queues, add walk-in customers, serve them in order, and track performance with
live analytics.

**Stack:** React 19 + Vite + TypeScript + Tailwind CSS (frontend) · Node.js +
Express + TypeScript (backend) · PostgreSQL + Prisma ORM (database) · JWT auth.

---

## 1. Project structure

```
queue-management-system/
├── backend/                 Express + TypeScript API
│   ├── prisma/
│   │   ├── schema.prisma    Database schema (User, Queue, Token)
│   │   └── seed.ts          Creates the Queue Manager login account
│   ├── src/
│   │   ├── config/          Environment variable validation
│   │   ├── controllers/     Route handlers (business logic)
│   │   ├── middleware/      JWT auth guard + centralised error handler
│   │   ├── routes/          Express routers
│   │   ├── services/        Shared Prisma client
│   │   ├── utils/           JWT helpers, ApiError, asyncHandler
│   │   ├── validators/      Zod schemas
│   │   └── index.ts         App entry point
│   ├── Dockerfile
│   ├── render.yaml           Render deployment blueprint
│   └── .env.example
├── frontend/                 React + Vite + TypeScript SPA
│   ├── src/
│   │   ├── api/              Axios instance + typed API calls
│   │   ├── components/       layout / ui / queue / token / charts
│   │   ├── context/          AuthContext
│   │   ├── hooks/             TanStack Query hooks
│   │   ├── pages/             Login, Dashboard, Queues, QueueDetail, Analytics, 404
│   │   ├── routes/            AppRoutes + ProtectedRoute
│   │   └── types/             Shared TypeScript interfaces
│   ├── vercel.json            SPA rewrite rule for Vercel
│   └── .env.example
├── docker-compose.yml         Optional local Postgres + backend
└── README.md
```

## 2. Features implemented

- **Auth** — single Queue Manager account, JWT, bcrypt password hashing, protected routes, logout.
- **Dashboard** — total queues, active queues, waiting/completed/cancelled tokens, average waiting time, today's served customers, all in animated stat cards.
- **Queue management** — create, rename, activate/deactivate, delete, search, select.
- **Add token** — customer name, optional mobile + notes, auto-generated token number (`A-001`, `A-002`, ...).
- **Queue display** — waiting tokens with position, live waiting time, status badge.
- **Reorder** — Up/Down buttons, instant re-ordering (drag-and-drop was intentionally skipped in favor of accessible, keyboard-friendly buttons — easy to defend in an interview as a deliberate accessibility trade-off).
- **Serve Next** — completes the first waiting token, stores started/completed time, next token moves to the top automatically.
- **Cancel token** — confirmation modal before cancelling.
- **Analytics** — bar chart (queue length), pie chart (status distribution), line chart (served per hour), plus completion rate and peak queue hour.
- **Extras** — global search on queues, CSV export, recent-history table with tabs, dark/light mode, real-time clock, responsive sidebar, loading skeletons, toasts, empty states, 404 page.

## 3. Prerequisites

- Node.js 20+
- A PostgreSQL database (Supabase recommended, or the included `docker-compose.yml` for local Postgres)

## 4. Backend setup

```bash
cd backend
cp .env.example .env      # then fill in DATABASE_URL and JWT_SECRET
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed        # creates the Queue Manager login
npm run dev                # starts on http://localhost:4000
```

Default seeded login (override via `.env` before seeding):

```
email:    manager@queueflow.com
password: ChangeMe123!
```

> Change this password immediately in a real deployment — it's a seed default, not a hardcoded secret in the app itself.

## 5. Frontend setup

```bash
cd frontend
cp .env.example .env       # VITE_API_URL should point at the backend
npm install
npm run dev                 # starts on http://localhost:5173
```

Open `http://localhost:5173` and log in with the seeded credentials above.

## 6. API reference

All routes except `/auth/login` and `/health` require `Authorization: Bearer <token>`.

| Method | Route              | Description                          |
|--------|--------------------|--------------------------------------|
| POST   | /auth/login        | Log in, returns JWT + user           |
| GET    | /auth/me           | Current user profile                 |
| GET    | /queues            | List all queues                      |
| POST   | /queues            | Create a queue                       |
| PUT    | /queues/:id        | Update name/status                   |
| DELETE | /queues/:id        | Delete a queue                       |
| GET    | /tokens?queueId=   | List tokens (optionally by queue)    |
| POST   | /tokens            | Add a customer / create a token      |
| PATCH  | /tokens/reorder    | Move a token up/down                 |
| PATCH  | /tokens/serve      | Serve (complete) the next token      |
| PATCH  | /tokens/cancel     | Cancel a waiting token                |
| GET    | /analytics         | Dashboard + chart data, computed live |

## 7. Database schema (Prisma)

- **User** — id, name, email (unique), password (hashed), timestamps.
- **Queue** — id, name (unique), status (`ACTIVE` / `INACTIVE`), timestamps.
- **Token** — id, queueId, tokenNumber, customerName, mobile?, notes?, status
  (`WAITING` / `SERVING` / `COMPLETED` / `CANCELLED`), position, createdAt,
  startedAt?, completedAt?, cancelledAt?.

Waiting time and all dashboard/analytics numbers are **computed dynamically**
from these timestamps — nothing is pre-aggregated or stored redundantly.

## 8. Deployment

- **Frontend → Vercel**: import the `frontend/` folder as the project root,
  build command `npm run build`, output directory `dist`. Set
  `VITE_API_URL` to your deployed backend URL in Vercel's environment
  variables. `vercel.json` already handles SPA routing.
- **Backend → Render**: import the `backend/` folder, Render will pick up
  `render.yaml` automatically (Blueprint deploy), or configure manually with
  build command `npm install && npx prisma generate && npm run build` and
  start command `npx prisma migrate deploy && npm run start`. Set
  `DATABASE_URL`, `JWT_SECRET`, and `CLIENT_ORIGIN` (your Vercel URL) in the
  dashboard.
- **Database → Supabase**: create a project, copy the connection string
  (use the pooled "Transaction" connection string for serverless-friendly
  deploys) into `DATABASE_URL`.

## 9. Notes for your interview

- Token numbers (`A-001`, `A-002`...) are generated per-queue from a running
  count of tokens ever created in that queue, so numbering stays sequential
  even after cancellations.
- Reordering swaps the `position` integer between two adjacent waiting
  tokens inside a transaction — this keeps the operation atomic and avoids
  renumbering the whole queue on every move.
- "Serve Next" always operates on the lowest `position` among `WAITING`
  tokens for that queue — this is enforced server-side, not just in the UI,
  so the API can't be tricked into serving out of order.
- All validation (queue names, customer names, email/password, duplicate
  queue names) is done with Zod on both the frontend (instant feedback) and
  backend (source of truth).
