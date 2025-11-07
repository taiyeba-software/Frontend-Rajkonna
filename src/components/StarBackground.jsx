import { useEffect, useState } from "react"; // Adjust the path as needed

const StarBackground = () => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    // guard for non-browser environments (SSR)
    if (typeof window === "undefined") return;
    // We'll create multiple visual layers inside this single component to
    // produce a stacked starfield effect without mounting multiple components.
    const layers = [
      { depth: 0, densityDivisor: 15000, sizeMultiplier: 0.6, baseOpacity: 0.5, blur: 0 },
      { depth: 1, densityDivisor: 12000, sizeMultiplier: 1.0, baseOpacity: 0.7, blur: 0 },
      
      
    ];

    const generateLayers = () => {
      const allStars = [];
      layers.forEach((layer, layerIndex) => {
        const count = Math.max(
          4,
          Math.floor((window.innerWidth * window.innerHeight) / layer.densityDivisor)
        );
        for (let i = 0; i < count; i++) {
          allStars.push({
            id: `${layerIndex}-${i}`,
            layer: layerIndex,
            size: (Math.random() * 6 + 0.5) * layer.sizeMultiplier,
            x: Math.random() * 100,
            y: Math.random() * 100,
            opacity: Math.max(0.15, Math.random() * layer.baseOpacity),
            animationDuration: Math.random() * (1 + layerIndex) + 1.5 + layerIndex,
            animationDelay: Math.random() * 4,
            blur: layer.blur,
          });
        }
      });
      setStars(allStars);
    };

    // initial generation
    generateLayers();

    // debug mount (will appear in browser console)
    // eslint-disable-next-line no-console
    console.debug("StarBackground mounted, layers:", layers.length);

    const resizeHandler = () => generateLayers();
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  return (
    <div
      className="star-background-container pointer-events-none overflow-hidden absolute inset-0"
      aria-hidden="true"
      role="presentation"
    >
      {stars.map((star) => (
        <div
          key={star.id}
          className="star animate-glitter"
          style={{
            position: "absolute",
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.x}%`,
            top: `${star.y}%`,
            opacity: star.opacity,
            animationDuration: `${star.animationDuration}s`,
            animationDelay: `${star.animationDelay}s`,
            zIndex: 0 + star.layer,
            filter: star.blur ? `blur(${star.blur}px)` : undefined,
            transform: `translate3d(0,0,0)`,
          }}
        />
      ))}
    </div>
  );
};

export default StarBackground;
