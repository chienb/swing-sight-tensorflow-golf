import React from 'react';
import MobileNavigation from './MobileNavigation';

const Footer = () => {
  return (
    <>
      <MobileNavigation />
      <footer className="bg-golf-green-dark text-white py-2 text-center text-sm md:block hidden">
        <p> 2025 SwingSight Golf Analyzer</p>
      </footer>
    </>
  );
};

export default Footer;
