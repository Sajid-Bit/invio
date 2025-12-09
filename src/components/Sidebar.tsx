import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const navItems = [
    {
      name: 'لوحة التحكم المالية',
      path: '/',
      icon: '📊',
    },
    {
      name: 'التقارير',
      path: '/reports',
      icon: '📈',
    },
    {
      name: 'إدارة المستخدمين',
      path: '/users',
      icon: '👥',
    },
    {
      name: 'الإعدادات',
      path: '/settings',
      icon: '⚙️',
    },
  ];

  return (
    <aside className="w-64 bg-white/80 backdrop-blur-xl border-l border-white/20 shadow-soft z-20 flex flex-col h-full transition-all duration-300">
      <div className="p-6 flex items-center justify-center border-b border-gray-100/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-xl shadow-lg shadow-primary-500/30 flex items-center justify-center text-white text-xl">
            💰
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
            المالية المدرسية
          </h1>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${isActive
                ? 'bg-primary-50 text-primary-700 shadow-sm font-bold'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-l-full" />
                )}
                <span className={`text-xl transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </span>
                <span className="relative z-10">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100/50">
        <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-4 text-white shadow-lg shadow-primary-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl" />
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-black/10 rounded-full -ml-8 -mb-8 blur-xl" />
          <p className="text-xs font-medium text-primary-100 mb-1">نسخة تجريبية</p>
          <p className="text-sm font-bold">الإصدار 1.0.0</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
