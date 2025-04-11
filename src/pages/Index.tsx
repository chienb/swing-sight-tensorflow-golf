
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CameraView from '@/components/CameraView';
import PoseDetection from '@/components/PoseDetection';
import Dashboard from '@/components/Dashboard';
import { Activity } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [videoSource, setVideoSource] = useState<HTMLVideoElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
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
  
  const handleVideoRecorded = (videoBlob: Blob) => {
    toast({
      title: "Swing Recorded",
      description: "Your golf swing has been recorded successfully!",
    });
  };
  
  const handleSourceChange = (source: HTMLVideoElement) => {
    setVideoSource(source);
  };
  
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
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Golf Swing Analyzer</h1>
        
        <Dashboard />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <CameraView 
              onVideoRecorded={handleVideoRecorded} 
              onSourceChange={handleSourceChange}
            />
          </div>
          
          <div>
            <PoseDetection videoSource={videoSource} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
