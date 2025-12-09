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
    <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 h-full flex flex-col">
      <h2 className="text-lg font-bold mb-4 text-center text-gray-800">
        {editingId ? 'تعديل منصرف' : 'إضافة منصرف'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-3 flex-1 flex flex-col">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              المبلغ
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              الفئة
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">اختر الفئة</option>
              <option value="أدوات مكتبية">أدوات مكتبية</option>
              <option value="صيانة">صيانة</option>
              <option value="كهرباء">كهرباء</option>
              <option value="مياه">مياه</option>
              <option value="رواتب">رواتب</option>
              <option value="أخرى">أخرى</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            السبب
          </label>
          <input
            type="text"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            placeholder="شراء أجهزة الطباعة"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            اسم الشخص
          </label>
          <input
            type="text"
            value={formData.person_name}
            onChange={(e) => setFormData({ ...formData, person_name: e.target.value })}
            placeholder="اسم الشخص"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex-1 flex items-end gap-2">
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
              className="px-4 bg-gray-200 text-gray-700 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-300 transition-colors"
            >
              إلغاء
            </button>
          )}
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-600 transition-colors shadow-sm hover:shadow-md"
          >
            {editingId ? 'تحديث' : 'حفظ'} المنصرف
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTransactionForm;
