# Invio Architecture

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Desktop Application                     │
│                         (Tauri)                              │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┴─────────────────────┐
        │                                           │
        ▼                                           ▼
┌──────────────┐                            ┌──────────────┐
│   Frontend   │                            │   Backend    │
│   (React)    │◄──────Tauri API──────────►│   (Rust)     │
└──────────────┘      invoke/events         └──────────────┘
        │                                           │
        │                                           │
        ▼                                           ▼
┌──────────────┐                            ┌──────────────┐
│   Browser    │                            │   SQLite     │
│   Runtime    │                            │   Database   │
│  (WebView2)  │                            │              │
└──────────────┘                            └──────────────┘
```

## Application Layers

### 1. Presentation Layer (React)

```
┌─────────────────────────────────────┐
│            React App                │
│  ┌─────────────────────────────┐   │
│  │      Router (Routes)         │   │
│  │  ┌────────┐  ┌────────┐     │   │
│  │  │Dashboard│  │Reports │     │   │
│  │  ├────────┤  ├────────┤     │   │
│  │  │ Users  │  │Settings│     │   │
│  │  └────────┘  └────────┘     │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │      Components             │   │
│  │  • Layout                   │   │
│  │  • Sidebar                  │   │
│  │  • Header                   │   │
│  │  • TransactionList          │   │
│  │  • AddTransactionForm       │   │
│  │  • BudgetAlert              │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   State (Zustand Store)     │   │
│  │  • dailyBudget              │   │
│  │  • dailyExpenses            │   │
│  │  • transactions[]           │   │
│  │  • actions                  │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### 2. Communication Layer (Tauri)

```
React (TypeScript)          Rust (Tauri)
─────────────────          ──────────────

invoke('get_daily_budget')
        │
        ├──────────────────────►  #[tauri::command]
                                  get_daily_budget()
                                       │
        ◄──────────────────────┤      │
          Result<f64>                  ▼
                                  Database Query
                                       │
invoke('add_transaction', {data})     ▼
        │                         Return Result
        ├──────────────────────►
                                  #[tauri::command]
        ◄──────────────────────┤  add_transaction()
          Result<Transaction>          │
                                       ▼
                                  Save to DB
```

### 3. Backend Layer (Rust)

```
┌─────────────────────────────────────┐
│         Rust Backend                │
│                                     │
│  ┌─────────────────────────────┐   │
│  │      main.rs                │   │
│  │  • App initialization       │   │
│  │  • Database setup           │   │
│  │  • Command registration     │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │      commands.rs            │   │
│  │  • get_daily_budget         │   │
│  │  • get_daily_expenses       │   │
│  │  • get_today_transactions   │   │
│  │  • add_transaction          │   │
│  │  • search_transactions      │   │
│  │  • export_transactions_pdf  │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │      db.rs                  │   │
│  │  • Database connection      │   │
│  │  • Migration runner         │   │
│  │  • Pool management          │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │      models.rs              │   │
│  │  • Transaction              │   │
│  │  • NewTransaction           │   │
│  │  • DailyStats               │   │
│  │  • TransactionFilter        │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### 4. Data Layer (SQLite)

```
┌─────────────────────────────────────┐
│         SQLite Database             │
│                                     │
│  ┌─────────────────────────────┐   │
│  │   transactions table        │   │
│  ├─────────────────────────────┤   │
│  │ id                 INTEGER  │   │
│  │ person_name        TEXT     │   │
│  │ person_avatar      TEXT?    │   │
│  │ category           TEXT     │   │
│  │ amount             REAL     │   │
│  │ transaction_type   TEXT     │   │
│  │ reason             TEXT     │   │
│  │ responsible_person TEXT?    │   │
│  │ created_at         TEXT     │   │
│  └─────────────────────────────┘   │
│                                     │
│  Indexes:                           │
│  • idx_transactions_date            │
│  • idx_transactions_type            │
│  • idx_transactions_person          │
└─────────────────────────────────────┘
```

## Data Flow Example

### Adding a Transaction

```
1. User fills form in AddTransactionForm.tsx
   ↓
2. Form submits → calls useStore.addTransaction()
   ↓
3. Store action → invoke('add_transaction', { transaction })
   ↓
4. Tauri receives command → commands.rs::add_transaction()
   ↓
5. Command validates data → prepares SQL
   ↓
6. SQLx executes INSERT query → SQLite database
   ↓
7. Database returns new record
   ↓
8. Command returns Result<Transaction> to frontend
   ↓
