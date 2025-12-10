import { useEffect } from 'react';
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

  // تجميع حسب الأشخاص
  const personStats = categoryTransactions.reduce((acc, t) => {
    acc[t.person_name] = (acc[t.person_name] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const topPersons = Object.entries(personStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/reports')}
            className="p-3 bg-white/50 hover:bg-white text-gray-600 rounded-xl transition-all shadow-sm hover:shadow-md border border-white/40"
            title="رجوع"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              تفاصيل الفئة: <span className="text-primary-600">{decodedCategory}</span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">تحليل مفصل للمصروفات في هذه الفئة</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-5 border border-white/40 shadow-soft relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full -mr-12 -mt-12 blur-xl group-hover:bg-red-500/10 transition-all" />
          <p className="text-sm font-bold text-gray-500 mb-2 relative z-10">إجمالي المصروفات</p>
          <p className="text-2xl font-bold text-red-600 tracking-tight relative z-10">
            {totalAmount.toLocaleString('ar-EG')} <span className="text-sm text-red-400">ج.س</span>
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-5 border border-white/40 shadow-soft relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-12 -mt-12 blur-xl group-hover:bg-blue-500/10 transition-all" />
          <p className="text-sm font-bold text-gray-500 mb-2 relative z-10">عدد المعاملات</p>
          <p className="text-2xl font-bold text-blue-600 tracking-tight relative z-10">
            {transactionCount}
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-5 border border-white/40 shadow-soft relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full -mr-12 -mt-12 blur-xl group-hover:bg-purple-500/10 transition-all" />
          <p className="text-sm font-bold text-gray-500 mb-2 relative z-10">متوسط المبلغ</p>
          <p className="text-2xl font-bold text-purple-600 tracking-tight relative z-10">
            {averageAmount.toLocaleString('ar-EG')} <span className="text-sm text-purple-400">ج.س</span>
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-5 border border-white/40 shadow-soft relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full -mr-12 -mt-12 blur-xl group-hover:bg-orange-500/10 transition-all" />
          <p className="text-sm font-bold text-gray-500 mb-2 relative z-10">أعلى مصروف</p>
          <p className="text-2xl font-bold text-orange-600 tracking-tight relative z-10">
            {maxAmount.toLocaleString('ar-EG')} <span className="text-sm text-orange-400">ج.س</span>
          </p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="flex-1 grid grid-cols-3 gap-6 overflow-hidden">
        {/* Top Persons */}
        <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-soft border border-white/40 flex flex-col overflow-hidden">
          <div className="p-5 border-b border-gray-100/50">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              أكثر المستفيدين
            </h2>
          </div>
          <div className="flex-1 overflow-auto custom-scrollbar p-5">
            {topPersons.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="font-medium">لا توجد بيانات</p>
              </div>
            ) : (
              <div className="space-y-4">
                {topPersons.map(([person, amount], index) => {
                  const percentage = (amount / totalAmount) * 100;
                  const colors = ['bg-yellow-500', 'bg-gray-400', 'bg-orange-600'];
                  const textColors = ['text-yellow-600', 'text-gray-600', 'text-orange-700'];

                  return (
                    <div key={person} className="space-y-2 group">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${colors[index]} rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm group-hover:scale-110 transition-transform`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-800 text-sm">{person}</p>
                          <p className="text-xs font-bold text-gray-500">
                            {amount.toLocaleString('ar-EG')} ج.س ({percentage.toFixed(1)}%)
                          </p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 mr-11">
                        <div
                          className={`${colors[index]} h-full rounded-full transition-all duration-1000 ease-out`}
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
        <div className="col-span-2 bg-white/60 backdrop-blur-xl rounded-2xl shadow-soft border border-white/40 flex flex-col overflow-hidden">
          <div className="p-5 border-b border-gray-100/50">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              جميع معاملات الفئة
            </h2>
          </div>
          <div className="flex-1 overflow-auto custom-scrollbar p-2">
            <table className="w-full text-sm border-separate border-spacing-y-2">
              <thead className="sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-right font-bold text-gray-400 text-xs uppercase tracking-wider bg-gray-50/90 backdrop-blur rounded-r-xl">التاريخ</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-400 text-xs uppercase tracking-wider bg-gray-50/90 backdrop-blur">اسم الشخص</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-400 text-xs uppercase tracking-wider bg-gray-50/90 backdrop-blur">السبب</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-400 text-xs uppercase tracking-wider bg-gray-50/90 backdrop-blur rounded-l-xl">المبلغ</th>
                </tr>
              </thead>
              <tbody className="px-2">
                {categoryTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                          <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                        </div>
                        <p className="font-medium">لا توجد معاملات في هذه الفئة</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  categoryTransactions.map((transaction) => (
                    <tr key={transaction.id} className="group hover:-translate-y-0.5 transition-all duration-200">
                      <td className="px-4 py-3 bg-white rounded-r-xl border-y border-r border-gray-100 group-hover:border-primary-100 group-hover:shadow-sm transition-all text-gray-600 font-medium">
                        {new Date(transaction.created_at).toLocaleDateString('ar-EG', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-4 py-3 bg-white border-y border-gray-100 group-hover:border-primary-100 group-hover:shadow-sm transition-all">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-700 text-xs font-bold">
                            {transaction.person_name.charAt(0)}
                          </div>
                          <span className="font-bold text-gray-700">
                            {transaction.person_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 bg-white border-y border-gray-100 group-hover:border-primary-100 group-hover:shadow-sm transition-all text-gray-600">
                        {transaction.reason}
                      </td>
                      <td className="px-4 py-3 bg-white rounded-l-xl border-y border-l border-gray-100 group-hover:border-primary-100 group-hover:shadow-sm transition-all">
                        <span className="font-bold text-red-500">
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
