
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Award, Zap, Target, Medal, Settings } from 'lucide-react';
import StatCard from './StatCard';
import AchievementCard from './AchievementCard';
import FriendItem from './FriendItem';

const mockFriends = [
  { id: 1, name: 'John Smith', challenge: 'Power Drive Challenge', isPrecision: true },
  { id: 2, name: 'Sarah Johnson', challenge: 'Weekly Speed Challenge' },
  { id: 3, name: 'Mike Williams', challenge: 'Swing Accuracy', isPrecision: true },
  { id: 4, name: 'Jessica Brown', challenge: 'Most Consistent Swing' },
];

const mockAchievements = [
  { 
    id: 1, 
    icon: Trophy, 
    title: 'First Challenge Win', 
    description: 'Earned a victory in a challenge',
    unlocked: true
  },
  { 
    id: 2, 
    icon: Award, 
    title: '10 Swings Analyzed', 
    description: 'Analyzed 10 golf swings',
    unlocked: true
  },
  { 
    id: 3, 
    icon: Zap, 
    title: 'Speed Demon', 
    description: 'Achieve a swing speed of 100mph',
    unlocked: false
  },
  { 
    id: 4, 
    icon: Target, 
    title: 'Precision Master', 
    description: 'Complete 5 accuracy challenges',
    unlocked: true
  },
  { 
    id: 5, 
    icon: Medal, 
    title: '3-Day Streak', 
    description: 'Practice for 3 consecutive days',
    unlocked: true
  },
];

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('achievements');
  
  return (
    <div className="container py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <Avatar className="h-16 w-16 mr-4">
            <AvatarImage src="" alt="User" />
            <AvatarFallback>GS</AvatarFallback>
          </Avatar>
          
          <div>
            <h2 className="text-xl font-bold">Golf Swinger</h2>
            <p className="text-sm text-gray-500">Member since April 2023</p>
          </div>
          
          <Button variant="outline" size="sm" className="ml-auto">
            Edit Profile
          </Button>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatCard label="Total Challenges" value="10" />
          <StatCard label="Wins" value="3" />
          <StatCard label="Avg. Swing Speed" value="82 mph" />
        </div>
        
        <Card className="mb-6">
          <CardContent className="py-4 flex items-center justify-between">
            <div>
              <p className="font-medium">Data Accuracy: Basic</p>
              <p className="text-xs text-gray-500">Upgrade for Precision</p>
            </div>
            <Button size="sm" variant="outline" className="text-golf-green-dark">
              Upgrade
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-6">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="achievements">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {mockAchievements.map(achievement => (
              <AchievementCard
                key={achievement.id}
                icon={achievement.icon}
                title={achievement.title}
                description={achievement.description}
                unlocked={achievement.unlocked}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="friends">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            {mockFriends.map(friend => (
              <FriendItem
                key={friend.id}
                name={friend.name}
                challenge={friend.challenge}
                isPrecision={friend.isPrecision}
              />
            ))}
            
            <Button className="w-full mt-4">
              Add Friend
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
