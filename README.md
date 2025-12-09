# Invio - School Financial Management System

A desktop application for managing school finances built with Tauri, React, and SQLite.

## Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Zustand** - State management
- **Vite** - Build tool

### Backend
- **Rust** - Backend logic via Tauri
- **Tauri** - Desktop application framework
- **SQLite** - Local database
- **SQLx** - SQL toolkit

## Features

- ✅ Daily budget tracking
- ✅ Transaction management (income/expenses)
- ✅ Real-time budget alerts
- ✅ Search and filter transactions
- ✅ Arabic RTL support
- ✅ Responsive design
- 🔄 PDF export (coming soon)
- 🔄 Advanced reporting (coming soon)

## Getting Started

### Prerequisites

- Node.js (v18+)
- Rust (latest stable)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run in development mode:
```bash
npm run tauri:dev
```

3. Build for production:
```bash
npm run tauri:build
```

## Project Structure

```
invio/
├── src/                    # React frontend
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   ├── store/             # Zustand state management
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── src-tauri/             # Rust backend
│   ├── src/
│   │   ├── commands.rs    # Tauri commands
│   │   ├── db.rs          # Database setup
│   │   ├── models.rs      # Data models
│   │   └── main.rs        # Entry point
│   ├── migrations/        # SQL migrations
│   └── Cargo.toml         # Rust dependencies
└── package.json           # Node dependencies
```

## Available Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Build frontend
- `npm run tauri:dev` - Run Tauri in development
- `npm run tauri:build` - Build Tauri application

## Database Schema

### transactions
- `id` - Primary key
- `person_name` - Name of the person
- `person_avatar` - Avatar URL (optional)
- `category` - Transaction category
- `amount` - Amount in currency
- `transaction_type` - 'income' or 'expense'
- `reason` - Description/reason
- `responsible_person` - Responsible person (optional)
- `created_at` - Timestamp

## License

MIT

## Author

Sajid
