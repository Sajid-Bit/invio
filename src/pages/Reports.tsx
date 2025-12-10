import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import SpendingChart from '../components/SpendingChart';

const Reports = () => {
  const { transactions, fetchTransactions, dailyBudget, fetchDailyStats } = useStore();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('today');
  const [categorySearch, setCategorySearch] = useState('');

  // Ref for printing
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTransactions();
    fetchDailyStats();
  }, []);

  // Filter transactions based on date range and category search
  const filteredTransactions = transactions.filter(t => {
    // Date Range Filter
    let matchesDate = true;
    if (dateRange === 'today') {
      const today = new Date().toISOString().split('T')[0];
      matchesDate = t.created_at.startsWith(today);
    }

    // Category Search Filter
    const matchesCategory = categorySearch === '' ||
      t.category.toLowerCase().includes(categorySearch.toLowerCase());

    return matchesDate && matchesCategory;
  });

  // Calculate Statistics
  const totalExpenses = filteredTransactions
    .filter(t => t.transaction_type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Comparative Insights (Mocked logic for demo)
  const previousPeriodExpenses = totalExpenses * 0.9;
  const spendingTrend = totalExpenses > previousPeriodExpenses ? 'up' : 'down';
  const trendPercentage = previousPeriodExpenses > 0
    ? Math.abs(((totalExpenses - previousPeriodExpenses) / previousPeriodExpenses) * 100).toFixed(1)
    : '0.0';

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Date,Category,Amount,Type\n"
      + filteredTransactions.map(t =>
        `${new Date(t.created_at).toLocaleDateString()},${t.category},${t.amount},${t.transaction_type}`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "financial_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full flex flex-col gap-6" ref={printRef}>
      {/* Header */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            التقارير والإحصائيات
          </h1>
          <p className="text-sm text-gray-500 mt-1">نظرة شاملة على الأداء المالي</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-2 bg-white/50 backdrop-blur p-1 rounded-xl border border-white/40 shadow-sm">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 text-sm bg-white/80 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 font-bold text-gray-700 cursor-pointer hover:bg-white transition-colors"
            >
              <option value="today">اليوم</option>
              <option value="week">هذا الأسبوع</option>
              <option value="month">هذا الشهر</option>
              <option value="year">هذا العام</option>
            </select>
          </div>

          <button
            onClick={handleExport}
            className="p-2.5 bg-white text-gray-600 rounded-xl hover:bg-gray-50 border border-gray-200 shadow-sm transition-all"
            title="تصدير CSV"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>

          <button
            onClick={handlePrint}
            className="p-2.5 bg-primary-50 text-primary-600 rounded-xl hover:bg-primary-100 border border-primary-100 shadow-sm transition-all"
            title="طباعة التقرير"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Top Row: Stats Cards & Spending Trend */}
      <div className="grid grid-cols-12 gap-6 h-48">
        {/* Stats Cards (Left) */}
        <div className="col-span-4 grid grid-rows-2 gap-4 h-full">
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-white/40 shadow-soft relative overflow-hidden group">
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-xs font-bold text-gray-500 mb-1">إجمالي المصروفات</p>
                <p className="text-2xl font-bold text-gray-800 tracking-tight">
                  {totalExpenses.toLocaleString('ar-EG')} <span className="text-xs text-gray-400">ج.س</span>
                </p>
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${spendingTrend === 'up' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                <span>{spendingTrend === 'up' ? '↑' : '↓'}</span>
                <span>{trendPercentage}%</span>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100">
              <div className="h-full bg-primary-500" style={{ width: '65%' }}></div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-white/40 shadow-soft relative overflow-hidden group">
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-xs font-bold text-gray-500 mb-1">الرصيد المتبقي</p>
                <p className={`text-2xl font-bold tracking-tight ${(dailyBudget - totalExpenses) >= 0 ? 'text-primary-600' : 'text-red-600'}`}>
                  {(dailyBudget - totalExpenses).toLocaleString('ar-EG')} <span className="text-xs opacity-60">ج.س</span>
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Spending Trend Chart (Right) */}
        <div className="col-span-8 bg-white/60 backdrop-blur-xl rounded-2xl p-5 border border-white/40 shadow-soft relative overflow-hidden flex flex-col">
          <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            تحليل الإنفاق (آخر 7 أيام)
          </h3>
          <div className="flex-1 w-full">
            <SpendingChart transactions={transactions} />
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Transactions (Full Width) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 bg-white/60 backdrop-blur-xl rounded-2xl shadow-soft border border-white/40 flex flex-col overflow-hidden">
          <div className="p-5 border-b border-gray-100/50 flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 whitespace-nowrap">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              سجل المعاملات
            </h2>

            {/* Category Search Input */}
            <div className="relative flex-1 max-w-xs">
              <input
                type="text"
                placeholder="بحث حسب الفئة..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="w-full pl-4 pr-10 py-2 text-sm bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              />
              <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex-1 overflow-auto custom-scrollbar p-2">
            <table className="w-full text-sm border-separate border-spacing-y-2">
              <thead className="sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-right font-bold text-gray-400 text-xs uppercase tracking-wider bg-gray-50/90 backdrop-blur rounded-r-xl">التاريخ</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-400 text-xs uppercase tracking-wider bg-gray-50/90 backdrop-blur">الفئة</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-400 text-xs uppercase tracking-wider bg-gray-50/90 backdrop-blur">المبلغ</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-400 text-xs uppercase tracking-wider bg-gray-50/90 backdrop-blur rounded-l-xl">النوع</th>
                </tr>
              </thead>
              <tbody className="px-2">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                          <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                        </div>
                        <p className="font-medium">لا توجد معاملات مطابقة</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="group hover:-translate-y-0.5 transition-all duration-200">
                      <td className="px-4 py-3 bg-white rounded-r-xl border-y border-r border-gray-100 group-hover:border-primary-100 group-hover:shadow-sm transition-all text-gray-600 font-medium">
                        {new Date(transaction.created_at).toLocaleDateString('ar-EG', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-4 py-3 bg-white border-y border-gray-100 group-hover:border-primary-100 group-hover:shadow-sm transition-all">
                        <span className="px-2.5 py-1 bg-primary-50 text-primary-700 rounded-lg text-xs font-bold border border-primary-100">
                          {transaction.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 bg-white border-y border-gray-100 group-hover:border-primary-100 group-hover:shadow-sm transition-all">
                        <span className={`font-bold ${transaction.transaction_type === 'expense' ? 'text-red-500' : 'text-green-500'
                          }`}>
                          {transaction.transaction_type === 'expense' ? '-' : '+'}
                          {transaction.amount.toLocaleString('ar-EG')}
                        </span>
                      </td>
                      <td className="px-4 py-3 bg-white rounded-l-xl border-y border-l border-gray-100 group-hover:border-primary-100 group-hover:shadow-sm transition-all">
                        <span className={`font-bold ${transaction.transaction_type === 'expense' ? 'text-red-500' : 'text-green-500'
                          }`}>
                          {transaction.transaction_type === 'expense' ? 'مصروف' : 'إيراد'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
