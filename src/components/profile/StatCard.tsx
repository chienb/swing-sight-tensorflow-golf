
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  label: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value }) => {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="text-lg font-bold">{value}</div>
        <div className="text-xs text-gray-500">{label}</div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
