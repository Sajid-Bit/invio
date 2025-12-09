# Invio - Quick Reference Card

## 🚀 Quick Start Commands

```bash
# Setup verification
.\setup-check.bat

# Install dependencies (first time)
npm install

# Run frontend only (browser)
npm run dev

# Run full desktop app (requires Rust)
npm run tauri:dev

# Build for production
npm run tauri:build
```

## 📁 Key Files to Edit

| File | Purpose |
|------|---------|
| `src/pages/Dashboard.tsx` | Main dashboard UI |
| `src/components/AddTransactionForm.tsx` | Transaction form |
| `src/components/TransactionList.tsx` | Transaction table |
| `src/store/useStore.ts` | State management |
| `src-tauri/src/commands.rs` | Backend API |
| `tailwind.config.js` | Design system |

## 🎨 Customization

### Change Daily Budget
Edit: `src-tauri/src/commands.rs`
```rust
pub async fn get_daily_budget(pool: State<'_, DbPool>) -> Result<f64, String> {
    Ok(2000.0)  // Change this value
}
```

### Add New Category
Edit: `src/components/AddTransactionForm.tsx`
```tsx
<option value="أدوات مكتبية">أدوات مكتبية</option>
<option value="YOUR_CATEGORY">YOUR_CATEGORY</option>
```

### Change Colors
Edit: `tailwind.config.js`
```js
colors: {
  primary: '#3B82F6',  // Blue
  danger: '#DC2626',   // Red
}
```

## 🗄️ Database

### Location
`data/invio.db` (auto-created)

### Add Migration
Create: `src-tauri/migrations/YYYYMMDDHHMMSS_name.sql`
```sql
ALTER TABLE transactions ADD COLUMN new_field TEXT;
```

### View Database
Use any SQLite viewer:
- DB Browser for SQLite
- SQLite Studio
- VS Code SQLite extension

## 🔧 Tauri Commands (API)

### Call from React
```typescript
import { invoke } from '@tauri-apps/api/tauri';

// Get budget
const budget = await invoke<number>('get_daily_budget');

// Add transaction
await invoke('add_transaction', {
  transaction: { /* data */ }
});
```

### Available Commands
- `get_daily_budget` - Returns daily budget
- `get_daily_expenses` - Returns total expenses
- `get_today_transactions` - Returns transaction list
- `add_transaction` - Creates new transaction
- `search_transactions` - Filters transactions
- `export_transactions_pdf` - PDF export (placeholder)

## 📊 State Management

### Zustand Store
```typescript
import { useStore } from '../store/useStore';

function Component() {
  const { 
    dailyBudget,
    dailyExpenses,
    transactions,
    fetchDailyStats,
    addTransaction 
  } = useStore();
  
  // Use state and actions...
}
```

## 🎯 Common Tasks

### Add New Page
1. Create: `src/pages/NewPage.tsx`
2. Add route in: `src/App.tsx`
3. Add link in: `src/components/Sidebar.tsx`

### Add New Tauri Command
1. Define in: `src-tauri/src/commands.rs`
2. Register in: `src-tauri/src/main.rs`
3. Call from React with `invoke()`

### Style Components
```tsx
// Use Tailwind classes
<div className="bg-white rounded-lg shadow p-6">
  <h2 className="text-xl font-bold text-gray-800">Title</h2>
</div>
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 1420 in use | Change port in `vite.config.ts` |
| Rust not found | Install from https://rustup.rs/ |
| Database locked | Close other connections |
| Hot reload not working | Restart dev server |
| Build fails | Run `cargo clean` in src-tauri/ |

## 📱 Responsive Breakpoints

```css
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large */
```

## 🌐 URLs

- **Dev Server**: http://localhost:1420
- **Tauri Docs**: https://tauri.app/
- **React Docs**: https://react.dev/
- **Tailwind**: https://tailwindcss.com/
- **Zustand**: https://zustand-demo.pmnd.rs/

## 💡 Tips

1. **Hot Reload**: Save files to see changes instantly
2. **DevTools**: Press F12 in Tauri app for React DevTools
3. **Console**: Use `console.log()` for debugging
4. **State**: Check Zustand DevTools for state inspection
5. **SQL**: Test queries in DB Browser before migration

## 🔐 Production Checklist

- [ ] Remove sample data migration
- [ ] Set daily budget from database
- [ ] Add user authentication
- [ ] Implement PDF export
- [ ] Add data backup feature
- [ ] Set up error logging
- [ ] Configure app signing
- [ ] Test on clean machine
- [ ] Create installer
- [ ] Write user manual

---

**Quick Help**: See SETUP.md for detailed setup
**Full Docs**: See PROJECT_SUMMARY.md for overview
