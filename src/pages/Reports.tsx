import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

const Reports = () => {
  const { transactions, fetchTransactions, dailyBudget, fetchDailyStats } = useStore();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('today');

  useEffect(() => {
    fetchTransactions();
    fetchDailyStats();
  }, []);

  // حساب الإحصائيات
  const totalExpenses = transactions
    .filter(t => t.transaction_type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // تجميع حسب الفئة
  const categoryStats = transactions.reduce((acc, t) => {
    if (t.transaction_type === 'expense') {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  const categories = Object.entries(categoryStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">التقارير والإحصائيات 📈</h1>
          <p className="text-sm text-gray-500 mt-1">نظرة شاملة على الأداء المالي</p>
        </div>

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
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/40 shadow-soft relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-green-500/10 transition-all" />
          <p className="text-sm font-bold text-gray-500 mb-2 relative z-10">الموازنة المحددة</p>
          <p className="text-3xl font-bold text-gray-800 tracking-tight relative z-10">
            {dailyBudget.toLocaleString('ar-EG')} <span className="text-sm text-gray-400">ج.س</span>
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/40 shadow-soft relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-red-500/10 transition-all" />
          <p className="text-sm font-bold text-gray-500 mb-2 relative z-10">إجمالي المصروفات</p>
          <p className="text-3xl font-bold text-red-600 tracking-tight relative z-10">
            {totalExpenses.toLocaleString('ar-EG')} <span className="text-sm text-red-400">ج.س</span>
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/40 shadow-soft relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 blur-2xl transition-all ${(dailyBudget - totalExpenses) >= 0 ? 'bg-primary-500/5 group-hover:bg-primary-500/10' : 'bg-red-500/5 group-hover:bg-red-500/10'
            }`} />
          <p className="text-sm font-bold text-gray-500 mb-2 relative z-10">الرصيد المتبقي</p>
          <p className={`text-3xl font-bold tracking-tight relative z-10 ${(dailyBudget - totalExpenses) >= 0 ? 'text-primary-600' : 'text-red-600'
            }`}>
            {(dailyBudget - totalExpenses).toLocaleString('ar-EG')} <span className={`text-sm ${(dailyBudget - totalExpenses) >= 0 ? 'text-primary-400' : 'text-red-400'
              }`}>ج.س</span>
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-2 gap-6 overflow-hidden">
        {/* Left: Category Cards */}
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-soft border border-white/40 flex flex-col overflow-hidden">
          <div className="p-5 border-b border-gray-100/50">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span>📊</span>
              التوزيع حسب الفئة
            </h2>
          </div>
          <div className="flex-1 overflow-auto custom-scrollbar p-5">
            {categories.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                <span className="text-4xl opacity-50">📉</span>
                <p className="font-medium">لا توجد بيانات</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {categories.map(([category, amount]) => {
                  const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                  // Generate color based on category index
                  const colors = [
                    { bg: 'bg-primary-50', border: 'border-primary-100', text: 'text-primary-700', bar: 'bg-primary-500' },
                    { bg: 'bg-secondary-50', border: 'border-secondary-100', text: 'text-secondary-700', bar: 'bg-secondary-500' },
                    { bg: 'bg-accent-50', border: 'border-accent-100', text: 'text-accent-700', bar: 'bg-accent-500' },
                    { bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-700', bar: 'bg-purple-500' },
                    { bg: 'bg-pink-50', border: 'border-pink-100', text: 'text-pink-700', bar: 'bg-pink-500' },
                  ];
                  const colorIndex = categories.findIndex(([c]) => c === category);
                  const color = colors[colorIndex % colors.length];

                  return (
                    <button
                      key={category}
                      onClick={() => navigate(`/category/${encodeURIComponent(category)}`)}
                      className={`${color.bg} border border-transparent hover:border-current ${color.text} rounded-2xl p-5 transition-all hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] text-right group relative overflow-hidden`}
                    >
                      <div className="space-y-3 relative z-10">
                        {/* Category Name and Amount */}
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold">{category}</h3>
                          <span className="text-sm font-bold opacity-75 bg-white/50 px-2 py-1 rounded-lg">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>

                        {/* Amount */}
                        <div className="text-2xl font-bold">
                          {amount.toLocaleString('ar-EG')} <span className="text-base opacity-75">ج.س</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-white/50 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`${color.bar} h-full rounded-full transition-all duration-1000 ease-out`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>

                        {/* View Details */}
                        <div className="flex items-center justify-end gap-1 text-xs font-bold opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                          <span>عرض التفاصيل</span>
                          <span>←</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Recent Transactions */}
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-soft border border-white/40 flex flex-col overflow-hidden">
          <div className="p-5 border-b border-gray-100/50">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span>🕒</span>
              آخر المعاملات
            </h2>
          </div>
          <div className="flex-1 overflow-auto custom-scrollbar p-2">
            <table className="w-full text-xs border-separate border-spacing-y-2">
              <thead className="sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-right font-bold text-gray-400 uppercase tracking-wider bg-gray-50/90 backdrop-blur rounded-r-xl">التاريخ</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-400 uppercase tracking-wider bg-gray-50/90 backdrop-blur">الفئة</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-400 uppercase tracking-wider bg-gray-50/90 backdrop-blur">المبلغ</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-400 uppercase tracking-wider bg-gray-50/90 backdrop-blur rounded-l-xl">النوع</th>
                </tr>
              </thead>
              <tbody className="px-2">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-3xl opacity-50">📭</span>
                        <p className="font-medium">لا توجد معاملات</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  transactions.slice(0, 10).map((transaction) => (
                    <tr key={transaction.id} className="group hover:-translate-y-0.5 transition-all duration-200">
                      <td className="px-4 py-3 bg-white rounded-r-xl border-y border-r border-gray-100 group-hover:border-primary-100 group-hover:shadow-sm transition-all text-gray-600 font-medium">
                        {new Date(transaction.created_at).toLocaleDateString('ar-EG', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-4 py-3 bg-white border-y border-gray-100 group-hover:border-primary-100 group-hover:shadow-sm transition-all">
                        <span className="px-2 py-1 bg-primary-50 text-primary-700 rounded-lg font-bold border border-primary-100">
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
