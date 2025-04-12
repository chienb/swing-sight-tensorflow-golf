
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SkipBack, Play, SkipForward, Pause } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from "@/lib/utils";
import CameraView from '@/components/CameraView';
import PoseDetection from '@/components/PoseDetection';

type SwingPhase = 'setup' | 'backswing' | 'downswing' | 'impact' | 'followthrough';

const SwingAnalysisPage = () => {
  const [videoSource, setVideoSource] = useState<HTMLVideoElement | null>(null);
  const [currentPhase, setCurrentPhase] = useState<SwingPhase>('setup');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const isMobile = useIsMobile();

  const handleVideoRecorded = (videoBlob: Blob) => {
    // Handle recorded video
  };
  
  const handleSourceChange = (source: HTMLVideoElement) => {
    setVideoSource(source);
  };

  const phases: SwingPhase[] = ['setup', 'backswing', 'downswing', 'impact', 'followthrough'];

  const startAnalysis = () => {
    setIsAnalyzing(true);
  };

  const togglePlayPause = () => {
    if (!videoSource) return;
    setIsPlaying(!isPlaying);
    
    if (!isPlaying) {
      videoSource.play().catch(error => {
        console.error('Error playing video:', error);
      });
    } else {
      videoSource.pause();
    }
  };

  const handleSeek = (direction: 'backward' | 'forward') => {
    if (!videoSource || isNaN(videoSource.duration)) return;
    
    const seekAmount = 0.5; // Half a second
    if (direction === 'backward') {
      videoSource.currentTime = Math.max(0, videoSource.currentTime - seekAmount);
    } else {
      videoSource.currentTime = Math.min(videoSource.duration, videoSource.currentTime + seekAmount);
    }
  };

  const formatPhase = (phase: SwingPhase): string => {
    if (phase === 'followthrough') return 'Follow-through';
    return phase.charAt(0).toUpperCase() + phase.slice(1);
  };

  return (
    <div className="container py-6 px-4 pb-20 md:pb-6">
      <h1 className="text-2xl font-bold mb-6">Swing Analysis</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Camera View */}
          <CameraView 
            onVideoRecorded={handleVideoRecorded} 
            onSourceChange={handleSourceChange}
          />
        </div>
        
        <div className="space-y-6">
          {/* Pose Detection */}
          <PoseDetection videoSource={videoSource} />
        </div>
      </div>
    </div>
  );
};

export default SwingAnalysisPage;
