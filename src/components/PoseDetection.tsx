
import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface PoseDetectionProps {
  videoSource: HTMLVideoElement | null;
}

const PoseDetection: React.FC<PoseDetectionProps> = ({ videoSource }) => {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const requestRef = useRef<number | null>(null);
  
  // Swing phases
  const [swingPhase, setSwingPhase] = useState('setup');
  const phases = ['setup', 'backswing', 'downswing', 'impact', 'follow-through'];

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        
        const detectorConfig = {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
          enableSmoothing: true
        };
        
        const detector = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet, 
          detectorConfig
        );
        
        setDetector(detector);
        
        toast({
          title: "Model Loaded",
          description: "Pose detection model is ready!",
        });
      } catch (error) {
        console.error('Error loading model:', error);
        toast({
          title: "Model Error",
          description: "Failed to load the pose detection model.",
          variant: "destructive"
        });
      }
    };

    loadModel();

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  // Handle video play/pause
  useEffect(() => {
    if (!videoSource) return;
    
    if (isPlaying) {
      videoSource.play();
    } else {
      videoSource.pause();
    }
  }, [isPlaying, videoSource]);

  const togglePlayPause = () => {
    if (!videoSource) return;
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (direction: 'backward' | 'forward') => {
    if (!videoSource) return;
    
    const seekAmount = 0.5; // Half a second
    if (direction === 'backward') {
      videoSource.currentTime = Math.max(0, videoSource.currentTime - seekAmount);
    } else {
      videoSource.currentTime = Math.min(videoSource.duration, videoSource.currentTime + seekAmount);
    }
  };

  const toggleAnalysis = () => {
    if (!detector || !videoSource) {
      toast({
        title: "Not Ready",
        description: "Please load a video and wait for the model to load.",
        variant: "destructive"
      });
      return;
    }
    
    if (isAnalyzing) {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
      setIsAnalyzing(false);
    } else {
      setIsAnalyzing(true);
      detectPose();
    }
  };
  
  const detectPose = async () => {
    if (!detector || !videoSource || !canvasRef.current) {
      return;
    }
    
    if (videoSource.paused || videoSource.ended) {
      requestRef.current = requestAnimationFrame(detectPose);
      return;
    }
    
    try {
      // Run pose detection
      const poses = await detector.estimatePoses(videoSource);
      
      // Draw pose
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        
        // Set canvas dimensions to match video
        canvasRef.current.width = videoSource.videoWidth;
        canvasRef.current.height = videoSource.videoHeight;
        
        if (poses.length > 0) {
          drawPose(poses[0], ctx);
          analyzeSwing(poses[0]);
        }
      }
    } catch (error) {
      console.error('Error in pose detection:', error);
    }
    
    requestRef.current = requestAnimationFrame(detectPose);
  };
  
  const drawPose = (pose: poseDetection.Pose, ctx: CanvasRenderingContext2D) => {
    if (!pose.keypoints) return;
    
    // Draw keypoints
    ctx.fillStyle = '#00FF00';
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    
    pose.keypoints.forEach(keypoint => {
      if (keypoint.score && keypoint.score > 0.3) {
        const { x, y } = keypoint;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      }
    });
    
    // Draw connections
    const connections = [
      ['nose', 'left_eye'], ['nose', 'right_eye'],
      ['left_eye', 'left_ear'], ['right_eye', 'right_ear'],
      ['left_shoulder', 'right_shoulder'], ['left_shoulder', 'left_elbow'],
      ['right_shoulder', 'right_elbow'], ['left_elbow', 'left_wrist'],
      ['right_elbow', 'right_wrist'], ['left_shoulder', 'left_hip'],
      ['right_shoulder', 'right_hip'], ['left_hip', 'right_hip'],
      ['left_hip', 'left_knee'], ['right_hip', 'right_knee'],
      ['left_knee', 'left_ankle'], ['right_knee', 'right_ankle']
    ];
    
    ctx.strokeStyle = '#2F7336';
    ctx.lineWidth = 3;
    
    connections.forEach(([keypoint1Name, keypoint2Name]) => {
      const keypoint1 = pose.keypoints.find(kp => kp.name === keypoint1Name);
      const keypoint2 = pose.keypoints.find(kp => kp.name === keypoint2Name);
      
      if (
        keypoint1 && keypoint2 && 
        keypoint1.score && keypoint2.score && 
        keypoint1.score > 0.3 && keypoint2.score > 0.3
      ) {
        ctx.beginPath();
        ctx.moveTo(keypoint1.x, keypoint1.y);
        ctx.lineTo(keypoint2.x, keypoint2.y);
        ctx.stroke();
      }
    });
  };
  
  const analyzeSwing = (pose: poseDetection.Pose) => {
    if (!pose.keypoints || !videoSource) return;
    
    // Very simple swing phase detection based on video progress
    // In a real app, you would analyze the actual pose
    const progress = videoSource.currentTime / videoSource.duration;
    
    let phase;
    if (progress < 0.2) {
      phase = 'setup';
    } else if (progress < 0.4) {
      phase = 'backswing';
    } else if (progress < 0.5) {
      phase = 'downswing';
    } else if (progress < 0.6) {
      phase = 'impact';
    } else {
      phase = 'follow-through';
    }
    
    if (phase !== swingPhase) {
      setSwingPhase(phase);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="mb-4">
        <h3 className="font-bold text-lg mb-2">Swing Analysis</h3>
        
        <div className="grid grid-cols-5 gap-1 mb-4">
          {phases.map((phase) => (
            <div 
              key={phase}
              className={`text-center p-2 text-xs rounded-md ${
                phase === swingPhase 
                  ? 'bg-golf-green-dark text-white' 
                  : 'bg-gray-100'
              }`}
            >
              {phase.charAt(0).toUpperCase() + phase.slice(1)}
            </div>
          ))}
        </div>
        
        <Button
          onClick={toggleAnalysis}
          variant={isAnalyzing ? "destructive" : "default"}
          className="w-full mb-4"
        >
          {isAnalyzing ? "Stop Analysis" : "Start Analysis"}
        </Button>
        
        <div className="flex justify-between">
          <Button variant="outline" size="icon" onClick={() => handleSeek('backward')}>
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="icon" onClick={togglePlayPause}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <Button variant="outline" size="icon" onClick={() => handleSeek('forward')}>
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="text-sm">
        <h4 className="font-semibold mb-1">Tips for {swingPhase}:</h4>
        <ul className="list-disc pl-5 space-y-1">
          {swingPhase === 'setup' && (
            <>
              <li>Feet shoulder-width apart</li>
              <li>Slight knee flex</li>
              <li>Spine angle tilted from hips</li>
            </>
          )}
          {swingPhase === 'backswing' && (
            <>
              <li>Maintain spine angle</li>
              <li>Keep lead arm straight</li>
              <li>Rotate shoulders fully</li>
            </>
          )}
          {swingPhase === 'downswing' && (
            <>
              <li>Start with lower body</li>
              <li>Maintain lag angle</li>
              <li>Keep head behind the ball</li>
            </>
          )}
          {swingPhase === 'impact' && (
            <>
              <li>Eyes on the ball</li>
              <li>Weight on lead foot</li>
              <li>Hands ahead of clubhead</li>
            </>
          )}
          {swingPhase === 'follow-through' && (
            <>
              <li>Fully rotate hips and shoulders</li>
              <li>Complete weight transfer</li>
              <li>Balanced finish position</li>
            </>
          )}
        </ul>
      </div>
      
      <canvas
        ref={canvasRef}
        className="pose-canvas"
      />
    </div>
  );
};

export default PoseDetection;
