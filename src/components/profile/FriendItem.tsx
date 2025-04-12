
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FriendItemProps {
  name: string;
  avatar?: string;
  challenge?: string;
  isPrecision?: boolean;
}

const FriendItem: React.FC<FriendItemProps> = ({
  name,
  avatar,
  challenge,
  isPrecision
}) => {
  const initials = name.split(' ').map(n => n[0]).join('');
  
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0">
      <div className="flex items-center">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        
        <div>
          <div className="flex items-center">
            <p className="font-medium">{name}</p>
            {isPrecision && (
              <Badge variant="secondary" className="ml-2 bg-green-100 text-golf-green-dark">
                Precision Data
              </Badge>
            )}
          </div>
          {challenge && (
            <p className="text-xs text-gray-500">
              Currently in: {challenge}
            </p>
          )}
        </div>
      </div>
      
      <Button variant="outline" size="sm">
        View Profile
      </Button>
    </div>
  );
};

export default FriendItem;
