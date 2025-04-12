
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
      <Button 
        className="bg-golf-green-dark hover:bg-golf-green-dark/90 w-full sm:w-auto"
        onClick={() => navigate('/challenges')}
      >
        <Plus className="mr-2 h-4 w-4" />
        Start New Challenge
      </Button>
      
      <Button 
        variant="outline" 
        className="w-full sm:w-auto"
        onClick={() => navigate('/')}
      >
        <Activity className="mr-2 h-4 w-4" />
        Analyze Swing
      </Button>
    </div>
  );
};

export default QuickActions;
