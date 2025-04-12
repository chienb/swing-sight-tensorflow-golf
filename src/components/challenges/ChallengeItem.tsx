
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

interface ChallengeItemProps {
  title: string;
  description: string;
  participants: number;
  progress?: string;
  rank?: string;
  isActive?: boolean;
  isCompleted?: boolean;
}

const ChallengeItem: React.FC<ChallengeItemProps> = ({
  title,
  description,
  participants,
  progress,
  rank,
  isActive,
  isCompleted
}) => {
  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-sm text-gray-500 mb-3">{description}</p>
        
        {!isCompleted && !isActive && (
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-1" />
            <span>Participants: {participants}</span>
          </div>
        )}
        
        {isActive && progress && (
          <div className="mb-3">
            <div className="text-sm text-gray-500 mb-1">{progress}</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-golf-green-dark h-2 rounded-full" 
                style={{ width: `${parseInt(progress) || 33}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {isCompleted && rank && (
          <div className="text-sm font-medium">
            Rank: <span className="text-golf-green-dark">{rank}</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {!isActive && !isCompleted && (
          <Button className="w-full bg-golf-green-dark hover:bg-golf-green-dark/90">
            Join Challenge
          </Button>
        )}
        
        {isActive && (
          <Button className="w-full">
            Continue
          </Button>
        )}
        
        {isCompleted && (
          <div className="flex w-full space-x-2">
            <Button variant="outline" className="flex-1">
              View Details
            </Button>
            <Button variant="outline" className="flex-1">
              Share
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ChallengeItem;
