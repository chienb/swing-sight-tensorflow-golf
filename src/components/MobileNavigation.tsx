import React from 'react';
import { Home, Trophy, BarChart2, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const MobileNavigation = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-golf-green-dark text-white py-2 px-4 shadow-lg">
      <div className="container mx-auto">
        <div className="flex justify-around items-center">
          <Link to="/" className="flex flex-col items-center gap-1">
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link to="/challenges" className="flex flex-col items-center gap-1">
            <Trophy className="h-5 w-5" />
            <span className="text-xs">Challenges</span>
          </Link>
          <Link to="/analysis" className="flex flex-col items-center gap-1">
            <BarChart2 className="h-5 w-5" />
            <span className="text-xs">Analysis</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center gap-1">
            <User className="h-5 w-5" />
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default MobileNavigation;
