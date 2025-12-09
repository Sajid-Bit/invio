import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

const CategoryDetails = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { transactions, fetchTransactions } = useStore();
  const decodedCategory = decodeURIComponent(category || '');

  useEffect(() => {
    fetchTransactions();
  }, []);

  // تصفية المعاملات حسب الفئة
  const categoryTransactions = transactions.filter(
    (t) => t.category === decodedCategory && t.transaction_type === 'expense'
  );

  // حساب الإحصائيات
  const totalAmount = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
  const transactionCount = categoryTransactions.length;
  const averageAmount = transactionCount > 0 ? totalAmount / transactionCount : 0;
  const maxAmount = transactionCount > 0 ? Math.max(...categoryTransactions.map(t => t.amount)) : 0;
  const minAmount = transactionCount > 0 ? Math.min(...categoryTransactions.map(t => t.amount)) : 0;

  // تجميع حسب الأشخاص
  const personStats = categoryTransactions.reduce((acc, t) => {
    acc[t.person_name] = (acc[t.person_name] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const topPersons = Object.entries(personStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/reports')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="رجوع"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            تفاصيل الفئة: {decodedCategory}
          </h1>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">إجمالي المصروفات</p>
          <p className="text-xl font-bold text-red-600">
            {totalAmount.toLocaleString('ar-EG')} <span className="text-sm">ج.س</span>
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">عدد المعاملات</p>
          <p className="text-xl font-bold text-blue-600">
            {transactionCount}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">متوسط المبلغ</p>
          <p className="text-xl font-bold text-purple-600">
            {averageAmount.toLocaleString('ar-EG')} <span className="text-sm">ج.س</span>
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">أعلى مصروف</p>
          <p className="text-xl font-bold text-orange-600">
            {maxAmount.toLocaleString('ar-EG')} <span className="text-sm">ج.س</span>
          </p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="flex-1 grid grid-cols-3 gap-4 overflow-hidden">
        {/* Top Persons */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-base font-bold text-gray-800">أكثر المستفيدين</h2>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {topPersons.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-8">لا توجد بيانات</p>
            ) : (
              <div className="space-y-3">
                {topPersons.map(([person, amount], index) => {
                  const percentage = (amount / totalAmount) * 100;
                  const colors = ['bg-yellow-500', 'bg-gray-400', 'bg-orange-600'];
                  return (
                    <div key={person} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 ${colors[index]} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 text-sm">{person}</p>
                          <p className="text-xs text-gray-500">
                            {amount.toLocaleString('ar-EG')} ج.س ({percentage.toFixed(1)}%)
                          </p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mr-8">
                        <div
                          className={`${colors[index]} h-1.5 rounded-full transition-all`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-base font-bold text-gray-800">جميع معاملات الفئة</h2>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">التاريخ</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">اسم الشخص</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">السبب</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">المبلغ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categoryTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center text-gray-400">
                      لا توجد معاملات في هذه الفئة
                    </td>
                  </tr>
                ) : (
                  categoryTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(transaction.created_at).toLocaleDateString('ar-EG', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {transaction.person_name.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-800">
                            {transaction.person_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {transaction.reason}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-red-600">
                          {transaction.amount.toLocaleString('ar-EG')} ج.س
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

export default CategoryDetails;
