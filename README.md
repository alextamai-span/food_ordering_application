# Food Ordering Application

A full-stack food ordering system built with **React**, **Fastify**, **TypeScript**, and **PostgreSQL**. Supports two user roles — **Guest** and **Employee** — with JWT authentication, role-based routing, menu management, a shopping cart, and order tracking.

> See [`backend/README.md`](backend/README.md) and [`frontend/README.md`](frontend/README.md) for detailed per-layer documentation.

---

## Tech Stack

| | Frontend | Backend |
|---|---|---|
| Language | TypeScript 5 | TypeScript 5 (Node.js + `tsx`) |
| Framework | React 19 + Vite 7 | Fastify 5 |
| State | Redux Toolkit + React-Redux | — |
| Routing | React Router DOM 7 | — |
| Database | — | PostgreSQL (raw SQL via `@fastify/postgres`) |
| Auth | JWT stored in Redux | `@fastify/jwt` — 15 min TTL |
| Password | — | bcrypt (10 salt rounds) |
| API Docs | — | Swagger / OpenAPI at `/documentation` |
| Notifications | React Toastify | — |

---

## Getting Started

### Prerequisites
- Node.js
- PostgreSQL running locally

### Run the backend

```bash
cd backend
npm install
npm run dev        # watch mode
# or
npm start          # production
```

Server: **http://localhost:5000**
API docs: **http://localhost:5000/documentation**

### Run the frontend

```bash
cd frontend
npm install
npm run dev
```

App: **http://localhost:5173**

---

## Project Structure

```
food_ordering_application/
├── backend/
│   ├── config/         # Fastify setup, env vars, JWT type declarations
│   ├── controllers/    # HTTP request/response handlers
│   ├── services/       # Business logic
│   ├── repository/     # Data access layer (SQL queries)
│   ├── db/             # Raw parameterised SQL strings
│   ├── models/         # TypeScript interfaces
│   ├── routes/         # Route definitions with schema validation
│   ├── middleware/      # JWT authentication preHandler
│   ├── utils/          # Shared utilities (password hashing)
│   └── server.ts       # Entry point
└── frontend/
    └── src/
        ├── pages/      # Full-page route components
        ├── components/ # Reusable modal/popup components
        ├── services/   # API call functions (one file per feature)
        ├── hooks/      # Form validation + auth hooks
        ├── contexts/   # Redux store and auth slice
        └── types/      # TypeScript interfaces
```

---

## Database Schema

Four tables are created automatically on startup:

| Table | Key Columns |
|---|---|
| `users` | `id`, `name`, `email`, `password`, `account_type` (`guest` \| `employee`), `created_at`, `is_deleted` |
| `menu_items` | `id`, `item_name`, `price`, `quantity`, `available`, `is_deleted` |
| `orders` | `id`, `user_id` (FK), `total_price`, `order_status`, `created_at`, `completed_at` |
| `cart_items` | `id`, `user_id` (FK), `menu_item_id` (FK), `quantity` — unique per `(user_id, menu_item_id)` |

Soft-delete is used on `users`, `menu_items`, and `orders` — records are flagged rather than removed.

---

## Authentication & JWT

1. A new user registers at `POST /register` — password is hashed with bcrypt before storage and a JWT is returned
2. An existing user logs in at `POST /login` — bcrypt compares the entered password against the stored hash; a JWT is returned on success
3. The frontend stores the token in Redux (`authSlice`) and includes it as `Authorization: Bearer <token>` on every subsequent request
4. The backend's `verifyJWT` middleware validates the token's signature and expiry (15 min) before processing any protected route
5. On failure the backend returns `401 Unauthorized`

---

## Role-Based Access

| Feature | Guest | Employee |
|---|---|---|
| View available menu items | Yes | Yes |
| Add / edit / delete menu items | No | Yes |
| Add items to cart | Yes | No |
| Place orders | Yes | Yes |
| View own orders | Yes | — |
| View & manage all orders | No | Yes |
| Manage account | Yes | Yes |

After login, users are automatically routed to `/guest/menu` or `/emp/menu` based on their `account_type`.

---

## API Endpoints (summary)

All routes except `/register` and `/login` require `Authorization: Bearer <token>`.

| Group | Method | Path |
|---|---|---|
| Auth | `POST` | `/register`, `/login` |
| Account | `GET PUT` | `/account/get_account/:id`, `/account/update_account/:id`, `/account/delete_account/:id` |
| Guest Menu | `GET` | `/guest/menu/list` |
| Emp Menu | `GET POST PUT DELETE` | `/emp/menu/list`, `/emp/menu/add_item`, `/emp/menu/update_item/:id`, `/emp/menu/delete_item/:id` |
| Guest Orders | `POST GET` | `/guest/order/new_order/:userId`, `/guest/order/list/:userId` |
| Emp Orders | `POST GET PUT DELETE` | `/emp/order/new_order`, `/emp/order/list`, `/emp/order/update_order/:id`, `/emp/order/delete_order/:id` |
| Cart | `POST GET PUT DELETE` | `/cart/add_item`, `/cart/list`, `/cart/update_quantity/:id`, `/cart/remove_item/:id`, `/cart/clear`, `/cart/after_checkout_menu` |

---

## Checkout Flow

1. User adds items to cart
2. On checkout, `POST /guest/order/new_order/:userId` creates the order with total price
3. `PUT /cart/after_checkout_menu` decrements inventory for each ordered item
4. `DELETE /cart/clear` empties the cart
5. User is redirected to `/guest/order` to view the confirmed order

---

## Frontend Validation

Validation runs client-side before any API call is made. Errors are shown only after the first submit attempt.

| Form | Rules |
|---|---|
| Register | Name (letters/hyphens/apostrophes); valid email; password requires uppercase, lowercase, digit, and special character |
| Login | Valid email format; password ≥ 8 characters |
| Account edit | Name and email format; account type required |
| Add / edit menu item | Item name required; price > 0; quantity ≥ 0; availability required |

---

## Backend Architecture

Requests flow through a strict layered pattern:

```
Route → Controller → Service → Repository → DB (raw SQL)
```

Each layer has a single responsibility: routes define schema and security, controllers handle HTTP, services contain business logic, repositories run queries, and the DB layer holds the SQL strings.

