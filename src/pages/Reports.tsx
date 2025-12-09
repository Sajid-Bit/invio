import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

const Reports = () => {
  const { transactions, fetchTransactions, dailyBudget, fetchDailyStats } = useStore();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('today');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchTransactions();
    fetchDailyStats();
  }, []);

  // حساب الإحصائيات
  const totalIncome = transactions
    .filter(t => t.transaction_type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.transaction_type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

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
    <div className="h-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">التقارير والإحصائيات</h1>
        
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="today">اليوم</option>
            <option value="week">هذا الأسبوع</option>
            <option value="month">هذا الشهر</option>
            <option value="year">هذا العام</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">الموازنة المحددة</p>
          <p className="text-xl font-bold text-green-600">
            {dailyBudget.toLocaleString('ar-EG')} <span className="text-sm">ج.س</span>
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">إجمالي المصروفات</p>
          <p className="text-xl font-bold text-red-600">
            {totalExpenses.toLocaleString('ar-EG')} <span className="text-sm">ج.س</span>
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">الرصيد المتبقي</p>
          <p className={`text-xl font-bold ${
            (dailyBudget - totalExpenses) >= 0 ? 'text-blue-600' : 'text-red-600'
          }`}>
            {(dailyBudget - totalExpenses).toLocaleString('ar-EG')} <span className="text-sm">ج.س</span>
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-2 gap-4 overflow-hidden">
        {/* Left: Category Cards */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-base font-bold text-gray-800">التوزيع حسب الفئة</h2>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {categories.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-8">لا توجد بيانات</p>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {categories.map(([category, amount]) => {
                  const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                  // Generate color based on category index
                  const colors = [
                    { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', bar: 'bg-blue-500' },
                    { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', bar: 'bg-purple-500' },
                    { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', bar: 'bg-green-500' },
                    { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', bar: 'bg-orange-500' },
                    { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700', bar: 'bg-pink-500' },
                  ];
                  const colorIndex = categories.findIndex(([c]) => c === category);
                  const color = colors[colorIndex % colors.length];

                  return (
                    <button
                      key={category}
                      onClick={() => navigate(`/category/${encodeURIComponent(category)}`)}
                      className={`${color.bg} ${color.border} border-2 rounded-xl p-4 transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] text-right`}
                    >
                      <div className="space-y-3">
                        {/* Category Name and Amount */}
                        <div className="flex items-center justify-between">
                          <h3 className={`text-lg font-bold ${color.text}`}>{category}</h3>
                          <span className={`text-sm font-semibold ${color.text} opacity-75`}>
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                        
                        {/* Amount */}
                        <div className={`text-2xl font-bold ${color.text}`}>
                          {amount.toLocaleString('ar-EG')} <span className="text-base">ج.س</span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-white bg-opacity-50 rounded-full h-2">
                          <div
                            className={`${color.bar} h-2 rounded-full transition-all`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        
                        {/* View Details */}
                        <div className={`text-xs ${color.text} opacity-75 text-center pt-1`}>
                          اضغط لعرض التفاصيل ←
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-base font-bold text-gray-800">آخر المعاملات</h2>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-right font-semibold text-gray-700">التاريخ</th>
                  <th className="px-3 py-2 text-right font-semibold text-gray-700">الفئة</th>
                  <th className="px-3 py-2 text-right font-semibold text-gray-700">المبلغ</th>
                  <th className="px-3 py-2 text-right font-semibold text-gray-700">النوع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-8 text-center text-gray-400 text-xs">
                      لا توجد معاملات
                    </td>
                  </tr>
                ) : (
                  transactions.slice(0, 10).map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-gray-600">
                        {new Date(transaction.created_at).toLocaleDateString('ar-EG', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-3 py-2">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                          {transaction.category}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`font-semibold ${
                          transaction.transaction_type === 'expense' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {transaction.transaction_type === 'expense' ? '-' : '+'}
                          {transaction.amount.toLocaleString('ar-EG')}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`text-xs ${
                          transaction.transaction_type === 'expense' ? 'text-red-600' : 'text-green-600'
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
