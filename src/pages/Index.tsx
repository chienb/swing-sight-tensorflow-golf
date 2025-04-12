
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SwingAnalysisPage from '@/components/swing/SwingAnalysisPage';
import { Activity, Home, Trophy, User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Load TensorFlow.js dependencies
    const loadDependencies = async () => {
      try {
        await Promise.all([
          import('@tensorflow/tfjs'),
          import('@tensorflow-models/pose-detection')
        ]);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading TensorFlow dependencies:', error);
        toast({
          title: "Loading Error",
          description: "Failed to load TensorFlow models. Please refresh the page.",
          variant: "destructive"
        });
      }
    };
    
    loadDependencies();
  }, [toast]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Activity className="h-16 w-16 mx-auto mb-4 text-golf-green-dark animate-spin" />
            <h2 className="text-2xl font-bold mb-2">SwingSight</h2>
            <p className="text-gray-500">Loading TensorFlow models...</p>
          </div>
        </main>
        {isMobile && (
          <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
            <div className="flex justify-around items-center h-16">
              <button
                className="flex flex-col items-center justify-center w-20 h-full text-gray-500"
                onClick={() => navigate('/home')}
              >
                <Home className="h-5 w-5 mb-1" />
                <span className="text-xs">Home</span>
              </button>
              <button
                className="flex flex-col items-center justify-center w-20 h-full text-gray-500"
                onClick={() => navigate('/challenges')}
              >
                <Trophy className="h-5 w-5 mb-1" />
                <span className="text-xs">Challenges</span>
              </button>
              <button
                className="flex flex-col items-center justify-center w-20 h-full text-golf-green-dark"
              >
                <Activity className="h-5 w-5 mb-1" />
                <span className="text-xs">Analysis</span>
              </button>
              <button
                className="flex flex-col items-center justify-center w-20 h-full text-gray-500"
                onClick={() => navigate('/profile')}
              >
                <User className="h-5 w-5 mb-1" />
                <span className="text-xs">Profile</span>
              </button>
            </div>
          </nav>
        )}
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        <SwingAnalysisPage />
      </main>
      
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
          <div className="flex justify-around items-center h-16">
            <button
              className="flex flex-col items-center justify-center w-20 h-full text-gray-500"
              onClick={() => navigate('/home')}
            >
              <Home className="h-5 w-5 mb-1" />
              <span className="text-xs">Home</span>
            </button>
            <button
              className="flex flex-col items-center justify-center w-20 h-full text-gray-500"
              onClick={() => navigate('/challenges')}
            >
              <Trophy className="h-5 w-5 mb-1" />
              <span className="text-xs">Challenges</span>
            </button>
            <button
              className="flex flex-col items-center justify-center w-20 h-full text-golf-green-dark"
            >
              <Activity className="h-5 w-5 mb-1" />
              <span className="text-xs">Analysis</span>
            </button>
            <button
              className="flex flex-col items-center justify-center w-20 h-full text-gray-500"
              onClick={() => navigate('/profile')}
            >
              <User className="h-5 w-5 mb-1" />
              <span className="text-xs">Profile</span>
            </button>
          </div>
        </nav>
      )}
      
      <Footer />
    </div>
  );
};

export default Index;
