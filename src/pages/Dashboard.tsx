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
    <div className="h-full flex flex-col">
      <div className="flex-1 grid grid-cols-2 gap-4 max-w-6xl mx-auto w-full">
        {/* Left Column - Stats and Table */}
        <div className="space-y-3 flex flex-col overflow-hidden">
          {/* Budget Alert */}
          {isOverBudget && (
            <BudgetAlert 
              message="تم تجاوز الموازنة اليومية المحددة، يرجى المراجعة"
            />
          )}
          
          {/* Budget Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">الموازنة المحددة</p>
              <p className="text-xl font-bold text-gray-800">
                {dailyBudget.toLocaleString('ar-EG')} <span className="text-sm text-gray-600">ج.س</span>
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">إجمالي مصروفات اليوم</p>
              <p className="text-xl font-bold text-gray-800">
                {dailyExpenses.toLocaleString('ar-EG')} <span className="text-sm text-gray-600">ج.س</span>
              </p>
            </div>
          </div>
          
          {/* Spending Bar */}
          <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-sm text-gray-600">نسبة الإنفاق</p>
              <p className="text-sm font-bold text-gray-800">{spendingPercentage.toFixed(0)}%</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${
                  isOverBudget ? 'bg-red-600' : 'bg-blue-600'
                }`}
                style={{ width: `${Math.min(spendingPercentage, 100)}%` }}
              />
            </div>
          </div>
          
          {/* Transactions Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
            <div className="p-3 border-b">
              <h3 className="text-base font-bold text-gray-800">سجل المصروفات</h3>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2.5 text-right font-semibold text-gray-700">المبلغ</th>
                    <th className="px-3 py-2.5 text-right font-semibold text-gray-700">الفئة</th>
                    <th className="px-3 py-2.5 text-right font-semibold text-gray-700">الشخص</th>
                    <th className="px-3 py-2.5 text-center font-semibold text-gray-700">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-3 py-8 text-center text-gray-400 text-sm">
                        لا توجد مصروفات حتى الآن
                      </td>
                    </tr>
                  ) : (
                    transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-2.5">
                          <span className={`text-base font-semibold ${
                            transaction.transaction_type === 'expense' ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {transaction.transaction_type === 'expense' ? '-' : '+'}
                            {transaction.amount.toLocaleString('ar-EG')}
                          </span>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded text-sm font-medium">
                            {transaction.category}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-gray-700 font-medium">
                          {transaction.person_name}
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleEdit(transaction)}
                              className="p-1.5 hover:bg-blue-50 text-blue-600 rounded transition-colors"
                              title="تعديل"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(transaction.id)}
                              className="p-1.5 hover:bg-red-50 text-red-600 rounded transition-colors"
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
        <div className="flex items-start">
          <AddTransactionForm />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
