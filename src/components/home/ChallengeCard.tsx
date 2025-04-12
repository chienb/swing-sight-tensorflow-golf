
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, ArrowRight } from 'lucide-react';

interface ChallengeCardProps {
  title: string;
  progress: string;
  isActive?: boolean;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ 
  title, 
  progress, 
  isActive = true
}) => {
  return (
    <Card className="w-[250px] flex-shrink-0">
      <CardContent className="pt-6">
        <div className="flex items-start mb-2">
          <Trophy className="h-5 w-5 text-golf-green-dark mr-2" />
          <h3 className="font-semibold">{title}</h3>
        </div>
        <p className="text-sm text-gray-500">{progress}</p>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          size="sm"
        >
          {isActive ? 'Continue' : 'View'}
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ChallengeCard;
