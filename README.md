# 🍽️ Restaurant Application

A full-stack restaurant ordering system with a Django REST Framework backend and a React frontend — covering menu management, cart operations, transactional order placement, delivery crew assignment, and role-based access control across four user roles.

The backend focuses on clean permission boundaries, atomic state transitions, and price-snapshot order history. The frontend is a dark-themed SPA with JWT auth, automatic token refresh, and full API integration across menu browsing, cart, and order tracking.

> Python · Django · DRF · MySQL · Simple JWT · React · Vite · Tailwind CSS

![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-092E20?style=flat&logo=django&logoColor=white)
![DRF](https://img.shields.io/badge/Django_REST_Framework-092E20?style=flat&logo=django&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

---

## 📋 Overview

| Area | Approach |
|---|---|
| 🔐 Authentication | JWT-based auth via Simple JWT — access + refresh tokens, token blacklist on logout |
| 🛡️ Authorisation | Role-based access — Admin, Manager, Delivery Crew, Customer |
| 🏗️ Backend | Domain-separated Django apps — Users, Menu, Cart, Orders |
| 🖥️ Frontend | React SPA with AuthContext, Axios interceptors, and Vite dev proxy |
| 👤 User Model | Custom `AbstractUser` with email as login identifier, no username field |
| 🛒 Cart | Per-user cart with deduplication, `select_for_update` locking, and server-side totals |
| 📦 Orders | Transactional cart-to-order conversion with price snapshots and auto crew assignment |

---

## 🏗️ System Design

### 🔐 Authentication

Authentication is handled through Simple JWT with token blacklist support. Users register via `/users/register/` (which returns a JWT pair immediately), obtain tokens via `/users/login/`, and include the access token in the `Authorization: Bearer <token>` header on subsequent requests. Logout blacklists the refresh token server-side. A custom user model extending `AbstractUser` replaces Django's default — email is the sole login identifier, username is removed entirely, and a custom `UserManager` handles `create_user` and `create_superuser`.

On the frontend, an Axios interceptor attaches the access token to every request. On a 401 response, the interceptor automatically attempts a token refresh using the stored refresh token — if successful, the original request is retried transparently; if the refresh fails, the user is redirected to login.

---

### 🛡️ Role-Based Access Control

Roles are implemented via a `group` CharField on the custom User model using `TextChoices`, not Django's built-in Group model. Four roles govern access:

- **Admin** — full system access via Django Admin
- **Manager** — menu CRUD, user listing, order visibility across all users, status updates, delivery crew assignment
- **Delivery Crew** — visibility limited to assigned orders, can only mark orders as delivered
- **Customer** (default) — menu browsing, cart management, order placement, own order visibility

Four custom DRF permission classes enforce access at the view level: `IsManager`, `IsDeliveryCrew`, `IsCustomer`, and `IsOwner` (object-level ownership check).

---

### 🛒 Cart & Order Flow

Cart entries deduplicate on `(cart, menu_item)` via a `UniqueConstraint` — adding the same item increments quantity and recalculates the line price rather than creating a duplicate row. All cart writes use `transaction.atomic()` with `select_for_update()` row locking. Cart totals are aggregated server-side via `Sum`.

Order creation is wrapped in a database transaction:

1. Cart is validated — empty cart raises an error
2. An `Order` record is created with the cart's total value
3. Each cart row is bulk-created as an `OrderItem` with a price snapshot
4. Cart is deleted after successful commit

`OrderItem` stores `menu_item`, `quantity`, and `price` as a snapshot — decoupled from live catalog data so historical order values remain consistent regardless of future menu price changes. `menu_item` uses `on_delete=PROTECT` to prevent deletion of menu items with existing order history.

---

### 🚚 Delivery & Status Management

Orders follow a five-state lifecycle: `PLACED → PREPARING → OUT FOR DELIVERY → DELIVERED → CANCELLED`.

When a manager sets status to "out for delivery", the system auto-assigns an available delivery crew member — one who is not currently handling another active delivery. Delivery crew can only update orders assigned to them, and only to mark them as `DELIVERED`.

---

### 🖥️ Frontend Architecture

The React frontend is a single-page application structured around an `AuthContext` provider that manages user state, login, register, and logout across the app. API communication runs through a centralized Axios instance with:

- **Request interceptor** — attaches the JWT access token from `localStorage` to every outgoing request
- **Response interceptor** — on 401 errors, silently attempts a token refresh and retries the original request; falls back to login redirect on failure
- **Vite dev proxy** — `/api` requests are proxied to `http://localhost:8000` with path rewrite, eliminating CORS during development

Six pages are fully wired to the backend API:

| Page | Functionality |
|---|---|
| Home | Landing page with heritage-themed visuals |
| Login | Email + password form, JWT pair stored on success |
| Register | Multi-field form with client-side validation, auto-login on success |
| Menu | Fetches categories and items, category filter tabs, add-to-cart with feedback |
| Cart | Displays cart items with quantity controls, item removal, order placement |
| Orders | Lists orders with status badges, expandable item breakdown per order |

---

### 🧱 Architecture

```text
Frontend:  React → Axios (JWT interceptor) → Vite Proxy → Django
Backend:   URLs → Views → Serializers → Models → MySQL
```

| Layer | Responsibility |
|---|---|
| React Pages | UI rendering, user interaction, API calls via Axios |
| AuthContext | JWT storage, login/register/logout, token decode for user state |
| Axios Instance | Centralized HTTP client with auth and refresh interceptors |
| Views | Request handling, permission enforcement, role-based response filtering |
| Serializers | Field validation, nested reads (menu item details in cart/order responses) |
| Models | Data structure, relationships, constraints, lifecycle choices |
| Permissions | Four custom DRF permission classes for role and ownership checks |
| Utils | Delivery crew availability logic |

---

## 🔑 Role & Permission Matrix

| Action | Admin | Manager | Delivery Crew | Customer |
|---|---|---|---|---|
| Browse menu | ✅ | ✅ | ✅ | ✅ |
| Create / update / delete menu items | ✅ | ✅ | ❌ | ❌ |
| List all users | ✅ | ✅ | ❌ | ❌ |
| View / update / delete own profile | ✅ | ✅ | ✅ | ✅ |
| Cart operations | — | — | — | ✅ |
| Place orders | — | — | — | ✅ |
| View all orders | ✅ | ✅ | ❌ | ❌ |
| View own / assigned orders | — | — | ✅ | ✅ |
| Update order status | ✅ | ✅ | 🔒 | ❌ |
| Assign delivery crew | ✅ | ✅ (auto) | ❌ | ❌ |
| Django Admin access | ✅ | ❌ | ❌ | ❌ |

🔒 = Delivery crew can only mark their own assigned orders as `DELIVERED`

---

## 📡 API Reference

### 🔐 Auth — `/users/`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/users/register/` | Register a new user, returns JWT pair |
| `POST` | `/users/login/` | Obtain access & refresh tokens |
| `POST` | `/users/token/refresh/` | Refresh an expired access token |
| `POST` | `/users/logout/` | Blacklist refresh token |
| `GET` | `/users/register/` | List all users (manager only) |
| `GET` | `/users/<user_id>/` | Retrieve user profile (owner or manager) |
| `PUT` | `/users/<user_id>/` | Update user profile (owner or manager) |
| `DELETE` | `/users/<user_id>/` | Delete user (owner or manager) |

### 🍴 Menu — `/menu/`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/menu/` | List all menu items |
| `POST` | `/menu/` | Create menu item(s) (manager only) |
| `GET` | `/menu/items/<item_id>/` | Retrieve a single menu item |
| `PUT` | `/menu/items/<item_id>/` | Update a menu item (manager only) |
| `DELETE` | `/menu/items/<item_id>/` | Delete a menu item (manager only) |
| `GET` | `/menu/categories/` | List all categories |
| `POST` | `/menu/categories/` | Create category (manager only) |
| `GET` | `/menu/categories/<category_id>` | Retrieve a single category |

### 🛒 Cart — `/cart/`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/cart/` | View current user's cart items |
| `POST` | `/cart/` | Add item to cart (deduplicates on menu_item) |
| `PUT` | `/cart/items/<item_id>` | Update cart item quantity |
| `DELETE` | `/cart/items/<item_id>` | Remove item from cart |

### 📦 Orders — `/orders/`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/orders/` | List orders (manager: all, others: own) |
| `POST` | `/orders/` | Place order from cart (transactional) |
| `GET` | `/orders/<order_id>/` | Retrieve order detail (owner or manager) |
| `PATCH` | `/orders/<order_id>/` | Update status / auto-assign crew |

---

## 🗃️ Data Models

### User

Custom model extending `AbstractUser` — email as login identifier, username removed, custom `UserManager`.

| Field | Type | Notes |
|---|---|---|
| email | CharField | Unique, `USERNAME_FIELD` |
| group | CharField | `TextChoices`: `ADMIN` · `MANAGER` · `DELIVERY CREW` · `CUSTOMER` |

### Category

| Field | Type |
|---|---|
| name | CharField |
| cuisine | CharField |

### Menu

| Field | Type | Notes |
|---|---|---|
| title | CharField | |
| image | ImageField | Optional, uploads to `menu/items/` |
| price | DecimalField | 8 digits, 2 decimal places |
| description | CharField | Max 450 chars |
| category | ForeignKey | Nullable → Category (`SET_NULL`) |

### Cart

| Field | Type | Notes |
|---|---|---|
| user | OneToOneField | One cart per user (`CASCADE`) |
| cart_value | DecimalField | Server-aggregated total |

### CartItem

| Field | Type | Notes |
|---|---|---|
| cart | ForeignKey | → Cart (`CASCADE`) |
| menu_item | ForeignKey | → Menu (`CASCADE`) |
| quantity | PositiveIntegerField | |
| price | DecimalField | Line price (quantity × unit price) |

`UniqueConstraint` on `(cart, menu_item)` prevents duplicate entries.

### Order

| Field | Type | Notes |
|---|---|---|
| user | ForeignKey | → User (`CASCADE`) |
| order_value | DecimalField | Snapshot of cart total at placement |
| delivery_crew | ForeignKey | Nullable → User (`SET_NULL`) |
| status | CharField | `TextChoices`: `PLACED` · `PREPARING` · `OUT FOR DELIVERY` · `DELIVERED` · `CANCELLED` |

### OrderItem

| Field | Type | Notes |
|---|---|---|
| order | ForeignKey | → Order (`CASCADE`) |
| menu_item | ForeignKey | → Menu (`PROTECT`) |
| quantity | PositiveIntegerField | |
| price | DecimalField | Price snapshot at order time |

---

## 📂 Project Structure

```text
backend/
├── core/              → Project config, root URLs, WSGI/ASGI
├── users/             → Custom User model + manager, JWT auth, permissions, admin config
├── menu/              → Category & Menu models, CRUD views
├── cart/              → Cart & CartItem models, atomic cart operations
└── orders/            → Order & OrderItem models, transactional placement, status management, crew utils

frontend/
├── src/
│   ├── api/axios.js   → Axios instance with auth + refresh interceptors
│   ├── context/       → AuthContext (JWT state, login, register, logout)
│   ├── components/    → Navbar (responsive + mobile), Footer
│   └── pages/         → Home, Login, Register, Menu, Cart, Orders
├── vite.config.js     → React + Tailwind plugins, /api → backend proxy
└── package.json       → React 19, Vite 8, Tailwind CSS 4, Axios, React Router 7
```

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Language | ![Python](https://img.shields.io/badge/Python_3.14-3776AB?style=flat&logo=python&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) |
| Backend | ![Django](https://img.shields.io/badge/Django_6.0-092E20?style=flat&logo=django&logoColor=white) ![DRF](https://img.shields.io/badge/DRF_3.17-092E20?style=flat&logo=django&logoColor=white) |
| Frontend | ![React](https://img.shields.io/badge/React_19-61DAFB?style=flat&logo=react&logoColor=black) ![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=flat&logo=vite&logoColor=white) ![Tailwind](https://img.shields.io/badge/Tailwind_4-06B6D4?style=flat&logo=tailwindcss&logoColor=white) |
| Auth | ![JWT](https://img.shields.io/badge/Simple_JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white) + Token Blacklist |
| Database | ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white) |
| HTTP Client | Axios with interceptors |
| Routing | React Router v7 |
| Config | python-decouple, django-cors-headers |

---

## 🚀 Running Locally

### Prerequisites

- 🐍 Python 3.14+
- 🐬 MySQL server
- 📦 Node.js 20+

### Backend Setup

**1. Clone and enter the backend directory**

```bash
git clone <repo-url>
cd RestaurantApp/backend
```

**2. Create and activate virtual environment**

```bash
python -m venv venv
source venv/bin/activate        # macOS/Linux
venv\Scripts\activate           # Windows
```

**3. Install dependencies**

```bash
pip install -r requirements.txt
```

**4. Create a `.env` file in the backend directory**

```env
SECRET_KEY=your_secret_key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

**5. Create the MySQL database**

```sql
CREATE DATABASE restaurant_db;
```

**6. Apply migrations and create superuser**

```bash
python manage.py migrate
python manage.py createsuperuser
```

**7. Start the backend**

```bash
python manage.py runserver
```

Backend runs at `http://localhost:8000` · Admin at `http://localhost:8000/admin/`

### Frontend Setup

**1. Enter the frontend directory**

```bash
cd ../frontend
```

**2. Install dependencies**

```bash
npm install
```

**3. Start the dev server**

```bash
npm run dev
```

Frontend runs at `http://localhost:5173` — API calls are proxied to the backend automatically.

---

## ✅ Implementation Highlights

**Backend**

- Custom email-only user model with `AbstractUser` and `UserManager`, replacing Django's default username-based auth
- JWT authentication with access/refresh tokens, token blacklist on logout via Simple JWT
- Four-tier role system on the user model with four custom DRF permission classes enforcing access at view level
- Per-user cart with `OneToOneField` binding, `UniqueConstraint` deduplication, `select_for_update` row locking, and server-side total aggregation
- Transactional order creation — cart-to-order conversion with `bulk_create`, price snapshots, and cart cleanup in a single atomic block
- `on_delete=PROTECT` on `OrderItem.menu_item` preventing deletion of menu items with order history
- Five-state order lifecycle with role-aware status transitions and auto delivery crew assignment
- Nested serializer reads — menu item details embedded in cart and order API responses

**Frontend**

- AuthContext provider managing JWT state, login, register, and logout across the SPA
- Axios interceptor chain — auto-attaches access token on requests, silently refreshes on 401, redirects on failure
- Vite dev proxy eliminating CORS during development (`/api` → `localhost:8000`)
- Menu page with category filter tabs and add-to-cart feedback
- Cart page with quantity editing, item removal, and one-click order placement
- Orders page with status-coloured badges and expandable item breakdown
- Responsive Navbar with mobile hamburger menu
- Dark heritage-themed visual design using Tailwind CSS utility classes

---

## 🔭 Future Development

- Table booking and reservation system
- Filtering, search, ordering, and pagination across menu and order endpoints
- Protected frontend routes — gate cart/orders behind auth
- Payment integration — Razorpay or Stripe
- Order cancellation logic with time-window constraints
- API test suite covering permissions, transactions, and edge cases

---

## 📝 Acknowledgements

Backend architecture, models, permissions, and API logic designed and built from scratch. Frontend UI scaffolded with [Claude](https://claude.ai) (Anthropic) and [v0](https://v0.dev) (Vercel), and manual backend API integration.