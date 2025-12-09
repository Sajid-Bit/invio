import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import type { User, NewUser, UpdateUser } from '../store/useStore';

const Users = () => {
  const { users, userActivity, fetchUsers, fetchUserActivity, addUser, updateUser, deleteUser } = useStore();
  const [activeTab, setActiveTab] = useState<'الكل' | 'المشرفون' | 'المحاسبون' | 'المعلمون'>('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<NewUser & { status?: string }>({
    username: '',
    full_name: '',
    role: 'موظف',
    password: '',
    department: '',
    status: 'مفعل',
  });

  useEffect(() => {
    fetchUsers();
    fetchUserActivity();
  }, []);

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesTab = activeTab === 'الكل' || 
                      (activeTab === 'المشرفون' && user.role === 'مشرف') ||
                      (activeTab === 'المحاسبون' && user.role === 'محاسب') ||
                      (activeTab === 'المعلمون' && user.role === 'معلم');
    const matchesSearch = searchQuery === '' || 
                         user.username.includes(searchQuery) ||
                         user.full_name.includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  const handleSubmit = async () => {
    if (editingUser) {
      // Update existing user
      const updateData: UpdateUser = {
        full_name: formData.full_name !== editingUser.full_name ? formData.full_name : undefined,
        role: formData.role !== editingUser.role ? formData.role : undefined,
        department: formData.department !== editingUser.department ? formData.department : undefined,
        password: formData.password ? formData.password : undefined,
        status: formData.status !== editingUser.status ? formData.status : undefined,
      };
      await updateUser(editingUser.id, updateData);
      setEditingUser(null);
    } else {
      // Add new user
      await addUser(formData);
    }
    setShowAddForm(false);
    resetForm();
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      full_name: user.full_name,
      role: user.role,
      password: '',
      department: user.department || '',
      status: user.status,
    });
    setShowAddForm(true);
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === 'مفعل' ? 'معطل' : 'مفعل';
    await updateUser(user.id, { status: newStatus });
  };

  const resetForm = () => {
    setFormData({
      username: '',
      full_name: '',
      role: 'موظف',
      password: '',
      department: '',
      status: 'مفعل',
    });
  };

  return (
    <div className="h-full flex gap-4">
      {/* Left Side: User Form */}
      <div className="w-96 bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          {editingUser ? 'تعديل مستخدم' : 'إضافة/تعديل مستخدم'}
        </h2>
        
        <div className="flex-1 space-y-4 overflow-auto">
          <div>
            <label className="block text-xs text-gray-600 mb-1">المعلومات الأساسية</label>
            <input
              type="text"
              placeholder="اسم المستخدم"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              disabled={!!editingUser}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
            <p className="text-xs text-gray-400 mt-1">
              {editingUser ? 'لا يمكن تعديل اسم المستخدم' : 'استخدم حروف بدون سيقات (مثال: school.admin)'}
            </p>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">الاسم الكامل (اختياري)</label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">الدور</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="مشرف">مشرف</option>
              <option value="محاسب">محاسب</option>
              <option value="موظف">موظف</option>
              <option value="معلم">معلم</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">القسم</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-2">الحالة</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'مفعل' })}
                className={`flex-1 px-3 py-2 text-sm rounded-lg transition-all ${
                  formData.status === 'مفعل'
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                مفعل
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'معطل' })}
                className={`flex-1 px-3 py-2 text-sm rounded-lg transition-all ${
                  formData.status === 'معطل'
                    ? 'bg-red-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                معطل
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">كلمة المرور</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              {editingUser ? 'على الأقل 8 أحرف، تحتوي على رمز واحد وحرف' : 'على الأقل 8 أحرف، تحتوي على رمز واحد وحرف'}
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full mt-4 px-4 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium"
        >
          {editingUser ? 'تحديث المستخدم' : 'حفظ المستخدم'}
        </button>
        
        {editingUser && (
          <button
            onClick={() => {
              setEditingUser(null);
              setShowAddForm(false);
              resetForm();
            }}
            className="w-full mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            إلغاء
          </button>
        )}
      </div>

      {/* Right Side: Users List & Activity */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between">

        <div className="flex gap-2">
          {(['الكل', 'المشرفون', 'المحاسبون', 'المعلمون'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                activeTab === tab
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
          <div className="relative">
            <input
              type="text"
              placeholder="بحث بـ اسم المستخدم/الدور..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-1 pr-1 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-79.9"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Tabs */}

        {/* Users Table and Activity - Combined */}
        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-base font-bold text-gray-800">قائمة المستخدمين وسجل النشاط</h2>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">اسم المستخدم</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">الدور</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">الحالة</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center text-gray-400">
                      لا يوجد مستخدمون
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {user.full_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{user.username}</p>
                            <p className="text-xs text-gray-500">{user.full_name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all hover:shadow-md ${
                            user.status === 'مفعل'
                              ? 'bg-green-500 text-white hover:bg-green-600'
                              : 'bg-red-500 text-white hover:bg-red-600'
                          }`}
                        >
                          {user.status}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-1.5 hover:bg-blue-50 rounded transition-colors"
                            title="تعديل"
                          >
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            className="p-1.5 hover:bg-gray-50 rounded transition-colors"
                            title="صلاحيات"
                          >
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="p-1.5 hover:bg-red-50 rounded transition-colors"
                            title="حذف"
                          >
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    </div>
  );
};

export default Users;
