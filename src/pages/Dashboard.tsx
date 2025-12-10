import { useEffect } from 'react';
import { useStore, Transaction } from '../store/useStore';
import AddTransactionForm from '../components/AddTransactionForm';
import BudgetAlert from '../components/BudgetAlert';

const Dashboard = () => {
  const {
    dailyBudget,
    dailyExpenses,
    transactions,
    fetchDailyStats,
    fetchTransactions,
    deleteTransaction
  } = useStore();

  useEffect(() => {
    fetchDailyStats();
    fetchTransactions();
  }, []);

  const handleEdit = (transaction: Transaction) => {
    // سيتم تمرير البيانات للنموذج
    const editEvent = new CustomEvent('editTransaction', { detail: transaction });
    window.dispatchEvent(editEvent);
  };

  const handleDelete = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا المنصرف؟')) {
      await deleteTransaction(id);
    }
  };

  const spendingPercentage = dailyBudget > 0
    ? (dailyExpenses / dailyBudget) * 100
    : 0;

  const isOverBudget = dailyExpenses > dailyBudget;

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex-1 grid grid-cols-12 gap-6 max-w-7xl mx-auto w-full h-full">
        {/* Left Column - Stats and Table */}
        <div className="col-span-8 flex flex-col gap-6 overflow-hidden">
          {/* Budget Alert */}
          {isOverBudget && (
            <BudgetAlert
              message="تم تجاوز الموازنة اليومية المحددة، يرجى المراجعة"
            />
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-5 border border-white/40 shadow-soft relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/10 rounded-full -mr-12 -mt-12 blur-xl group-hover:bg-primary-500/20 transition-all" />
              <p className="text-sm font-bold text-gray-500 mb-2 relative z-10">الموازنة المحددة</p>
              <div className="flex items-baseline gap-1 relative z-10">
                <p className="text-3xl font-bold text-gray-800 tracking-tight">
                  {dailyBudget.toLocaleString('ar-EG')}
                </p>
                <span className="text-sm font-bold text-gray-400">ج.س</span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs font-bold text-primary-600 bg-primary-50 w-fit px-2 py-1 rounded-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
                <span>الميزانية اليومية</span>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-5 border border-white/40 shadow-soft relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-secondary-500/10 rounded-full -mr-12 -mt-12 blur-xl group-hover:bg-secondary-500/20 transition-all" />
              <p className="text-sm font-bold text-gray-500 mb-2 relative z-10">إجمالي المصروفات</p>
              <div className="flex items-baseline gap-1 relative z-10">
                <p className="text-3xl font-bold text-gray-800 tracking-tight">
                  {dailyExpenses.toLocaleString('ar-EG')}
                </p>
                <span className="text-sm font-bold text-gray-400">ج.س</span>
              </div>
              <div className={`mt-4 flex items-center gap-2 text-xs font-bold w-fit px-2 py-1 rounded-lg ${isOverBudget ? 'text-red-600 bg-red-50' : 'text-secondary-600 bg-secondary-50'
                }`}>
                {isOverBudget ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                )}
                <span>{isOverBudget ? 'تجاوز الميزانية' : 'في الحدود الآمنة'}</span>
              </div>
            </div>
          </div>

          {/* Spending Bar */}
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/40 shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">مؤشر الإنفاق</p>
                  <p className="text-[10px] text-gray-500">نسبة الاستهلاك من الميزانية</p>
                </div>
              </div>
              <p className={`text-lg font-bold ${isOverBudget ? 'text-red-600' : 'text-primary-600'}`}>
                {spendingPercentage.toFixed(0)}%
              </p>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out relative ${isOverBudget
                  ? 'bg-gradient-to-r from-red-500 to-red-600'
                  : 'bg-gradient-to-r from-primary-500 to-primary-600'
                  }`}
                style={{ width: `${Math.min(spendingPercentage, 100)}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-soft border border-white/40 flex-1 overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100/50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                سجل المصروفات
              </h3>
              <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                {transactions.length} معاملة
              </span>
            </div>
            <div className="flex-1 overflow-auto custom-scrollbar p-2">
              <table className="w-full text-sm border-separate border-spacing-y-2">
                <thead className="sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-right font-bold text-gray-400 text-xs uppercase tracking-wider bg-gray-50/90 backdrop-blur rounded-r-xl">المبلغ</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-400 text-xs uppercase tracking-wider bg-gray-50/90 backdrop-blur">الفئة</th>
                    <th className="px-4 py-3 text-right font-bold text-gray-400 text-xs uppercase tracking-wider bg-gray-50/90 backdrop-blur">الشخص</th>
                    <th className="px-4 py-3 text-center font-bold text-gray-400 text-xs uppercase tracking-wider bg-gray-50/90 backdrop-blur rounded-l-xl">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="px-2">
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-12 text-center text-gray-400">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                          </div>
                          <p className="font-medium">لا توجد مصروفات حتى الآن</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    transactions.map((transaction) => (
                      <tr key={transaction.id} className="group hover:-translate-y-0.5 transition-all duration-200">
                        <td className="px-4 py-3 bg-white rounded-r-xl border-y border-r border-gray-100 group-hover:border-primary-100 group-hover:shadow-sm transition-all">
                          <span className={`text-base font-bold ${transaction.transaction_type === 'expense' ? 'text-red-500' : 'text-green-500'
                            }`}>
                            {transaction.transaction_type === 'expense' ? '-' : '+'}
                            {transaction.amount.toLocaleString('ar-EG')}
                          </span>
                        </td>
                        <td className="px-4 py-3 bg-white border-y border-gray-100 group-hover:border-primary-100 group-hover:shadow-sm transition-all">
                          <span className="px-2.5 py-1 bg-primary-50 text-primary-700 rounded-lg text-xs font-bold border border-primary-100">
                            {transaction.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 bg-white border-y border-gray-100 group-hover:border-primary-100 group-hover:shadow-sm transition-all">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                              {transaction.person_name.charAt(0)}
                            </div>
                            <span className="font-bold text-gray-700">{transaction.person_name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 bg-white rounded-l-xl border-y border-l border-gray-100 group-hover:border-primary-100 group-hover:shadow-sm transition-all">
                          <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEdit(transaction)}
                              className="p-2 hover:bg-primary-50 text-primary-600 rounded-lg transition-colors"
                              title="تعديل"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(transaction.id)}
                              className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                              title="حذف"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="col-span-4 h-full">
          <AddTransactionForm />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
