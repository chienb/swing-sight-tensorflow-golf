
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SkipBack, Play, SkipForward } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from "@/lib/utils";
import CameraView from '@/components/CameraView';
import PoseDetection from '@/components/PoseDetection';

type SwingPhase = 'setup' | 'backswing' | 'downswing' | 'impact' | 'followthrough';

const SwingAnalysisPage = () => {
  const [videoSource, setVideoSource] = useState<HTMLVideoElement | null>(null);
  const [currentPhase, setCurrentPhase] = useState<SwingPhase>('setup');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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

  const formatPhase = (phase: SwingPhase): string => {
    if (phase === 'followthrough') return 'Follow-through';
    return phase.charAt(0).toUpperCase() + phase.slice(1);
  };

  return (
    <div className="container py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Swing Analysis</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Phases selection */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {phases.map((phase) => (
                <Button
                  key={phase}
                  variant={currentPhase === phase ? "default" : "outline"}
                  className={cn(
                    "flex-1 min-w-[80px]",
                    currentPhase === phase ? "bg-golf-green-dark" : "",
                    isMobile ? "text-xs py-1 px-2" : ""
                  )}
                  onClick={() => setCurrentPhase(phase)}
                >
                  {formatPhase(phase)}
                </Button>
              ))}
            </div>
            
            <Button 
              className="w-full bg-golf-green-dark hover:bg-golf-green-dark/90 my-4"
              onClick={startAnalysis}
            >
              Start Analysis
            </Button>
            
            <div className="flex justify-between my-4">
              <Button variant="outline" size="icon">
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Play className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-4">
              <h3 className="font-medium mb-2">Tips for setup:</h3>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Feet shoulder-width apart</li>
                <li>Slight knee flex</li>
                <li>Spine angle tilted from hips</li>
              </ul>
            </div>
            
            <div className="mt-4 bg-gray-100 w-full h-40 rounded-lg flex items-center justify-center">
              {/* Visualization area */}
              <span className="text-gray-500">Analysis visualization</span>
            </div>
          </div>
        </div>
        
        <div>
          <CameraView 
            onVideoRecorded={handleVideoRecorded} 
            onSourceChange={handleSourceChange}
          />
          <div className="mt-4">
            <PoseDetection videoSource={videoSource} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwingAnalysisPage;
