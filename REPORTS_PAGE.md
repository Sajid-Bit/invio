# صفحة التقارير - Documentation

## ✨ Overview

صفحة التقارير والإحصائيات تعرض تحليل شامل للمصروفات والإيرادات مع إمكانية التصفية حسب الفترة الزمنية.

---

## 📊 المكونات الرئيسية

### 1. Header (الرأس)
```
┌─────────────────────────────────────────┐
│ التقارير والإحصائيات    [اليوم ▼] [تصدير PDF 📥] │
└─────────────────────────────────────────┘
```

**العناصر:**
- ✅ عنوان الصفحة
- ✅ قائمة اختيار الفترة الزمنية (اليوم، الأسبوع، الشهر، السنة)
- ✅ زر تصدير PDF

### 2. Statistics Cards (بطاقات الإحصائيات)

**ثلاث بطاقات:**

#### أ) إجمالي الإيرادات 💰
- اللون: أخضر
- القيمة: مجموع جميع الإيرادات
- أيقونة: 💰

#### ب) إجمالي المصروفات 💸
- اللون: أحمر
- القيمة: مجموع جميع المصروفات
- أيقونة: 💸

#### ج) الرصيد الصافي 📊
- اللون: أزرق (موجب) / أحمر (سالب)
- القيمة: الإيرادات - المصروفات
- أيقونة: 📊

### 3. Category Breakdown (التوزيع حسب الفئة)

**العمود الأيسر:**
```
┌──────────────────────────┐
│ التوزيع حسب الفئة         │
├──────────────────────────┤
│ أدوات مكتبية             │
│ [████████░░] 450 ج.س (45%)│
│                          │
│ صيانة                    │
│ [██████░░░░] 300 ج.س (30%)│
│                          │
│ كهرباء                   │
│ [████░░░░░░] 200 ج.س (20%)│
│                          │
│ [Pie Chart Placeholder]  │
└──────────────────────────┘
```

**الميزات:**
- ✅ قائمة الفئات الأعلى (Top 5)
- ✅ شريط تقدم لكل فئة
- ✅ النسبة المئوية
- ✅ المبلغ بالجنيه
- ✅ مكان للرسم البياني الدائري (قريباً)

### 4. Recent Transactions (آخر المعاملات)

**العمود الأيمن:**
```
┌──────────────────────────┐
│ آخر المعاملات            │
├──────────────────────────┤
│ التاريخ │ الفئة │ المبلغ │ النوع │
├────────┼──────┼───────┼──────┤
│ 18 أكت │ أدوات │ -350 │ مصروف │
│ 17 أكت │ صيانة │ -1200│ مصروف │
│ 16 أكت │ رواتب │ +5000│ إيراد │
└──────────────────────────┘
```

**الميزات:**
- ✅ آخر 10 معاملات
- ✅ التاريخ مختصر
- ✅ الفئة ملونة
- ✅ المبلغ ملون حسب النوع
- ✅ تمييز واضح بين الإيرادات والمصروفات

---

## 🎨 التصميم

### Layout Structure:
```
Reports Page (h-full)
├── Header (flex justify-between)
│   ├── Title
│   └── Controls (Date Range + Export)
│
├── Stats Cards (grid cols-3)
│   ├── Income Card
│   ├── Expenses Card
│   └── Balance Card
│
└── Main Content (grid cols-2)
    ├── Category Breakdown
    │   ├── Header
    │   ├── Category List
    │   └── Chart Placeholder
    │
    └── Recent Transactions
        ├── Header
        └── Table
```

### Color Scheme:
- **Income (الإيرادات):** `text-green-600`, `bg-green-50`
- **Expenses (المصروفات):** `text-red-600`, `bg-red-50`
- **Balance (الرصيد):** `text-blue-600`, `bg-blue-50`
- **Categories:** `text-blue-700`, `bg-blue-50`

### Sizes:
- **Stats Cards:** `text-xl font-bold`
- **Section Titles:** `text-base font-bold`
- **Table Text:** `text-xs`
- **Progress Bars:** `h-2`

---

## 💻 Technical Implementation

### State Management:
```typescript
const [dateRange, setDateRange] = useState('today');
const [selectedCategory, setSelectedCategory] = useState('all');
const { transactions, fetchTransactions } = useStore();
```

### Calculations:

**1. Total Income:**
```typescript
const totalIncome = transactions
  .filter(t => t.transaction_type === 'income')
  .reduce((sum, t) => sum + t.amount, 0);
```

