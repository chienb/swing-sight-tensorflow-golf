import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Button } from './button';

interface UpsellBannerProps {
  className?: string;
}

const UpsellBanner: React.FC<UpsellBannerProps> = ({ className }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`bg-blue-50 rounded-lg overflow-hidden shadow-sm ${className}`}>
      <div 
        className="p-3 flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <Info className="h-5 w-5 text-blue-600 mr-2" />
          <p className="text-blue-700 font-medium">Want more accurate data? Check out Foresight Sports hardware.</p>
        </div>
        <div>
          {isExpanded ? 
            <ChevronUp className="h-5 w-5 text-blue-600" /> : 
            <ChevronDown className="h-5 w-5 text-blue-600" />
          }
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 border-t border-blue-100">
          <h4 className="font-semibold text-gray-800 mb-3">App vs. Foresight Sports Hardware</h4>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-100">
                  <th className="p-2 text-left">Metric</th>
                  <th className="p-2 text-left">App Estimate</th>
                  <th className="p-2 text-left">Foresight Hardware</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-blue-100">
                  <td className="p-2 font-medium">Swing Speed</td>
                  <td className="p-2">±10 mph accuracy</td>
                  <td className="p-2 text-green-600">±0.5 mph accuracy</td>
                </tr>
                <tr className="border-b border-blue-100">
                  <td className="p-2 font-medium">Launch Angle</td>
                  <td className="p-2">±5° accuracy</td>
                  <td className="p-2 text-green-600">±0.2° accuracy</td>
                </tr>
                <tr className="border-b border-blue-100">
                  <td className="p-2 font-medium">Ball Spin</td>
                  <td className="p-2">Not available</td>
                  <td className="p-2 text-green-600">Precise measurement</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Club Path</td>
                  <td className="p-2">Estimated</td>
                  <td className="p-2 text-green-600">Exact measurement</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-4">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Learn More About Foresight Sports
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpsellBanner;
