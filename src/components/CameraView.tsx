
import React, { useRef, useState, useEffect } from 'react';
import { Camera, Video, RefreshCw, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface CameraViewProps {
  onVideoRecorded: (videoBlob: Blob) => void;
  onSourceChange: (source: HTMLVideoElement) => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onVideoRecorded, onSourceChange }) => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [activeTab, setActiveTab] = useState('camera');
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const recordedVideoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<number | null>(null);

  const startCamera = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      const constraints = { 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        onSourceChange(videoRef.current);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access your camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    
    recordedChunksRef.current = [];
    const options = { mimeType: 'video/webm;codecs=vp9' };
    
    try {
      mediaRecorderRef.current = new MediaRecorder(streamRef.current, options);
    } catch (e) {
      console.error('MediaRecorder error:', e);
      try {
        mediaRecorderRef.current = new MediaRecorder(streamRef.current);
      } catch (e) {
        toast({
          title: "Recording Error",
          description: "Can't record video in this browser.",
          variant: "destructive"
        });
        return;
      }
    }
    
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };
    
    mediaRecorderRef.current.onstop = () => {
      const videoBlob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      const videoUrl = URL.createObjectURL(videoBlob);
      setRecordedVideo(videoUrl);
      onVideoRecorded(videoBlob);
      setActiveTab('review');
    };
    
    mediaRecorderRef.current.start(100);
    setIsRecording(true);
    setRecordingTime(0);
    
    timerRef.current = window.setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const togglePause = () => {
    if (!mediaRecorderRef.current || !isRecording) return;
    
    if (isPaused) {
      mediaRecorderRef.current.resume();
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      mediaRecorderRef.current.pause();
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    
    setIsPaused(!isPaused);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  useEffect(() => {
    if (activeTab === 'camera') {
      startCamera();
    } else if (activeTab === 'review' && recordedVideo) {
      stopCamera();
      
      // Set up recorded video and pass it to pose detection
      if (recordedVideoRef.current) {
        recordedVideoRef.current.src = recordedVideo;
        
        // Ensure the video is ready before passing to analysis
        recordedVideoRef.current.onloadeddata = () => {
          console.log("Recorded video loaded and ready for analysis");
          onSourceChange(recordedVideoRef.current!);
        };
      }
    }

    return () => {
      if (activeTab === 'camera') {
        stopCamera();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [activeTab, recordedVideo]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Tabs 
        defaultValue="camera" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="camera" className="relative">
            <Camera className="h-4 w-4 mr-2" />
            Camera
            {isRecording && (
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </TabsTrigger>
          <TabsTrigger value="review" disabled={!recordedVideo}>
            <Video className="h-4 w-4 mr-2" />
            Review
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="camera" className="m-0">
          <div className="relative aspect-video bg-black">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
            {isRecording && (
              <div className="absolute top-4 left-4 bg-black/70 text-white px-2 py-1 rounded-md flex items-center">
                <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
                <span>{formatTime(recordingTime)}</span>
              </div>
            )}
          </div>
          
          <div className="p-4 flex justify-between items-center">
            <Button 
              variant="outline" 
              size="icon"
              onClick={startCamera}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            
            <div className="flex space-x-2">
              {isRecording && (
                <Button
                  onClick={togglePause}
                  variant="outline"
                  size="icon"
                >
                  {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                </Button>
              )}
              
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                variant={isRecording ? "destructive" : "default"}
                className={cn(
                  isRecording ? "bg-red-500 hover:bg-red-600" : "bg-golf-green-dark hover:bg-golf-green-dark/90"
                )}
              >
                {isRecording ? "Stop Recording" : "Start Recording"}
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="review" className="m-0">
          <div className="relative aspect-video bg-black">
            <video
              ref={recordedVideoRef}
              className="w-full h-full object-contain"
              controls
              playsInline
              src={recordedVideo || undefined}
              onLoadedMetadata={() => {
                console.log("Video metadata loaded in review mode");
                if (recordedVideoRef.current) {
                  onSourceChange(recordedVideoRef.current);
                }
              }}
            />
          </div>
          
          <div className="p-4 flex justify-end">
            <Button 
              onClick={() => setActiveTab('camera')} 
              className="bg-golf-green-dark hover:bg-golf-green-dark/90"
            >
              <Camera className="h-4 w-4 mr-2" />
              Record New
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CameraView;
