"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Asset } from "@/types/asset";
import { createClient } from "@/utils/supabase/client";

interface OverlayClientProps {
  userId: string;
}

interface AssetInstance extends Asset {
  instanceId: string;
}

export default function OverlayClient({ userId }: OverlayClientProps) {
  const [activeAssets, setActiveAssets] = useState<AssetInstance[]>([]);
  const lastAssetIdRef = useRef<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    console.log("[SUPABASE REALTIME] Overlay connected for user:", userId);
    
    const channel = supabase.channel(`overlay-${userId}`);

    channel
      .on(
        'broadcast',
        { event: 'play-asset' },
        (payload) => {
          const data = payload.payload as Asset;
          console.log("[SUPABASE REALTIME] play-asset received:", data.name, data);
          const instanceId = Math.random().toString(36).substring(7) + Date.now();
          const newInstance: AssetInstance = { ...data, instanceId };

          setActiveAssets((prev) => {
            const isVisual = data.type !== 'AUDIO';
            
            if (isVisual) {
              // Cut previous visual assets if it's a DIFFERENT one
              if (lastAssetIdRef.current && lastAssetIdRef.current !== data.id) {
                return [newInstance];
              }
              return [...prev, newInstance];
            }

            return [...prev, newInstance];
          });

          lastAssetIdRef.current = data.id;

          if (data.duration && data.duration > 0) {
            const duration = (data.type === 'AUDIO' && data.duration > 30) 
              ? 30 
              : data.duration;

            setTimeout(() => {
              setActiveAssets((prev) => prev.filter(a => a.instanceId !== instanceId));
            }, duration * 1000);
          }
        }
      )
      .on(
        'broadcast',
        { event: 'stop-all' },
        () => {
          console.log("[SUPABASE REALTIME] Stop all requested");
          setActiveAssets([]);
          lastAssetIdRef.current = null;
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log("[SUPABASE REALTIME] Successfully subscribed to channel:", `overlay-${userId}`);
        }
      });

    return () => {
      console.log("[SUPABASE REALTIME] Cleaning up connection");
      supabase.removeChannel(channel);
    };
  }, [userId, supabase]);

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center bg-transparent overflow-hidden">
      <AnimatePresence>
        {activeAssets.map((asset) => (
          <AssetRenderer 
            key={asset.instanceId} 
            asset={asset} 
            onComplete={() => {
              setActiveAssets(prev => prev.filter(a => a.instanceId !== asset.instanceId));
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

const AssetRenderer = ({ asset, onComplete }: { asset: AssetInstance, onComplete: () => void }) => {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (asset.type === "AUDIO" && audioRef.current) {
      audioRef.current.volume = asset.volume;
      audioRef.current.play();
    }
    if (asset.type === "VIDEO" && videoRef.current) {
      videoRef.current.volume = asset.volume;
      videoRef.current.play();
    }
  }, [asset]);

  const getExitProps = () => {
    switch (asset.exitAnimation) {
      case "slide-up":
        return { y: -200, opacity: 0, scale: asset.scale, transition: { duration: 0.3 } };
      case "zoom-out":
        return { scale: 0, opacity: 0, transition: { duration: 0.3 } };
      case "fade":
        return { opacity: 0, scale: asset.scale, transition: { duration: 0.3 } };
      case "none":
      default:
        return { opacity: 0, scale: asset.scale, transition: { duration: 0 } };
    }
  };

  return (
    <motion.div
      initial={{ scale: asset.scale, opacity: 1, y: 0, x: 0, rotate: 0 }}
      animate={{ scale: asset.scale, opacity: 1, y: 0, x: 0, rotate: 0 }}
      exit={getExitProps()}
      className="absolute inset-0 flex items-center justify-center p-8"
      style={{ 
        zIndex: 10,
        filter: asset.chromaKey ? `url(#chroma-${asset.instanceId})` : 'none'
      }}
    >
      {asset.chromaKey && (
        <svg className="absolute w-0 h-0">
          <filter id={`chroma-${asset.instanceId}`}>
            <feColorMatrix
              type="matrix"
              values={`
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                -10 -10 -10 1 0
              `}
            />
          </filter>
        </svg>
      )}

      {asset.type === "IMAGE" || asset.type === "GIF" ? (
        <img 
          src={asset.path} 
          alt={asset.name} 
          className="max-w-[100vw] max-h-[100vh] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        />
      ) : asset.type === "VIDEO" ? (
        <video
          ref={videoRef}
          src={asset.path}
          className="max-w-[100vw] max-h-[100vh] object-contain"
          onEnded={onComplete}
        />
      ) : (
        <div className="opacity-0">
           <audio ref={audioRef} src={asset.path} onEnded={onComplete} />
        </div>
      )}
    </motion.div>
  );
};
