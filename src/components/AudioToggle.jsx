
import { Music2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const AudioToggle = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/assets/audio/bg-audio.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <button
      onClick={toggleAudio}
      className={cn(
        "max-sm:hidden p-2 rounded-full transition-colors duration-300",
        "focus:outline-none"
      )}
    >
      {isPlaying ? (
        <VolumeX className="h-6 w-6 text-gray-400" />
      ) : (
        <Music2 className="h-6 w-6 text-foreground" />
      )}
    </button>
  );
};
