import React from 'react';
import { Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-golf-green-dark text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6" />
          <h1 className="text-xl font-bold">SwingSight</h1>
        </div>
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-white hover:text-gray-200">
            Home
          </Link>
          <Link to="/challenges" className="text-white hover:text-gray-200">
            Challenges
          </Link>
          <Link to="/analysis" className="text-white hover:text-gray-200">
            Analysis
          </Link>
          <Link to="/profile" className="text-white hover:text-gray-200">
            Profile
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
