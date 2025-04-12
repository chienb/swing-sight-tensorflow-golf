
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Activity, HomeIcon, Trophy, User, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const navItems = [
    { icon: HomeIcon, label: 'Home', path: '/home' },
    { icon: Trophy, label: 'Challenges', path: '/challenges' },
    { icon: Activity, label: 'Swing Analysis', path: '/' },
    { icon: User, label: 'Profile', path: '/profile' }
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
          <div className="flex justify-around items-center h-16">
            {navItems.map((item) => (
              <button
                key={item.path}
                className={cn(
                  "flex flex-col items-center justify-center w-20 h-full",
                  isActive(item.path) ? "text-golf-green-dark" : "text-gray-500"
                )}
                onClick={() => navigate(item.path)}
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span className="text-xs">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}
      
      <Footer />
    </div>
  );
};

export default AppLayout;
