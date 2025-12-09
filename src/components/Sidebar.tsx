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
    <aside className="w-56 bg-white shadow-lg">
      <div className="p-4 border-b">
        <h1 className="text-lg font-bold text-gray-800 text-center">المالية المدرسية</h1>
      </div>
      
      <nav className="p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 mb-1.5 rounded-lg transition-colors text-sm ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
