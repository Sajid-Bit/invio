# Invio Setup Guide

## Prerequisites Installation

### 1. Install Rust

Rust is required for the Tauri backend.

**Windows:**
1. Download Rust installer from: https://rustup.rs/
2. Run the installer and follow prompts
3. Restart your terminal/IDE after installation
4. Verify installation:
```powershell
rustc --version
cargo --version
```

**Alternative (using winget):**
```powershell
winget install Rustlang.Rust.MSVC
```

### 2. Install Required Build Tools

**Windows:**
- Install Microsoft C++ Build Tools
- Visit: https://visualstudio.microsoft.com/downloads/
- Download "Build Tools for Visual Studio 2022"
- During installation, select "Desktop development with C++"

**Or use Visual Studio installer:**
```powershell
winget install Microsoft.VisualStudio.2022.BuildTools
```

### 3. Install WebView2 (Windows)

Tauri requires WebView2 for rendering:
```powershell
winget install Microsoft.EdgeWebView2Runtime
```

Or download from: https://developer.microsoft.com/en-us/microsoft-edge/webview2/

## Project Setup

### Step 1: Install Node Dependencies

```bash
npm install
```

### Step 2: Verify Rust Installation

```bash
rustc --version
cargo --version
```

### Step 3: Test Rust Backend

Navigate to Rust directory and check:
```bash
cd src-tauri
cargo check
```

If successful, return to root:
```bash
cd ..
```

### Step 4: Run Development Server

**Option A: Frontend Only (for quick testing)**
```bash
npm run dev
```
Open browser at: http://localhost:1420

**Option B: Full Tauri Application (recommended)**
```bash
npm run tauri:dev
```

This will:
- Compile Rust backend
- Start Vite dev server
- Open desktop application
- Enable hot-reload for both frontend and backend

### Step 5: Build for Production

```bash
npm run tauri:build
```

Built application will be in: `src-tauri/target/release/bundle/`

## Troubleshooting

### Error: "program not found" or "cargo not found"

**Solution:** Rust is not installed or not in PATH
1. Install Rust from https://rustup.rs/
2. Restart terminal
3. Verify: `cargo --version`

### Error: "link.exe not found" or "MSVC not found"

**Solution:** C++ build tools missing
1. Install Visual Studio Build Tools
2. Select "Desktop development with C++"
3. Restart terminal

### Error: "WebView2 not found"

**Solution:** Install WebView2 Runtime
```powershell
winget install Microsoft.EdgeWebView2Runtime
```

### Database Errors

The SQLite database is created automatically on first run in the `data/` directory.

If you encounter database errors:
1. Delete `data/` folder
2. Restart the application
3. Database will be recreated with migrations

### Port 1420 Already in Use

If Vite can't start on port 1420:
1. Kill the process using the port
2. Or change port in `vite.config.ts`:
```typescript
server: {
  port: 1421, // Change to another port
  strictPort: true,
}
```

## Development Workflow

### Frontend Development

1. Make changes to files in `src/`
2. Vite will hot-reload automatically
3. View changes in browser/desktop app

### Backend Development

1. Make changes to Rust files in `src-tauri/src/`
2. Tauri will recompile automatically
3. Application restarts with new changes

### Database Changes

1. Create new migration file in `src-tauri/migrations/`
2. Name format: `YYYYMMDDHHMMSS_description.sql`
3. Run migration by restarting app

Example migration:
```sql
-- src-tauri/migrations/20250101120000_add_budget_settings.sql
CREATE TABLE IF NOT EXISTS budget_settings (
    id INTEGER PRIMARY KEY,
    daily_budget REAL NOT NULL,
    updated_at TEXT NOT NULL
);
```

## Tech Stack Overview

### Frontend
- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **Zustand** - State Management
- **React Router** - Navigation
- **Vite** - Build Tool

### Backend
- **Rust** - Systems Programming
- **Tauri** - Desktop Framework
- **SQLx** - Database Toolkit
- **SQLite** - Embedded Database
- **Tokio** - Async Runtime

## Useful Commands

```bash
# Install dependencies
npm install

# Run frontend only (browser)
npm run dev

# Run full Tauri app (desktop)
npm run tauri:dev

# Build for production
npm run tauri:build

# Type checking
npm run build

# Check Rust code
cd src-tauri && cargo check

# Format Rust code
cd src-tauri && cargo fmt

# Lint Rust code
cd src-tauri && cargo clippy
```

## Project Structure

```
invio/
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── pages/             # Page components
│   ├── store/             # Zustand state
│   └── main.tsx           # Entry point
├── src-tauri/             # Rust backend
│   ├── src/
│   │   ├── main.rs        # Entry point
│   │   ├── commands.rs    # Tauri commands (API)
│   │   ├── db.rs          # Database setup
│   │   └── models.rs      # Data structures
│   └── migrations/        # SQL migrations
├── public/                # Static assets
├── data/                  # SQLite database (auto-created)
└── dist/                  # Build output
```

## Next Steps

After setup:
1. ✅ Run `npm run tauri:dev` to test the app
2. 📝 Start customizing the UI in `src/pages/Dashboard.tsx`
3. 🗄️ Add more database tables in migrations
4. 🔧 Add new Tauri commands in `src-tauri/src/commands.rs`
5. 🎨 Customize styles in `tailwind.config.js`

## Support

For issues:
- Check the troubleshooting section above
- Tauri docs: https://tauri.app/
- React docs: https://react.dev/
- Tailwind docs: https://tailwindcss.com/

---

**Happy Coding! 🚀**
