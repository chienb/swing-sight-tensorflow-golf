
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface QuickStatProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

const QuickStat: React.FC<QuickStatProps> = ({ icon: Icon, label, value }) => {
  return (
    <Card>
      <CardContent className="py-4 flex flex-col items-center justify-center">
        <Icon className="h-6 w-6 text-golf-green-dark mb-2" />
        <p className="text-lg font-bold">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </CardContent>
    </Card>
  );
};

export default QuickStat;
