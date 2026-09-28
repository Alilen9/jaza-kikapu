# JAZA KIKAPU — SYSTEM ARCHITECTURE & TECHNICAL SPECIFICATION
**Digital Marketplace for Voi & Taita-Taveta Region**
*Slogan: Your Market. Your Businesses. Your Community.*

---

## 1. SYSTEM ARCHITECTURE

```
+-----------------------------------------------------------------------------------+
|                              CLIENT TIER (Next.js 16+)                            |
|  - App Router, Server Components, TanStack Query, React Hook Form + Zod           |
|  - Real-time WebSockets (Live Market, Messaging, Order Tracking)                  |
|  - Mobile-First PWA (Voi, Taveta, Wundanyi, Mwatate local caches)                 |
+------------------------------------------+----------------------------------------+
                                           | HTTPS / WSS
                                           v
+-----------------------------------------------------------------------------------+
|                        API GATEWAY / LOAD BALANCER (Nginx)                        |
+------------------------------------------+----------------------------------------+
                                           | Reverse Proxy
                                           v
+-----------------------------------------------------------------------------------+
|                        APPLICATION SERVER (Django 5.x + DRF)                      |
|  - ASGI Server (Daphne/Uvicorn) for HTTP & WebSockets (Django Channels)           |
|  - REST Framework APIs: Multi-Seller Orders, Split Stalls, Subscriptions, AI     |
|  - Safaricom Daraja M-Pesa STK Push Engine & Callback Handlers                    |
|  - Role-Based Access Control (RBAC) & Multi-tenant Stall Isolation                |
+-------------------+----------------------+-------------------+--------------------+
                    |                      |                   |
                    v                      v                   v
+-----------------------+  +-----------------------+  +-----------------------------+
|    POSTGRESQL 16+     |  |       REDIS 7+        |  |        CELERY WORKERS       |
| - Relational Storage  |  | - Channels Layer      |  | - M-Pesa Callback Verifier  |
| - GeoDjango (Location)|  | - Caching             |  | - SMS/WhatsApp Order Alerts |
| - ACID Multi-Order    |  | - Rate Limiting       |  | - Payout Settlements        |
+-----------------------+  +-----------------------+  +-----------------------------+
```

---

## 2. DATABASE SCHEMA (POSTGRESQL / DJANGO ORM)

