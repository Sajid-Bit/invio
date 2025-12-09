const Header = () => {
  const currentDate = new Date().toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="bg-white border-b px-4 py-2.5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-800">مرحباً بك</h2>
          <p className="text-xs text-gray-600">{currentDate}</p>
        </div>
        
      </div>
    </header>
  );
};

export default Header;
