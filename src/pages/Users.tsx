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
    <div className="h-full flex gap-6">
      {/* Left Side: User Form */}
      <div className="w-96 bg-white/80 backdrop-blur-xl rounded-2xl shadow-soft border border-white/20 p-6 flex flex-col relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full -mr-16 -mt-16 blur-2xl transition-all group-hover:bg-primary-500/10" />

        <h2 className="text-xl font-bold text-gray-800 mb-6 relative z-10 flex items-center gap-2">
          <span>{editingUser ? '✏️' : '👤'}</span>
          {editingUser ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'}
        </h2>

        <div className="flex-1 space-y-5 overflow-auto custom-scrollbar relative z-10 p-1">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">المعلومات الأساسية</label>
            <input
              type="text"
              placeholder="اسم المستخدم"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              disabled={!!editingUser}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all disabled:bg-gray-50 disabled:text-gray-400 font-medium"
            />
            <p className="text-[10px] text-gray-400 px-1">
              {editingUser ? 'لا يمكن تعديل اسم المستخدم' : 'استخدم حروف إنجليزية (مثال: school.admin)'}
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">الاسم الكامل</label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">الدور الوظيفي</label>
            <div className="relative">
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all appearance-none font-medium text-gray-700"
              >
                <option value="مشرف">مشرف</option>
                <option value="محاسب">محاسب</option>
                <option value="موظف">موظف</option>
                <option value="معلم">معلم</option>
              </select>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">القسم</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">حالة الحساب</label>
            <div className="flex bg-gray-100/50 p-1 rounded-xl border border-gray-200/50">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'مفعل' })}
                className={`flex-1 px-3 py-2 text-sm rounded-lg transition-all font-bold ${formData.status === 'مفعل'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                مفعل
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'معطل' })}
                className={`flex-1 px-3 py-2 text-sm rounded-lg transition-all font-bold ${formData.status === 'معطل'
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                معطل
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">كلمة المرور</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
            />
          </div>
        </div>

        <div className="mt-6 space-y-3 relative z-10">
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl hover:shadow-lg hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all active:scale-95 font-bold text-sm flex items-center justify-center gap-2"
          >
            <span>{editingUser ? 'تحديث البيانات' : 'حفظ المستخدم'}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>

          {editingUser && (
            <button
              onClick={() => {
                setEditingUser(null);
                resetForm();
              }}
              className="w-full py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all font-bold text-sm"
            >
              إلغاء
            </button>
          )}
        </div>
      </div>

      {/* Right Side: Users List & Activity */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2 bg-white/50 backdrop-blur p-1 rounded-xl border border-white/40 shadow-sm">
            {(['الكل', 'المشرفون', 'المحاسبون', 'المعلمون'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm rounded-lg transition-all font-bold ${activeTab === tab
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative group">
            <input
              type="text"
              placeholder="بحث..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4 pr-10 py-2.5 text-sm bg-white/80 border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-all w-64 shadow-sm"
            />
            <svg className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 group-focus-within:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Users Table */}
        <div className="flex-1 bg-white/60 backdrop-blur-xl rounded-2xl shadow-soft border border-white/40 flex flex-col overflow-hidden">
          <div className="p-5 border-b border-gray-100/50">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span>👥</span>
              قائمة المستخدمين
            </h2>
          </div>
          <div className="flex-1 overflow-auto custom-scrollbar p-2">
            <table className="w-full text-sm border-separate border-spacing-y-2">
              <thead className="sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-right font-bold text-gray-400 text-xs uppercase tracking-wider bg-gray-50/90 backdrop-blur rounded-r-xl">المستخدم</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-400 text-xs uppercase tracking-wider bg-gray-50/90 backdrop-blur">الدور</th>
                  <th className="px-4 py-3 text-right font-bold text-gray-400 text-xs uppercase tracking-wider bg-gray-50/90 backdrop-blur">الحالة</th>
                  <th className="px-4 py-3 text-center font-bold text-gray-400 text-xs uppercase tracking-wider bg-gray-50/90 backdrop-blur rounded-l-xl">إجراءات</th>
                </tr>
              </thead>
              <tbody className="px-2">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-4xl opacity-50">🔍</span>
                        <p className="font-medium">لا يوجد مستخدمون مطابقون للبحث</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="group hover:-translate-y-0.5 transition-all duration-200">
                      <td className="px-4 py-3 bg-white rounded-r-xl border-y border-r border-gray-100 group-hover:border-primary-100 group-hover:shadow-sm transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center text-primary-700 font-bold shadow-sm">
                            {user.full_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{user.username}</p>
                            <p className="text-xs font-medium text-gray-500">{user.full_name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 bg-white border-y border-gray-100 group-hover:border-primary-100 group-hover:shadow-sm transition-all">
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold border border-gray-200">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 bg-white border-y border-gray-100 group-hover:border-primary-100 group-hover:shadow-sm transition-all">
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${user.status === 'مفعل'
                            ? 'bg-green-50 text-green-600 hover:bg-green-100'
                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                            }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'مفعل' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            {user.status}
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-3 bg-white rounded-l-xl border-y border-l border-gray-100 group-hover:border-primary-100 group-hover:shadow-sm transition-all">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-2 hover:bg-primary-50 text-primary-600 rounded-lg transition-colors"
                            title="تعديل"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteUser(user.id)}
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
    </div>
  );
};

export default Users;