**2. Total Expenses:**
```typescript
const totalExpenses = transactions
  .filter(t => t.transaction_type === 'expense')
  .reduce((sum, t) => sum + t.amount, 0);
```

**3. Balance:**
```typescript
const balance = totalIncome - totalExpenses;
```

**4. Category Stats:**
```typescript
const categoryStats = transactions.reduce((acc, t) => {
  if (t.transaction_type === 'expense') {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
  }
  return acc;
}, {} as Record<string, number>);

const categories = Object.entries(categoryStats)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5);
```

---

## 📅 Date Range Filters

### Options:
1. **اليوم (Today)** - Current day transactions
2. **هذا الأسبوع (This Week)** - Last 7 days
3. **هذا الشهر (This Month)** - Current month
4. **هذا العام (This Year)** - Current year

### Implementation (TODO):
```typescript
const filterByDateRange = (range: string) => {
  // Filter transactions based on selected range
  // Update calculations accordingly
};
```

---

## 📥 PDF Export (Planned)

### Features:
- Export current report to PDF
- Include:
  - Summary statistics
  - Category breakdown chart
  - Transaction list
  - Date range information

### Implementation (TODO):
```typescript
const exportToPDF = async () => {
  await invoke('export_report_pdf', {
    transactions,
    dateRange,
    stats: { totalIncome, totalExpenses, balance }
  });
};
```

---

## 📊 Chart Integration (Planned)

### Pie Chart for Categories:
- Library: Chart.js or Recharts
- Shows percentage breakdown
- Interactive tooltips
- Colors matching category badges

### Example Integration:
```typescript
import { PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

<PieChart width={200} height={200}>
  <Pie
    data={categories}
    dataKey="value"
    nameKey="name"
    cx="50%"
    cy="50%"
  >
    {categories.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>
</PieChart>
```

---

## 🎯 Features

### ✅ Current:
1. Real-time statistics calculation
2. Category breakdown with percentages
3. Progress bars for visual representation
4. Recent transactions table
5. Date range selector (UI only)
6. PDF export button (UI only)
7. Responsive layout
8. Empty state handling

### 🔜 Coming Soon:
1. Date range filtering (backend)
2. PDF export functionality
3. Pie chart visualization
4. Monthly comparison charts
5. Export to Excel
6. Print functionality
7. Advanced filters
8. Custom date range picker

---

## 📱 Responsive Design

### Grid Breakpoints:
- **Desktop:** 2 columns (Category + Transactions)
- **Tablet:** 2 columns (stacked on smaller screens)
- **Mobile:** 1 column (to be implemented)

### Overflow Handling:
- Category section: `overflow-auto`
- Transactions table: `overflow-auto`
- Both scroll independently

---

## 🔍 Empty States

### No Transactions:
```
┌──────────────────┐
│                  │
│  لا توجد بيانات   │
│                  │
└──────────────────┘
```

### No Categories:
```
┌──────────────────┐
│                  │
│  لا توجد بيانات   │
│                  │
└──────────────────┘
```

---

## 🎨 Styling Classes

### Cards:
```css
bg-white rounded-lg shadow-sm p-4 border border-gray-100
```

### Icon Badges:
```css
w-12 h-12 bg-{color}-50 rounded-full flex items-center justify-center
```

### Progress Bars:
```css
w-full bg-gray-200 rounded-full h-2
bg-blue-500 h-2 rounded-full
```

### Category Badges:
```css
px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs
```

---

## 🚀 Future Enhancements

1. **Advanced Analytics:**
   - Trend analysis
   - Month-over-month comparison
   - Year-over-year comparison
   - Budget vs actual

2. **Visualizations:**
   - Line charts for trends
   - Bar charts for comparisons
   - Area charts for cumulative data

3. **Filters:**
   - By person
   - By amount range
   - Custom date picker
   - Multiple categories

4. **Export Options:**
   - CSV export
   - Excel export
   - Email reports
   - Scheduled reports

---

## 📊 Sample Data Flow

```
User selects date range
        ↓
Fetch filtered transactions
        ↓
Calculate statistics
        ↓
Group by categories
        ↓
Sort and display
        ↓
Update visualizations
```

---

**Status:** ✅ Complete (Basic Version)
**Last Updated:** 2025-10-18
**Next Steps:** Backend filtering + Charts
