import { useState, useEffect } from 'react';
import { useStore, Transaction } from '../store/useStore';

const AddTransactionForm = () => {
  const { addTransaction } = useStore();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    person_name: '',
    category: '',
    amount: '',
    transaction_type: 'expense' as 'income' | 'expense',
    reason: '',
  });

  // الاستماع لحدث التعديل
  useEffect(() => {
    const handleEditEvent = (event: CustomEvent) => {
      const transaction = event.detail as Transaction;
      setFormData({
        person_name: transaction.person_name,
        category: transaction.category,
        amount: transaction.amount.toString(),
        transaction_type: transaction.transaction_type,
        reason: transaction.reason,
      });
      setEditingId(transaction.id);
    };

    window.addEventListener('editTransaction', handleEditEvent as EventListener);
    return () => {
      window.removeEventListener('editTransaction', handleEditEvent as EventListener);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || !formData.person_name || !formData.category || !formData.reason) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    await addTransaction({
      person_name: formData.person_name,
      category: formData.category,
      amount: parseFloat(formData.amount),
      transaction_type: formData.transaction_type,
      reason: formData.reason,
      responsible_person: undefined,
    });

    // Reset form
    setFormData({
      person_name: '',
      category: '',
      amount: '',
      transaction_type: 'expense',
      reason: '',
    });
    setEditingId(null);
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-soft p-6 border border-white/20 h-full flex flex-col relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full -mr-16 -mt-16 blur-2xl transition-all group-hover:bg-primary-500/10" />

      <h2 className="text-xl font-bold mb-6 text-center text-gray-800 relative z-10 flex items-center justify-center gap-2">
        {editingId ? (
          <>
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>تعديل منصرف</span>
          </>
        ) : (
          <>
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>إضافة منصرف</span>
          </>
        )}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col relative z-10">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
              المبلغ
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-bold text-lg text-gray-800 placeholder-gray-300"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">ج.س</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
              الفئة
            </label>
            <div className="relative">
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all appearance-none text-gray-700 font-medium"
              >
                <option value="">اختر الفئة</option>
                <option value="أدوات مكتبية">أدوات مكتبية</option>
                <option value="صيانة">صيانة</option>
                <option value="كهرباء">كهرباء</option>
                <option value="مياه">مياه</option>
                <option value="رواتب">رواتب</option>
                <option value="أخرى">أخرى</option>
              </select>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
            السبب
          </label>
          <input
            type="text"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            placeholder="مثال: شراء أجهزة طباعة"
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-gray-700 placeholder-gray-300"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
            المستفيد / المسؤول
          </label>
          <input
            type="text"
            value={formData.person_name}
            onChange={(e) => setFormData({ ...formData, person_name: e.target.value })}
            placeholder="اسم الشخص"
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-gray-700 placeholder-gray-300"
          />
        </div>

        <div className="flex-1 flex items-end gap-3 mt-4">
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setFormData({
                  person_name: '',
                  category: '',
                  amount: '',
                  transaction_type: 'expense',
                  reason: '',
                });
                setEditingId(null);
              }}
              className="px-5 py-3 rounded-xl font-bold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
            >
              إلغاء
            </button>
          )}
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-primary-600 to-primary-500 text-white py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {editingId ? (
              <>
                <span>تحديث البيانات</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </>
            ) : (
              <>
                <span>حفظ المنصرف</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTransactionForm;
