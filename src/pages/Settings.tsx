const Settings = () => {
  return (
    <div className="h-full flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-800 tracking-tight">الإعدادات ⚙️</h1>

      <div className="flex-1 bg-white/60 backdrop-blur-xl rounded-2xl shadow-soft border border-white/40 flex flex-col items-center justify-center relative overflow-hidden group">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl group-hover:bg-primary-500/10 transition-all duration-700" />

        <div className="relative z-10 text-center space-y-4">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center text-4xl shadow-inner mx-auto animate-bounce">
            🛠️
          </div>
          <h2 className="text-2xl font-bold text-gray-800">صفحة الإعدادات قيد التطوير</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            نعمل حالياً على إضافة المزيد من خيارات التخصيص والتحكم في النظام. ستكون متاحة قريباً!
          </p>
          <button className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
            إعلامي عند الإطلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
