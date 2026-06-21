# Drisha Trading Company (DTC) — E-commerce Platform

A full-stack, B2B/B2C hardware and home-solutions e-commerce web application built for **Drisha Trading Company (DTC)**, a Hyderabad-based supplier. Slogan: "Your Needs, Our Services."

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite, TailwindCSS (v4), Framer Motion, React Router v6, Zustand (state), React Hook Form + Zod (validation)
- **Backend:** Node.js + Express, REST API, JWT (access + refresh tokens)
- **Database:** SQLite with Prisma ORM (zero-config, instant local run)
- **Payment Integration:** Razorpay Test Mode SDK (with automated Simulated Mode fallback if keys are missing)

---

## 📂 Project Structure

```text
tour_website/                  # Root Frontend Directory
├── backend/                   # Node.js + Express + Prisma Backend
│   ├── prisma/                # SQLite database and Seed scripts
│   │   ├── dev.db             # Local SQLite database (auto-generated)
│   │   ├── schema.prisma      # Prisma Database models
│   │   └── seed.js            # Seeding script (30 products, 2 default users)
│   ├── server.js              # Express API Server
│   ├── .env.example           # Environment template
│   └── .env                   # Local Environment keys (JWT, Razorpay)
├── src/                       # React frontend source files
│   ├── components/            # Nav, Footer, Drawer, Cards, Guards
│   ├── store/                 # Zustand state stores (auth, cart, toast)
│   ├── utils/                 # API request utility
│   ├── views/                 # Core page views (Home, Catalog, Checkout, Dashboards)
│   └── App.jsx                # Route declarations & Framer Motion transitions
└── README.md                  # Instructions manual
```

---

## 🚀 Setup & Execution Instructions

Run the application locally in minutes by executing the following steps.

### Step 1: Clone and Install Backend Dependencies
Open your terminal and execute:
```bash
cd backend
npm install
```

### Step 2: Database Migration & Seeding
Deploy the SQLite schema structures and seed the products:
```bash
# Deploys database migrations
npx prisma migrate dev --name init

# Seeds categories, 30 products, and 2 default accounts
node prisma/seed.js
```

### Step 3: Run the Express Server
Start the backend server on `http://localhost:5000`:
```bash
npm run dev
```

### Step 4: Install Frontend Dependencies & Run
Open a second terminal window in the root directory:
```bash
# Install frontend packages
npm install

# Start the Vite dev server on http://localhost:5173
npm run dev
```

---

## 🔐 Demo Credentials

Use these seeded accounts to log in and review both user experiences:

| Role | Email | Password | Purpose |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@drishatrading.com` | `admin123` | Can CRUD products, edit order statuses, review sales metrics |
| **Customer** | `customer@drishatrading.com` | `customer123` | Can add to cart, edit addresses, checkout, review order history |

---

## 💳 Razorpay Test Mode & Simulation Sandbox

DTC is equipped with a dual payment processing model:

### 1. Simulated Mode (Zero Config - Default)
If no Razorpay keys are configured in the `backend/.env` file, the checkout flow **automatically falls back to simulated payment**. You can click through checkout and payment verification immediately with no setup.

### 2. Real Razorpay Test Mode Modal
To see the official Razorpay Checkout popup:
1. Sign up at [razorpay.com](https://razorpay.com) and switch the top-left toggle to **Test Mode**.
2. Go to **Settings** → **API Keys** → Generate Test Key ID and Secret.
3. Open `backend/.env` and enter these keys:
   ```env
   RAZORPAY_KEY_ID=rzp_test_xxxxxx
   RAZORPAY_KEY_SECRET=yyyyyyyy
   ```
4. Restart the backend server. The checkout flow will now load the official Razorpay dialog popup.

#### 🧪 Test Credentials to use during the checkout demo:
- **Card Payments:** `4111 1111 1111 1111`, any future expiry date, any 3-digit CVV number.
- **UPI Payments:** `success@razorpay` to simulate a successful UPI transaction.
- **Netbanking:** Select any bank and click **Success**.
