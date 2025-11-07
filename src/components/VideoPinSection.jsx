
import { useRef, useState, useEffect } from "react";

const VideoPinSection = () => {
  const videoContainer = useRef();
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false); // Track when video is ready

  useEffect(() => {
    // Guard for SSR
    if (typeof window === 'undefined') return;

    const video = videoRef.current;
    if (!video) return;

    // When video metadata (like dimensions) is loaded, we mark it ready
    const handleLoadedData = () => {
      setVideoLoaded(true);
    };

    const handleError = (error) => {
      console.error('Video loading error:', error);
      // Keep placeholder visible on error
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("error", handleError);
    };
  }, []);

  return (
    <div
      id="home"
      ref={videoContainer}
      className="gpu relative w-full h-[110vh] sm:h-[150vh] overflow-hidden z-0 filter-glitter-section"
    >
      {/* ✅ Placeholder Image */}
      {!videoLoaded && (
        <img
          src="/assets/videos/hero-placeholder.jpg" // 👈 put your placeholder image here
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out"
          style={{ opacity: videoLoaded ? 0 : 1 }}
        />
      )}

      {/* ✅ Video (Lazy Loaded) */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out ${
          videoLoaded ? "opacity-100" : "opacity-0"
        }`}
        src="/assets/videos/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata" // Light preload — loads only metadata first
      />
    </div>
  );
};

export default VideoPinSection;