```sql
-- Core Geographic Hierarchy
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    county VARCHAR(100) NOT NULL DEFAULT 'Taita-Taveta',
    sub_county VARCHAR(100) NOT NULL, -- Voi, Wundanyi, Mwatate, Taveta
    town VARCHAR(100) NOT NULL,
    area VARCHAR(100) NOT NULL,
    market_name VARCHAR(150), -- e.g. Voi Main Market, Taveta Border Market
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users & Auth
CREATE TYPE user_role AS ENUM ('BUYER', 'SELLER', 'RIDER', 'BUSINESS_ADMIN', 'ADMIN', 'SUPER_ADMIN');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(20) UNIQUE NOT NULL, -- e.g. 254712345678
    email VARCHAR(255) UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    role user_role DEFAULT 'BUYER',
    avatar_url TEXT,
    is_phone_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Digital Stalls (Businesses / Sellers)
CREATE TYPE seller_status AS ENUM ('PENDING', 'VERIFIED', 'ACTIVE', 'SUSPENDED', 'REJECTED');

CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    logo_url TEXT,
    cover_url TEXT,
    location_id UUID REFERENCES locations(id),
    physical_stall_number VARCHAR(50),
    is_open BOOLEAN DEFAULT TRUE,
    status seller_status DEFAULT 'PENDING',
    jaza_score DECIMAL(3, 2) DEFAULT 5.0,
    orders_completed INT DEFAULT 0,
    response_rate INT DEFAULT 95, -- percentage
    followers_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscription Plans & Active Subscriptions
CREATE TYPE subscription_cadence AS ENUM ('HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');

CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    cadence subscription_cadence NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    product_limit INT NOT NULL,
    can_live_stream BOOLEAN DEFAULT FALSE,
    can_view_analytics BOOLEAN DEFAULT FALSE,
    featured_placement BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE store_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id),
    plan_id UUID NOT NULL REFERENCES subscription_plans(id),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    mpesa_reference VARCHAR(100)
);

-- Product Catalog & Inventory
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon_name VARCHAR(50),
    display_order INT DEFAULT 0
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    compare_at_price DECIMAL(10, 2),
    stock_quantity INT NOT NULL DEFAULT 1,
    unit VARCHAR(50) DEFAULT 'piece', -- kg, piece, bunch, litre
    images JSONB NOT NULL DEFAULT '[]',
    is_available BOOLEAN DEFAULT TRUE,
    is_taita_taveta_local BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Multi-Seller Kikapu (Cart)
CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_key VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Multi-Seller Orders: Parent Order + Split Seller Orders
CREATE TYPE order_status AS ENUM (
    'PENDING', 'PAYMENT_PENDING', 'PAID', 'SELLER_CONFIRMED',
    'PREPARING', 'READY_FOR_PICKUP', 'RIDER_ASSIGNED',
    'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'REFUNDED'
);

CREATE TABLE parent_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    buyer_id UUID NOT NULL REFERENCES users(id),
    total_amount DECIMAL(10, 2) NOT NULL,
    delivery_fee DECIMAL(10, 2) NOT NULL,
    platform_fee DECIMAL(10, 2) NOT NULL,
    status order_status DEFAULT 'PENDING',
    delivery_address TEXT NOT NULL,
    delivery_phone VARCHAR(20) NOT NULL,
    delivery_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE seller_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_order_id UUID NOT NULL REFERENCES parent_orders(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES stores(id),
    subtotal DECIMAL(10, 2) NOT NULL,
    seller_delivery_portion DECIMAL(10, 2) NOT NULL,
    commission_amount DECIMAL(10, 2) NOT NULL,
    seller_earnings DECIMAL(10, 2) NOT NULL,
    status order_status DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_order_id UUID NOT NULL REFERENCES seller_orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL
);

-- Safaricom Daraja M-Pesa Payments
CREATE TYPE payment_status AS ENUM ('INITIATED', 'PENDING', 'SUCCESS', 'FAILED', 'CANCELLED', 'REFUNDED');

CREATE TABLE mpesa_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_order_id UUID NOT NULL REFERENCES parent_orders(id),
    phone_number VARCHAR(20) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    merchant_request_id VARCHAR(100) NOT NULL,
    checkout_request_id VARCHAR(100) NOT NULL,
    mpesa_receipt_number VARCHAR(50),
    status payment_status DEFAULT 'INITIATED',
    result_code INT,
    result_desc TEXT,
    transaction_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rider & Delivery System
CREATE TYPE rider_delivery_status AS ENUM (
    'PENDING', 'ASSIGNED', 'ACCEPTED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'FAILED', 'CANCELLED'
);

CREATE TABLE riders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vehicle_type VARCHAR(50) NOT NULL, -- Boda Boda, Tuk-Tuk, Matatu, Bicycle
    license_plate VARCHAR(50) NOT NULL,
    national_id_number VARCHAR(50) NOT NULL,
    is_online BOOLEAN DEFAULT FALSE,
    current_market_zone VARCHAR(100) DEFAULT 'Voi Central',
    total_deliveries INT DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 5.0
);

CREATE TABLE deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_order_id UUID NOT NULL REFERENCES parent_orders(id),
    rider_id UUID REFERENCES riders(id),
    pickup_locations JSONB NOT NULL, -- list of stall coordinates/names
    dropoff_location TEXT NOT NULL,
    status rider_delivery_status DEFAULT 'PENDING',
    delivery_fee DECIMAL(10, 2) NOT NULL,
    rider_earnings DECIMAL(10, 2) NOT NULL,
    accepted_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE
);

-- Live Market Streaming & Interactive Social Commerce
CREATE TABLE live_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_live BOOLEAN DEFAULT TRUE,
    viewer_count INT DEFAULT 0,
    stream_url TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE live_pinned_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    live_session_id UUID NOT NULL REFERENCES live_sessions(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    pinned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE live_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    live_session_id UUID NOT NULL REFERENCES live_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    message TEXT NOT NULL,
    is_question BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Request A Product & Show Me
CREATE TABLE product_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    target_market VARCHAR(100) DEFAULT 'Voi',
    max_budget DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'OPEN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE product_request_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES product_requests(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES stores(id),
    offered_product_id UUID REFERENCES products(id),
    seller_message TEXT NOT NULL,
    offered_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE show_me_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID NOT NULL REFERENCES users(id),
    store_id UUID NOT NULL REFERENCES stores(id),
    product_id UUID NOT NULL REFERENCES products(id),
    question TEXT NOT NULL,
    response_media_url TEXT,
    response_text TEXT,
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 3. ROLE & PERMISSIONS MATRIX

| Feature / Resource | BUYER | SELLER | RIDER | BUSINESS_ADMIN | ADMIN | SUPER_ADMIN |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Browse Market & Search | Yes | Yes | Yes | Yes | Yes | Yes |
| Fill Kikapu & Checkout | Yes | Yes | Yes | Yes | Yes | Yes |
| M-Pesa STK Payment | Yes | Yes | Yes | Yes | Yes | Yes |
| Watch Live Stream & Chat | Yes | Yes | Yes | Yes | Yes | Yes |
| Post Product Request | Yes | No | No | No | Yes | Yes |
| Respond "I HAVE IT" | No | Own Stall | No | Own Stall | Yes | Yes |
| "Show Me" Request / Reply | Request | Reply Own | No | Reply Own | Full | Full |
| Broadcast Live Stream | No | Subscribed | No | Subscribed | Full | Full |
| Manage Stall Catalog/Stock | No | Own Stall | No | Own Stall | Full | Full |
| View Split Orders | Own Parent | Own Stall | Assigned | Own Stall | Full | Full |
| Accept / Fulfil Delivery | No | No | Yes | No | Full | Full |
| Request Payout | No | Own Wallet | Own Wallet | Own Wallet | Approve | Full |
| Manage Subscription Plans | No | Subscribe | No | Subscribe | Edit/Create | Full |
| Approve / Suspend Sellers | No | No | No | No | Yes | Full |
| View Platform Analytics | No | Own Stall | Own Stats | Own Stall | Platform | Full |

---

## 4. API SPECIFICATION (DJANGO REST FRAMEWORK)

### Auth & Profiles
- `POST /api/v1/auth/register/` -> `{ phone_number, full_name, role }`
- `POST /api/v1/auth/login/` -> `{ phone_number, otp_code }`
- `GET /api/v1/auth/me/` -> Current user profile & active role

### Marketplace & Digital Stalls
- `GET /api/v1/locations/` -> Location hierarchy (County, Sub-county, Town, Market)
- `GET /api/v1/stores/` -> Filter by location, open status, category, verified
- `GET /api/v1/stores/{slug}/` -> Digital stall details, cover, score breakdown, catalog
- `GET /api/v1/products/` -> Filter by store, category, location, min/max price, in_stock

### Multi-Seller Kikapu & Checkout
- `GET /api/v1/kikapu/` -> Multi-seller grouped cart items & subtotals
- `POST /api/v1/kikapu/add/` -> `{ product_id, quantity }`
- `POST /api/v1/kikapu/checkout/` -> Creates Parent Order & splits into Seller Orders
- `POST /api/v1/payments/mpesa/stk-push/` -> Initiates Daraja STK Push to phone
- `POST /api/v1/payments/mpesa/callback/` -> Safaricom IPN callback webhook
- `GET /api/v1/payments/mpesa/status/{checkout_request_id}/` -> Real-time polling

### Live Market & Social Commerce
- `GET /api/v1/live/` -> Active live streams with stall info & viewer metrics
- `POST /api/v1/live/start/` -> Start seller broadcast session
- `POST /api/v1/live/{id}/comments/` -> Realtime chat message or buyer question
- `POST /api/v1/live/{id}/pin/` -> Pin product to stream carousel

### Product Requests & Show Me
- `GET /api/v1/requests/` -> Community product requests
- `POST /api/v1/requests/` -> Buyer posts item search
- `POST /api/v1/requests/{id}/respond/` -> Seller responds "I HAVE IT"
- `POST /api/v1/show-me/` -> Buyer asks seller for live/photo proof

### Rider & Delivery
- `GET /api/v1/rider/deliveries/available/` -> Unassigned orders in zone
- `POST /api/v1/rider/deliveries/{id}/accept/` -> Rider claims delivery
- `POST /api/v1/rider/deliveries/{id}/status/` -> Updates status (PICKED_UP, DELIVERED)

### Admin Operations
- `GET /api/v1/admin/analytics/` -> Real aggregated metrics from database
- `PATCH /api/v1/admin/stores/{id}/verify/` -> Verify, suspend, or reject seller
- `POST /api/v1/admin/subscriptions/` -> Create or modify subscription tiers

---

## 5. REPOSITORY STRUCTURE (NEXT.JS & DJANGO)

### Next.js App Router Structure
```text
jaza-kikapu-web/
├── app/
│   ├── (public)/
│   │   ├── page.tsx               # Homepage ("ENTER THE MARKET")
│   │   ├── market/page.tsx        # Interactive digital marketplace
│   │   ├── live/page.tsx          # Live Market stage & streams
│   │   ├── stores/[slug]/page.tsx # Digital Seller Stall
│   │   ├── near-me/page.tsx       # Location discovery (Taita-Taveta)
│   │   ├── requests/page.tsx      # "Request a Product" feed
│   │   └── quick-basket/page.tsx  # Supermarket quick-shop mode
│   ├── (buyer)/
│   │   ├── kikapu/page.tsx        # Multi-seller shopping basket
│   │   ├── checkout/page.tsx      # M-Pesa STK push & split preview
│   │   └── orders/[id]/page.tsx   # Order & rider tracking
│   ├── seller/
│   │   ├── dashboard/page.tsx     # Seller stall console
│   │   ├── products/page.tsx      # Inventory & catalog
│   │   ├── orders/page.tsx        # Split orders for this stall
│   │   ├── live/page.tsx          # Go live studio
│   │   └── wallet/page.tsx        # Earnings & subscription plans
│   ├── rider/
│   │   └── dashboard/page.tsx     # Deliveries, pickup/dropoff, earnings
│   └── admin/
│       └── dashboard/page.tsx     # Platform analytics, sellers, orders, plans
```

### Django Backend Structure
```text
jaza_kikapu_backend/
├── manage.py
├── jaza_core/
│   ├── settings.py
│   ├── asgi.py
│   └── urls.py
├── apps/
│   ├── accounts/      # User, Profile, RBAC, Phone OTP
│   ├── stores/        # Stalls, Subscriptions, Jaza Score
│   ├── products/      # Catalog, Categories, Stock
│   ├── orders/        # Parent Orders, Seller Splits, Cart
│   ├── payments/      # Safaricom Daraja STK Push & Webhook Callbacks
│   ├── delivery/      # Riders, Zones, Delivery Jobs
│   ├── live/          # Live Streaming, Channels WebSocket, Pinning
│   └── social/        # Product Requests, "Show Me", Stories, Reviews
```

---

## 6. SITEMAP & USER JOURNEYS

### Core Buyer Journey
1. **ENTER THE MARKET**: Landing in Voi Market, chooses zone (e.g. Voi Main Market / Taveta).
2. **DISCOVER**: Browses digital stalls (e.g., Mama Asha Boutique, Taita Greens, Tsavo Tech).
3. **WATCH & INTERACT**: Enters a Live Stream, asks a question, requests "Show Me the red one".
4. **FILL KIKAPU**: Adds Ankara dress from Seller A (KES 2,000), Fresh Bananas from Seller B (KES 300), Charger from Seller C (KES 500).
5. **CHECKOUT**: Single checkout -> M-Pesa STK Push -> Enter PIN -> Payment Verified.
6. **FULFILMENT**: Backend automatically splits into 3 seller orders -> Boda Boda rider assigned -> Pickup & consolidated delivery in Voi.
