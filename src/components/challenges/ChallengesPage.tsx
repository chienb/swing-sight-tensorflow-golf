import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import ChallengeItem from './ChallengeItem';

const mockAvailableChallenges = [
  {
    id: 1,
    title: 'Most Consistent Swing',
    description: 'Achieve the same swing angle over 5 swings',
    participants: 42
  },
  {
    id: 2,
    title: 'Power Drive Challenge',
    description: 'Achieve the highest swing speed in 3 attempts',
    participants: 28
  },
  {
    id: 3,
    title: 'Perfect Posture',
    description: 'Maintain ideal posture throughout your swing',
    participants: 17
  }
];

const mockActiveChallenges = [
  {
    id: 1,
    title: 'Longest Drive',
    description: 'Record your longest drive distance',
    participants: 64,
    progress: '66%'
  },
  {
    id: 2,
    title: 'Swing Form Master',
    description: 'Perfect your swing form with this 5-day challenge',
    participants: 31,
    progress: '33%'
  }
];

const mockCompletedChallenges = [
  {
    id: 1,
    title: 'Weekly Speed Challenge',
    description: 'Achieve highest swing speed over 3 swings',
    participants: 86,
    rank: '3rd',
    hasPrecisionData: true
  },
  {
    id: 2,
    title: 'Precision Swing',
    description: 'Hit the most accurate shot at a target',
    participants: 52,
    rank: '1st',
    hasPrecisionData: false
  }
];

const ChallengesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredAvailableChallenges = mockAvailableChallenges.filter(challenge => 
    challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    challenge.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="container py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Challenges</h1>
        <Button className="bg-golf-green-dark hover:bg-golf-green-dark/90 rounded-full p-2 h-10 w-10">
          <Plus className="h-5 w-5" />
        </Button>
      </div>
      
      <Tabs defaultValue="available" className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-6">
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="available">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              className="pl-9"
              placeholder="Search challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {filteredAvailableChallenges.map(challenge => (
            <ChallengeItem
              key={challenge.id}
              title={challenge.title}
              description={challenge.description}
              participants={challenge.participants}
            />
          ))}
        </TabsContent>
        
        <TabsContent value="active">
          {mockActiveChallenges.map(challenge => (
            <ChallengeItem
              key={challenge.id}
              title={challenge.title}
              description={challenge.description}
              participants={challenge.participants}
              progress={challenge.progress}
              isActive={true}
            />
          ))}
        </TabsContent>
        
        <TabsContent value="completed">
          {mockCompletedChallenges.map(challenge => (
            <ChallengeItem
              key={challenge.id}
              title={challenge.title}
              description={challenge.description}
              participants={challenge.participants}
              rank={challenge.rank}
              isCompleted={true}
              hasPrecisionData={challenge.hasPrecisionData}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChallengesPage;
