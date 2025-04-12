
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface AchievementCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  unlocked?: boolean;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  icon: Icon,
  title,
  description,
  unlocked = true
}) => {
  return (
    <Card className={`${unlocked ? '' : 'opacity-50'}`}>
      <CardContent className="pt-6 flex flex-col items-center text-center">
        <div className={`p-3 rounded-full ${unlocked ? 'bg-golf-green-dark/10' : 'bg-gray-200'} mb-3`}>
          <Icon className={`h-6 w-6 ${unlocked ? 'text-golf-green-dark' : 'text-gray-500'}`} />
        </div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </CardContent>
    </Card>
  );
};

export default AchievementCard;