9. Store updates state → React re-renders
   ↓
10. UI shows new transaction in list
```

### Fetching Daily Stats

```
1. Dashboard component mounts → useEffect()
   ↓
2. Calls useStore.fetchDailyStats()
   ↓
3. Store → invoke('get_daily_budget')
         → invoke('get_daily_expenses')
   ↓
4. Tauri commands execute in parallel
   ↓
5. get_daily_budget() → returns fixed value (2000)
   get_daily_expenses() → queries SUM(amount) WHERE type='expense'
   ↓
6. Both results return to frontend
   ↓
7. Store updates state
   ↓
8. Dashboard re-renders with new data
   ↓
9. Progress bar calculates percentage
   ↓
10. BudgetAlert shows if over budget
```

## Technology Stack Details

```
Frontend Stack:
├── React 18.2.0         (UI Library)
├── TypeScript 5.3.3     (Type Safety)
├── React Router 6.22.0  (Navigation)
├── Zustand 4.5.0        (State Management)
├── Tailwind CSS 3.4.1   (Styling)
└── Vite 5.1.3           (Build Tool)

Backend Stack:
├── Rust 2021 Edition    (Systems Language)
├── Tauri 1.5            (Desktop Framework)
├── SQLx 0.7             (SQL Toolkit)
├── SQLite               (Embedded Database)
├── Tokio 1.x            (Async Runtime)
├── Serde 1.0            (Serialization)
└── Chrono 0.4           (Date/Time)

Development Tools:
├── npm                  (Package Manager)
├── Cargo                (Rust Build Tool)
└── TypeScript Compiler  (Type Checking)
```

## File Structure

```
invio/
│
├── Frontend Source (src/)
│   ├── components/          ← Reusable UI components
│   ├── pages/               ← Page-level components
│   ├── store/               ← Zustand state management
│   ├── App.tsx              ← App entry + routing
│   ├── main.tsx             ← React DOM render
│   └── index.css            ← Global styles
│
├── Backend Source (src-tauri/src/)
│   ├── main.rs              ← Tauri app entry
│   ├── commands.rs          ← API endpoints
│   ├── db.rs                ← Database setup
│   └── models.rs            ← Data structures
│
├── Database (src-tauri/migrations/)
│   ├── *_init.sql           ← Schema definition
│   └── *_seed.sql           ← Sample data
│
├── Configuration
│   ├── package.json         ← Node dependencies
│   ├── Cargo.toml           ← Rust dependencies
│   ├── tauri.conf.json      ← Tauri settings
│   ├── vite.config.ts       ← Vite config
│   ├── tailwind.config.js   ← Tailwind config
│   └── tsconfig.json        ← TypeScript config
│
└── Documentation
    ├── README.md            ← Project overview
    ├── SETUP.md             ← Setup guide
    ├── PROJECT_SUMMARY.md   ← Completion summary
    ├── QUICK_REFERENCE.md   ← Quick ref card
    └── ARCHITECTURE.md      ← This file
```

## Security Model

```
┌────────────────────────────────────┐
│   Sandboxed WebView (Frontend)    │
│   • Limited system access          │
│   • XSS protection                 │
│   • CSP enabled                    │
└────────────────────────────────────┘
              │
              │ Tauri Commands Only
              ▼
┌────────────────────────────────────┐
│   Rust Backend (Privileged)       │
│   • File system access             │
│   • Database access                │
│   • System APIs                    │
│   • Validated commands only        │
└────────────────────────────────────┘
```

## Build Process

```
Development Mode:
  npm run tauri:dev
      │
      ├──► npm run dev (Vite)
      │       └──► Compiles React/TS
      │       └──► Starts dev server (localhost:1420)
      │       └──► Enables HMR
      │
      └──► tauri dev (Rust)
              └──► Compiles Rust code
              └──► Creates desktop window
              └──► Loads Vite dev server
              └──► Enables hot reload

Production Mode:
  npm run tauri:build
      │
      ├──► npm run build (Vite)
      │       └──► Compiles & optimizes React
      │       └──► Outputs to dist/
      │
      └──► tauri build (Rust)
              └──► Compiles Rust (release mode)
              └──► Bundles assets
              └──► Creates installer
              └──► Outputs to src-tauri/target/release/bundle/
```

---

This architecture provides:
✓ Type safety (TypeScript + Rust)
✓ Performance (native compilation)
✓ Security (sandboxed frontend)
✓ Offline-first (embedded database)
✓ Modern UX (React + Tailwind)
