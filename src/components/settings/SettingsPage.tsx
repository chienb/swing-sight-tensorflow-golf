
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Bell, Database, Info, ShoppingBag } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container py-6 px-4">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/profile')}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Account</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-gray-500">golf.user@example.com</p>
              </div>
              <Button variant="outline" size="sm">
                Change
              </Button>
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Password</p>
                <p className="text-sm text-gray-500">Last changed 3 months ago</p>
              </div>
              <Button variant="outline" size="sm">
                Change
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notifications
            </CardTitle>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Challenge Updates</p>
                <p className="text-sm text-gray-500">Get notified about new challenges</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Friend Requests</p>
                <p className="text-sm text-gray-500">Get notified about new friend requests</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Weekly Summaries</p>
                <p className="text-sm text-gray-500">Receive weekly activity summaries</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Data Management
            </CardTitle>
            <CardDescription>Manage your app data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Clear Cache</p>
                <p className="text-sm text-gray-500">Free up storage space</p>
              </div>
              <Button variant="outline" size="sm">
                Clear
              </Button>
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Delete Old Swing Analyses</p>
                <p className="text-sm text-gray-500">Remove analyses older than 30 days</p>
              </div>
              <Button variant="outline" size="sm">
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2" />
              Upgrade Your Gear
            </CardTitle>
            <CardDescription>Enhance your golf analysis with precision hardware</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              Take your game to the next level with Foresight Sports' professional-grade launch monitors and simulators.
            </p>
            <Button className="w-full bg-golf-green-dark hover:bg-golf-green-dark/90">
              Shop Now
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Info className="h-5 w-5 mr-2" />
              About
            </CardTitle>
            <CardDescription>App information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Version</p>
                <p className="text-sm text-gray-500">1.0.0</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Button variant="link" className="p-0 h-auto text-golf-green-dark">
                Terms of Service
              </Button>
              <Button variant="link" className="p-0 h-auto text-golf-green-dark">
                Privacy Policy
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
