
import React from 'react';
import { Trophy, Zap, Calendar } from 'lucide-react';
import ChallengeCard from './ChallengeCard';
import QuickStat from './QuickStat';
import QuickActions from './QuickActions';

const mockChallenges = [
  { id: 1, title: 'Longest Drive', progress: '2/3 swings completed' },
  { id: 2, title: 'Swing Accuracy', progress: '1/5 swings completed' },
  { id: 3, title: 'Posture Perfect', progress: '3/3 swings completed', isActive: false },
];

const mockStats = [
  { id: 1, icon: Trophy, label: 'Challenges Completed', value: '5' },
  { id: 2, icon: Zap, label: 'Best Swing Speed', value: '90 mph' },
  { id: 3, icon: Calendar, label: 'Current Streak', value: '3 days' },
];

const HomePage: React.FC = () => {
  return (
    <div className="container py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Home</h1>
      
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Active Challenges</h2>
          <button className="text-sm text-golf-green-dark">See All</button>
        </div>
        <div className="flex overflow-x-auto pb-4 gap-4 -mx-4 px-4">
          {mockChallenges.map(challenge => (
            <ChallengeCard 
              key={challenge.id}
              title={challenge.title}
              progress={challenge.progress}
              isActive={challenge.isActive !== false}
            />
          ))}
        </div>
      </section>
      
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {mockStats.map(stat => (
            <QuickStat 
              key={stat.id}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
            />
          ))}
        </div>
      </section>
      
      <section>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <QuickActions />
      </section>
    </div>
  );
};

export default HomePage;
