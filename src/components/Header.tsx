const Header = () => {
  const currentDate = new Date().toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="px-8 py-5 flex items-center justify-between z-20">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">مرحباً بك 👋</h2>
        <p className="text-sm text-gray-500 mt-1 font-medium">{currentDate}</p>
      </div>

      <div className="flex items-center gap-4">
        <button className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center text-gray-400 hover:text-primary-600 hover:shadow-md transition-all relative">
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>

        <div className="flex items-center gap-3 pl-2 pr-1 py-1 bg-white rounded-full shadow-soft border border-gray-100">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold shadow-md shadow-primary-500/20">
            A
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-700 leading-none">المسؤول</p>
            <p className="text-[10px] text-gray-400 font-medium mt-0.5">admin@school.com</p>
          </div>
          <div className="w-8 h-8 flex items-center justify-center text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
