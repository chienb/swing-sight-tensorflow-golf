
import React from 'react';
import { Activity, Menu, User, HomeIcon, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
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
    <header className="bg-golf-green-dark text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6" />
          <h1 className="text-xl font-bold">SwingSight</h1>
        </div>
        
        {!isMobile && (
          <div className="flex items-center gap-4">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                className={`text-white hover:bg-golf-green-light/30 ${isActive(item.path) ? 'bg-golf-green-light/30' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-white">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
