# Food Ordering Application — Frontend

A React + TypeScript single-page application for the food ordering system. Supports two roles: **Guest** (browse menu, manage cart, place orders) and **Employee** (manage menu items and orders).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript 5 |
| Build Tool | Vite 7 |
| State Management | Redux Toolkit + React-Redux |
| Routing | React Router DOM 7 |
| Notifications | React Toastify |
| API | Native Fetch API |
| Backend URL | `http://localhost:5000` |

---

## Getting Started

```bash
npm install
npm run dev
```

App runs on **http://localhost:5173**

---

## Project Structure

```
src/
├── pages/          # Full-page route components
├── components/     # Reusable modal/popup components
├── services/       # API call functions (one file per feature)
├── hooks/          # Custom hooks: form validation + auth
├── contexts/       # Redux store and auth slice
└── types/          # TypeScript interfaces
```

---

## Pages & Routing

| Route | Page | Access |
|---|---|---|
| `/` | → redirect to `/register` | — |
| `/register` | Account registration | Public |
| `/login` | Login | Public |
| `/guest/menu` | Browse available menu items, add to cart | Guest / Employee |
| `/cart` | View cart, update quantities, checkout | Guest |
| `/guest/order` | View own order history | Guest |
| `/emp/menu` | Manage all menu items (add / edit / delete) | Employee |
| `/emp/order` | View and manage all orders | Employee |

**Route protection:** All pages except `/register` and `/login` check for a JWT token on mount and redirect to `/login` if missing.

**Role-based redirect after login:**
- Employee → `/emp/menu`
- Guest → `/guest/menu`

---

## Components (Modals)

| Component | Purpose |
|---|---|
| `accountPopUp` | View/edit account details, delete account, logout |
| `addMenuItem` | Form to add a new menu item |
| `editMenuItems` | Pre-populated form to edit an existing menu item |
| `editOrder` | Update order status and completion timestamp |

All modals follow the same pattern: `modal-overlay` wrapper, click-outside-to-close, `e.stopPropagation()` inside the modal body.

---

## Services & API Calls

### `accountService`
| Function | Method | Endpoint |
|---|---|---|
| `saveNewAccount()` | `POST` | `/register` |
| `validateLogin()` | `POST` | `/login` |
| `editAccountService()` | `PUT` | `/account/update_account/:id` |
| `deleteAccountService()` | `PUT` | `/account/delete_account/:id` |

### `empService`
| Function | Method | Endpoint |
|---|---|---|
| `fetchEmpMenu()` | `GET` | `/emp/menu/list` |
| `addItemToMenu()` | `POST` | `/emp/menu/add_item` |
| `editItemInMenu()` | `PUT` | `/emp/menu/update_item/:id` |
| `deleteItem()` | `DELETE` | `/emp/menu/delete_item/:id` |

### `guestService`
| Function | Method | Endpoint |
|---|---|---|
| `fetchGuestMenu()` | `GET` | `/guest/menu/list` |

### `cartService`
| Function | Method | Endpoint |
|---|---|---|
| `fetchGuestCart()` | `GET` | `/cart/list` |
| `addItemToCart()` | `POST` | `/cart/add_item` |
| `updateCartItemQty()` | `PUT` | `/cart/update_quantity/:id` |
| `removeCartItem()` | `DELETE` | `/cart/remove_item/:id` |
| `clearCart()` | `DELETE` | `/cart/clear` |
| `afterCheckoutMenu()` | `PUT` | `/cart/after_checkout_menu` |

### `orderService`
| Function | Method | Endpoint |
|---|---|---|
| `placeGuestOrder()` | `POST` | `/guest/order/new_order/:userId` |
| `fetchUserOrders()` | `GET` | `/guest/order/list/:userId` |
| `fetchAllOrders()` | `GET` | `/emp/order/list` |
| `editOrderDetails()` | `PUT` | `/emp/order/update_order/:id` |
| `deleteOrder()` | `DELETE` | `/emp/order/delete_order/:id` |

---

## State Management

A single Redux slice (`authSlice`) handles authentication state:

```ts
{
  token: string        // JWT token (Bearer)
  id: number           // Logged-in user ID
  account_type: string // 'employee' | 'guest'
  success: boolean     // Login status flag
}
```

**Actions:** `setAuth` (on login/register) · `logout` (clears state)

**Note:** State is in-memory only — it is lost on page refresh (no `localStorage` persistence).

The `useAuth` hook wraps `useSelector` / `useDispatch` for use in pages and components.

---

## Validation Hooks

| Hook | Used On | Rules |
|---|---|---|
| `useLoginValidation` | Login page | Email format; password ≥ 8 chars |
| `useRegisterValidation` | Register page | Name (letters/hyphens/apostrophes); password requires uppercase, lowercase, digit, and special character |
| `useAccountValidation` | Account popup | Same as register minus password |
| `addItemValidator` | Add/edit menu item modals | Price > 0; quantity ≥ 0; availability required |

All validators return an errors object; errors display only after the first submit attempt (`hasSubmitted` flag).

---

## Checkout Flow

1. User adds items to cart (`/cart`)
2. On checkout, `placeGuestOrder()` creates the order
3. `afterCheckoutMenu()` is called for each cart item to decrement menu stock
4. `clearCart()` empties the cart
5. User is redirected to `/guest/order` to see the order

---

## TypeScript Types

| File | Types |
|---|---|
| `accountTypes.tsx` | `AccountFormData`, `ServiceResponse` |
| `cartTypes.tsx` | `CartItem` |
| `menuItemTypes.tsx` | `ItemTypes`, `ItemErrors` |
| `orderTypes.tsx` | `OrderTypes`, `OrderErrors` |
