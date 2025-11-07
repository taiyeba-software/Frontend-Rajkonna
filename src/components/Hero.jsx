import { Suspense } from 'react';
import HeroSection from './HeroSection';
import VideoPinSection from './VideoPinSection';
import StarBackground from './StarBackground';

const LoadingFallback = ({ height, bg = "bg-background" }) => (
  <div className={`${height} ${bg} transition-opacity duration-300`} />
);

export const Hero = () => {
  return (
    <div id="hero" className="relative">
      <Suspense fallback={<LoadingFallback height="min-h-screen" />}>
        <StarBackground />
      </Suspense>
      <Suspense fallback={<LoadingFallback height="min-h-[110px]" />}>
        <HeroSection />
      </Suspense>
      <Suspense fallback={<LoadingFallback height="min-h-[110vh]" bg="bg-background/50" />}>
        <VideoPinSection />
      </Suspense>
    </div>
  );
};
