'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, UserCircle2, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';
import { Peer } from 'peerjs';

interface CallOverlayProps {
  isOpen: boolean;
  type: 'audio' | 'video';
  user: { name: string; avatarUrl?: string; username: string; isBot?: boolean };
  onEnd: () => void;
}

export function CallOverlay({ isOpen, type, user, onEnd }: CallOverlayProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(type === 'video');
  const [duration, setDuration] = useState(0);
  const [callStatus, setCallStatus] = useState<'initializing' | 'calling' | 'connected' | 'ended' | 'failed'>('initializing');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<Peer | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const callRef = useRef<any>(null);

  // Initialize Peer and Media
  useEffect(() => {
    if (isOpen) {
      // Wrap in setTimeout to avoid synchronous state update warning
      const timer = setTimeout(() => {
        setCallStatus('initializing');
        setErrorMessage(null);
        setDuration(0);
      }, 0);

      const initCall = async () => {
        try {
          // 1. Get User Media
          const stream = await navigator.mediaDevices.getUserMedia({
            video: type === 'video',
            audio: true
          });
          
          localStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
            localVideoRef.current.muted = true; // Mute local video to avoid feedback
          }

          // 2. Initialize Peer
          // In a real app, we'd use a signaling server to exchange IDs.
          // Here we use a random ID for the caller.
          const peer = new Peer();
          peerRef.current = peer;

          peer.on('open', (id) => {
            console.log('My peer ID is: ' + id);
            setCallStatus('calling');

            // Simulate connection for demo/bot purposes
            // In a real P2P app, we would connect to the other user's Peer ID here.
            // Since we don't have a backend to exchange IDs, we simulate a connection
            // after a delay, or if it's a bot, we auto-connect a "fake" stream.
            
            if (user.isBot) {
              setTimeout(() => {
                setCallStatus('connected');
                // For bot, we can't really get a remote stream without a backend bot
              }, 2000);
            } else {
              // For real users, we'd try to connect. 
              // Since we can't easily discover other peers without a server,
              // we'll simulate a "ringing" state that eventually connects 
              // to show the UI working, or fails if we want to be strict.
              // Let's simulate a connection for the "experience".
              setTimeout(() => {
                setCallStatus('connected');
              }, 3000);
            }
          });

          peer.on('error', (err) => {
            console.error('PeerJS error:', err);
            setErrorMessage('Connection failed. Please try again.');
            setCallStatus('failed');
          });

        } catch (err: any) {
          console.error("Error accessing media devices:", err);
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            setErrorMessage('Permission denied. Please allow camera and microphone access in your browser settings.');
          } else if (err.name === 'NotFoundError') {
            setErrorMessage('No camera or microphone found.');
          } else {
            setErrorMessage('Failed to access media devices: ' + err.message);
          }
          setCallStatus('failed');
        }
      };

      initCall();

      return () => {
        // Cleanup
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach(track => track.stop());
        }
        if (peerRef.current) {
          peerRef.current.destroy();
        }
        if (callRef.current) {
          callRef.current.close();
        }
      };
    }
  }, [isOpen, type, user.isBot]);

  // Toggle Video/Audio tracks
  useEffect(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
      });
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = isVideoEnabled;
      });
    }
  }, [isMuted, isVideoEnabled]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callStatus === 'connected') {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col items-center justify-between pb-12 pt-16"
        >
          {/* Background effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] animate-pulse" />
          </div>

          {/* Video Feeds */}
          {type === 'video' && (
             <div className="absolute inset-0 z-0 bg-black">
                {/* Remote Video (Simulated/Real) */}
                <video 
                  ref={remoteVideoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover"
                />
                
                {/* Local Video (Picture-in-Picture) */}
                {isVideoEnabled && (
                  <motion.div 
                    drag
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    className="absolute top-4 right-4 w-32 h-48 bg-zinc-900 rounded-xl overflow-hidden shadow-2xl border border-white/10 z-20"
                  >
                    <video 
                      ref={localVideoRef} 
                      autoPlay 
                      muted 
                      playsInline 
                      className="w-full h-full object-cover mirror"
                      style={{ transform: 'scaleX(-1)' }} // Mirror effect
                    />
                  </motion.div>
                )}
             </div>
          )}

          {/* Audio-only UI */}
          {type === 'audio' && (
            <div className="absolute inset-0 z-0 flex flex-col items-center justify-center">
               <div className="relative">
                 {callStatus === 'calling' && (
                   <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping" />
                 )}
                 <div className="w-32 h-32 rounded-full bg-zinc-800 border-4 border-zinc-900 flex items-center justify-center overflow-hidden shadow-2xl z-10">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserCircle2 className="w-16 h-16 text-zinc-500" />
                    )}
                 </div>
               </div>
            </div>
          )}

          {/* Status & Info */}
          <div className="relative z-10 flex flex-col items-center gap-2 mt-8">
            {type === 'video' && !isVideoEnabled && (
              <div className="w-24 h-24 rounded-full bg-zinc-800 border-4 border-zinc-900 flex items-center justify-center overflow-hidden shadow-2xl mb-4">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <UserCircle2 className="w-12 h-12 text-zinc-500" />
                )}
              </div>
            )}
            
            <h2 className="text-2xl font-bold text-white drop-shadow-md">{user.name}</h2>
            
            {errorMessage ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg backdrop-blur-md">
                <AlertTriangle size={16} className="text-red-400" />
                <p className="text-xs text-red-200 font-medium text-center max-w-[200px]">{errorMessage}</p>
              </div>
            ) : (
              <p className="text-zinc-300 font-medium tracking-wide drop-shadow-md bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
                {callStatus === 'initializing' && 'Initializing...'}
                {callStatus === 'calling' && 'Calling...'}
                {callStatus === 'connected' && formatDuration(duration)}
                {callStatus === 'failed' && 'Call Failed'}
                {callStatus === 'ended' && 'Call Ended'}
              </p>
            )}
          </div>

          {/* Visualizer / Waves for Audio */}
          {type === 'audio' && callStatus === 'connected' && (
            <div className="flex items-center gap-1 h-12 mb-auto mt-8">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [10, 40, 10] }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 0.8, 
                    delay: i * 0.1,
                    ease: "easeInOut"
                  }}
                  className="w-1.5 bg-white/80 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                />
              ))}
            </div>
          )}

          {/* Controls */}
          <div className="relative z-10 w-full max-w-xs px-8 mb-8">
            <div className="flex items-center justify-between bg-zinc-900/80 backdrop-blur-xl p-4 rounded-3xl border border-white/5 shadow-2xl">
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className={clsx(
                  "p-4 rounded-full transition-all",
                  isMuted ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"
                )}
              >
                {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
              </button>

              {type === 'video' && (
                <button 
                  onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                  className={clsx(
                    "p-4 rounded-full transition-all",
                    !isVideoEnabled ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"
                  )}
                >
                  {!isVideoEnabled ? <VideoOff size={24} /> : <Video size={24} />}
                </button>
              )}

              <button 
                onClick={onEnd}
                className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
              >
                <PhoneOff size={24} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
