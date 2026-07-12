# TransitOps — Fleet Operating System

A frontend-only React dashboard for managing fleet vehicles, drivers, trips, maintenance, fuel & expenses, and analytics.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

| Tool | Version | Download |
|------|---------|----------|
| **Node.js** | v18 or higher | https://nodejs.org |
| **Yarn** | v1.22+ | `npm install -g yarn` |
| **Git** | Any recent version | https://git-scm.com |

---

### Installation & Running Locally

**1. Clone the repository**
```bash
git clone https://github.com/yashjangir04/TransitOps.git
cd TransitOps
```

**2. Navigate to the client folder**
```bash
cd client
```

**3. Install dependencies**
```bash
yarn install
```
> ⚠️ This project uses **Yarn**, not npm. Running `npm install` may cause dependency errors.

**4. Start the development server**
```bash
yarn start
```
or if you want a specific port:
```bash
PORT=3000 yarn start   # Mac/Linux
$env:PORT=3000; yarn start   # Windows PowerShell
```

**5. Open in browser**
```
http://localhost:3000
```

---

## 📁 Project Structure

```
TransitOps/
└── client/                  ← React frontend (this is what you run)
    ├── public/
    │   └── logo.png         ← App logo
    ├── src/
    │   ├── components/      ← Reusable UI components (Sidebar, KpiCard, etc.)
    │   ├── context/         ← App-wide state (AppContext)
    │   ├── lib/             ← Mock data & utilities
    │   └── pages/           ← All page components (Dashboard, Fleet, Drivers...)
    ├── craco.config.js      ← Build config
    ├── tailwind.config.js   ← Tailwind CSS config
    └── package.json
```

---

## 🔑 Demo Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Fleet Manager | manager@transitops.com | any password |
| Dispatcher | dispatcher@transitops.com | any password |
| Viewer | viewer@transitops.com | any password |

> This is a **frontend-only** app — all data is stored in memory (no backend/database required).

---

## 🛠️ Available Scripts

Inside the `client/` directory:

| Command | Description |
|---------|-------------|
| `yarn start` | Start dev server at localhost:3000 |
| `yarn build` | Build for production |
| `yarn test` | Run tests |

---

## ⚠️ Common Issues

**"JavaScript heap out of memory" error**
```bash
$env:NODE_OPTIONS='--max-old-space-size=4096'; yarn start
```

**Port already in use**
```bash
$env:PORT=3001; yarn start
```

**Stale cache causing issues**
```bash
# Delete cache and restart
Remove-Item -Recurse -Force node_modules\.cache
yarn start
```
