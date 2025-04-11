
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GolfClub, Activity, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <GolfClub className="h-4 w-4 mr-2 text-golf-green-dark" />
            Swings Recorded
          </CardTitle>
          <CardDescription>This week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Activity className="h-4 w-4 mr-2 text-golf-green-dark" />
            Average Swing Speed
          </CardTitle>
          <CardDescription>Last 5 swings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">85 mph</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-golf-green-dark" />
            Training Streak
          </CardTitle>
          <CardDescription>Consecutive days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
