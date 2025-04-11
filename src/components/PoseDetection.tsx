
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
  const [modelReady, setModelReady] = useState(false);
  
  // Swing phases
  const [swingPhase, setSwingPhase] = useState('setup');
  const phases = ['setup', 'backswing', 'downswing', 'impact', 'follow-through'];
  
  // Last detected pose for debouncing
  const lastPoseRef = useRef<poseDetection.Pose | null>(null);
  const frameCountRef = useRef(0);
  const videoTypeRef = useRef<'live' | 'recorded'>('live');

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
        setModelReady(true);
        
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
  }, [toast]);

  // Handle video play/pause
  useEffect(() => {
    if (!videoSource) return;
    
    if (isPlaying) {
      videoSource.play().catch(error => {
        console.error('Error playing video:', error);
      });
    } else {
      videoSource.pause();
    }
  }, [isPlaying, videoSource]);

  // Detect video type (live or recorded)
  useEffect(() => {
    if (!videoSource) return;
    
    // Determine if it's a live feed or recorded video
    videoTypeRef.current = videoSource.srcObject ? 'live' : 'recorded';
    console.log("Video type:", videoTypeRef.current);
    
    // Reset analysis state when video source changes
    if (isAnalyzing) {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
      
      // Reset to ensure we start fresh analysis with new source
      frameCountRef.current = 0;
      setSwingPhase('setup');
      
      // Start detection again with new video source
      detectPose();
    }
  }, [videoSource]);

  const togglePlayPause = () => {
    if (!videoSource) return;
    setIsPlaying(!isPlaying);
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
      // Reset frame count and swing phase when starting analysis
      frameCountRef.current = 0;
      setSwingPhase('setup');
      detectPose();
    }
  };
  
  const detectPose = async () => {
    if (!detector || !videoSource || !canvasRef.current) {
      requestRef.current = requestAnimationFrame(detectPose);
      return;
    }
    
    // Make sure video is ready for processing
    if (videoSource.readyState < 2) {
      console.log("Video not ready yet, waiting...");
      requestRef.current = requestAnimationFrame(detectPose);
      return;
    }
    
    try {
      // Create a video element specifically for pose detection
      // This is a workaround for the texture import error
      const canvas = document.createElement('canvas');
      canvas.width = videoSource.videoWidth;
      canvas.height = videoSource.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Draw the current frame from the video to the canvas
        ctx.drawImage(videoSource, 0, 0, canvas.width, canvas.height);
        
        // Run pose detection on the canvas instead of directly on the video
        const poses = await detector.estimatePoses(canvas);
        
        // Draw pose on our display canvas
        const displayCtx = canvasRef.current.getContext('2d');
        if (displayCtx) {
          // Clear the canvas
          displayCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          
          // Set canvas dimensions to match video
          canvasRef.current.width = videoSource.videoWidth;
          canvasRef.current.height = videoSource.videoHeight;
          
          // Draw the video frame first
          displayCtx.drawImage(videoSource, 0, 0, canvasRef.current.width, canvasRef.current.height);
          
          if (poses.length > 0) {
            // Draw detected pose
            drawPose(poses[0], displayCtx);
            
            // Store last pose for smoother analysis
            lastPoseRef.current = poses[0];
            
            // Use frame count to create smoother phase transitions
            frameCountRef.current++;
            
            // Analyze swing after every few frames to avoid too frequent updates
            if (frameCountRef.current % 5 === 0) {
              analyzeSwing(poses[0]);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in pose detection:', error);
    }
    
    // Continue the animation loop
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
    
    const rightShoulder = pose.keypoints.find(kp => kp.name === 'right_shoulder');
    const leftShoulder = pose.keypoints.find(kp => kp.name === 'left_shoulder');
    const rightElbow = pose.keypoints.find(kp => kp.name === 'right_elbow');
    const rightWrist = pose.keypoints.find(kp => kp.name === 'right_wrist');
    const rightHip = pose.keypoints.find(kp => kp.name === 'right_hip');
    
    if (!rightShoulder?.score || !leftShoulder?.score || 
        !rightElbow?.score || !rightWrist?.score || !rightHip?.score ||
        rightShoulder.score < 0.3 || leftShoulder.score < 0.3 || 
        rightElbow.score < 0.3 || rightWrist.score < 0.3 || rightHip.score < 0.3) {
      // Not enough confidence in the key points, don't update the phase
      return;
    }
    
    // Calculate arm extension and body rotation
    const armExtension = calculateDistance(rightElbow, rightWrist) / calculateDistance(rightShoulder, rightElbow);
    const shoulderRotation = calculateDistance(rightShoulder, leftShoulder);
    const wristHeight = rightWrist.y;
    const shoulderHeight = rightShoulder.y;
    
    // Enhanced logic for swing phase detection
    let newPhase = swingPhase;
    
    // For recorded video, use video progress to influence phase detection
    if (videoTypeRef.current === 'recorded') {
      const videoProgress = videoSource.currentTime / (videoSource.duration || 1);
      
      // Combine video progress with pose data for better phase detection
      if (videoProgress < 0.2) {
        newPhase = 'setup';
      } else if (videoProgress < 0.4 && wristHeight < shoulderHeight) {
        newPhase = 'backswing';
      } else if (videoProgress < 0.6) {
        newPhase = 'downswing';
      } else if (videoProgress < 0.8) {
        newPhase = 'impact';
      } else {
        newPhase = 'follow-through';
      }
    } else {
      // For live camera, use more detailed pose analysis
      // These thresholds might need adjustment based on testing
      if (armExtension < 1.2 && wristHeight > shoulderHeight) {
        newPhase = 'setup';
      } else if (armExtension >= 1.2 && wristHeight < shoulderHeight) {
        newPhase = 'backswing';
      } else if (armExtension < 1.2 && wristHeight > shoulderHeight * 0.9) {
        newPhase = 'downswing';
      } else if (armExtension >= 1.2 && Math.abs(wristHeight - shoulderHeight) < 20) {
        newPhase = 'impact';
      } else if (armExtension >= 1.1 && wristHeight < shoulderHeight * 1.2) {
        newPhase = 'follow-through';
      }
      
      // Additional logic for sequential progression through phases
      const currentPhaseIndex = phases.indexOf(swingPhase);
      const newPhaseIndex = phases.indexOf(newPhase);
      
      // Only allow moving to the next phase or staying in the current phase
      // This prevents jumping back to earlier phases during a swing
      if (newPhaseIndex < currentPhaseIndex && frameCountRef.current > 30) {
        // If we've been analyzing for a while and want to go back, 
        // it's likely a new swing starting, so allow it
        newPhase = newPhase;
      } else if (newPhaseIndex > currentPhaseIndex + 1) {
        // Don't skip phases, only advance one at a time
        newPhase = phases[currentPhaseIndex + 1];
      }
    }
    
    if (newPhase !== swingPhase) {
      console.log(`Swing phase changed: ${swingPhase} -> ${newPhase}`);
      setSwingPhase(newPhase);
    }
  };
  
  const calculateDistance = (point1: poseDetection.Keypoint, point2: poseDetection.Keypoint) => {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
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
          disabled={!modelReady || !videoSource}
        >
          {isAnalyzing ? "Stop Analysis" : "Start Analysis"}
        </Button>
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleSeek('backward')}
            disabled={!videoSource || videoTypeRef.current === 'live'}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={togglePlayPause}
            disabled={!videoSource || videoTypeRef.current === 'live'}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleSeek('forward')}
            disabled={!videoSource || videoTypeRef.current === 'live'}
          >
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
        className="w-full aspect-video mt-4 bg-black/5 rounded"
      />
    </div>
  );
};

export default PoseDetection;
