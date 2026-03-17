# Food Ordering Application — Backend

A REST API built with **Fastify** and **TypeScript**, backed by **PostgreSQL**. Supports two user roles (guest and employee) with JWT authentication, menu management, a shopping cart, and order tracking.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js + TypeScript (`tsx`) |
| Framework | Fastify 5 |
| Database | PostgreSQL (raw SQL via `@fastify/postgres`) |
| Authentication | JWT (`@fastify/jwt`) — 15 min TTL |
| Password Security | bcrypt (10 salt rounds) |
| API Docs | Swagger / OpenAPI (`/documentation`) |
| CORS | `@fastify/cors` |

---

## Project Structure

```
backend/
├── config/             # Fastify instance setup, env vars, JWT type declarations
├── controllers/        # HTTP request/response handlers
├── services/           # Business logic
├── repository/         # Data access layer (runs SQL queries)
├── db/                 # Raw SQL query strings
├── models/             # TypeScript interfaces for data shapes
├── routes/             # Route definitions with schema validation
├── middleware/         # JWT authentication preHandler
├── utils/              # Shared utilities (password hashing)
└── server.ts           # Entry point — registers all routes and starts server
```

---

## Getting Started

### Prerequisites
- Node.js
- PostgreSQL running locally

### Install & Run

```bash
npm install

# Development (watch mode)
npm run dev

# Production
npm start
```

Server starts on **http://localhost:5000**
API docs available at **http://localhost:5000/documentation**

### Environment

Configured in `config/env.ts`:

| Variable | Value |
|---|---|
| `PORT` | `5000` |
| `DATABASE_URL` | `postgres://postgres:<password>@localhost:4194/food_ordering` |
| `JWT_SECRET` | `alex-span-secret-key` |
| `FRONTEND_URL` | `http://localhost:5173` |

---

## Database Schema

Four tables are created automatically on startup (`db/tableQueries.ts`):

**`users`** — `id`, `name`, `email`, `password`, `account_type` (`guest` | `employee`), `created_at`, `is_deleted`

**`menu_items`** — `id`, `item_name`, `price`, `quantity`, `available`, `is_deleted`

**`orders`** — `id`, `user_id` (FK), `total_price`, `order_status`, `created_at`, `completed_at`

**`cart_items`** — `id`, `user_id` (FK), `menu_item_id` (FK), `quantity` — unique per `(user_id, menu_item_id)`

---

## API Endpoints

All protected routes require an `Authorization: Bearer <token>` header.

### Auth (unprotected)

| Method | Path | Description |
|---|---|---|
| `POST` | `/register` | Register a new user — returns JWT token |
| `POST` | `/login` | Login — returns JWT token |

**Register / Login request body:**
```json
{ "name": "...", "email": "...", "password": "...", "account_type": "guest | employee" }
```

---

### Account — `/account` (protected)

| Method | Path | Description |
|---|---|---|
| `GET` | `/account/get_account/:empId` | Get account details |
| `PUT` | `/account/update_account/:id` | Update name, email, or account type |
| `PUT` | `/account/delete_account/:id` | Soft-delete account |

---

### Guest Menu — `/guest/menu` (protected)

| Method | Path | Description |
|---|---|---|
| `GET` | `/guest/menu/list` | List available menu items (qty > 0, available = true) |

---

### Employee Menu — `/emp/menu` (protected)

| Method | Path | Description |
|---|---|---|
| `GET` | `/emp/menu/list` | List all menu items (full details) |
| `POST` | `/emp/menu/add_item` | Add a new menu item |
| `PUT` | `/emp/menu/update_item/:itemId` | Update a menu item |
| `DELETE` | `/emp/menu/delete_item/:itemId` | Soft-delete a menu item |

---

### Guest Orders — `/guest/order` (protected)

| Method | Path | Description |
|---|---|---|
| `POST` | `/guest/order/new_order/:userId` | Place a new order |
| `GET` | `/guest/order/list/:userId` | List the user's orders |

---

### Employee Orders — `/emp/order` (protected)

| Method | Path | Description |
|---|---|---|
| `POST` | `/emp/order/new_order` | Create an order |
| `GET` | `/emp/order/list` | List all orders |
| `PUT` | `/emp/order/update_order/:id` | Update order status |
| `DELETE` | `/emp/order/delete_order/:id` | Soft-delete an order |

---

### Cart — `/cart` (protected)

| Method | Path | Description |
|---|---|---|
| `POST` | `/cart/add_item` | Add item to cart (quantity is additive) |
| `GET` | `/cart/list` | Get all cart items for the logged-in user |
| `PUT` | `/cart/update_quantity/:menuItemId` | Update quantity of a cart item |
| `DELETE` | `/cart/remove_item/:menuItemId` | Remove a specific item from cart |
| `DELETE` | `/cart/clear` | Clear the entire cart |
| `PUT` | `/cart/after_checkout_menu` | Decrement menu inventory after checkout |

---

## Architecture

Requests flow through a layered architecture:

```
Route → Controller → Service → Repository → DB (SQL)
```

- **Routes** — define the path, HTTP method, JSON schema, and security tags
- **Controllers** — extract request parameters and delegate to services
- **Services** — contain business logic and validation
- **Repositories** — execute SQL queries against PostgreSQL
- **DB** — stores the raw parameterised SQL strings
- **Middleware** — `verifyJWT` runs as a `preHandler` on every protected route

---

## Authentication Flow

1. Client calls `/register` or `/login` and receives a JWT
2. Token is included as `Authorization: Bearer <token>` on subsequent requests
3. `verifyJWT` middleware (`middleware/jwtAuth.ts`) verifies the signature and expiry
4. On success, `request.user` is populated with `{ id, email }` for the route handler to use
5. On failure, the server responds with `401 Unauthorized`
