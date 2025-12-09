import { useState } from 'react';
import { Transaction } from '../store/useStore';
import { invoke } from '@tauri-apps/api/tauri';

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList = ({ transactions }: TransactionListProps) => {
  const [activeTab, setActiveTab] = useState<'day' | 'month' | 'person' | 'category'>('day');
  const [searchQuery, setSearchQuery] = useState('');

  const handleExportPDF = async () => {
    try {
      await invoke('export_transactions_pdf', {
        filter: {
          search_query: searchQuery || undefined,
          filter_type: activeTab,
          date: new Date().toISOString().split('T')[0],
        },
      });
      alert('سيتم تصدير PDF قريباً');
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold mb-4">جدول اليوم</h2>
        
        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('day')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            اليوم
          </button>
          <button
            onClick={() => setActiveTab('month')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            الشهر
          </button>
          <button
            onClick={() => setActiveTab('person')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'person' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            الشخص
          </button>
          <button
            onClick={() => setActiveTab('category')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'category' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            مخصص
          </button>
        </div>
        
        {/* Search and Export */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث باسم الشخص او الفئة"
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2">🔍</span>
          </div>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <span>تصدير pdf</span>
            <span>📥</span>
          </button>
          <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            فرز 🔄
          </button>
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">المبلغ</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">الفئة</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">السبب</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">الشخص</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  لا توجد معاملات اليوم
                </td>
              </tr>
            ) : (
              transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className={`font-semibold ${
                      transaction.transaction_type === 'expense' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {transaction.transaction_type === 'expense' ? '-' : '+'} {transaction.amount.toLocaleString('ar-EG')} ج.س
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{transaction.reason}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {transaction.person_avatar ? (
                        <img 
                          src={transaction.person_avatar} 
                          alt={transaction.person_name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-blue-700">
                            {transaction.person_name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <span className="text-sm font-medium">{transaction.person_name}</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;
