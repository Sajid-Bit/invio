import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-arabic text-gray-800 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full relative z-10">
        <Header />
        <main className="flex-1 overflow-hidden p-6 relative">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl -z-10 pointer-events-none" />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
