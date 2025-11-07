
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Guard for SSR
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const HeroSection = () => {
  const titleRef = useRef(null);
  const paragraphRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    // Guard for SSR
    if (typeof window === 'undefined') return;
    
    const ctx = gsap.context(() => {
      // 🔹 Split the title into individual .word spans
      const words = gsap.utils.toArray(".word");

      // Title words animation (dramatic staggered scale + rotate + up)
      gsap.fromTo(words, {
        opacity: 0,
        y: 60,
        scale: 0.8,
        rotation: 10,
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 1.2,
        ease: "elastic.out(1, 0.5)",
        stagger: 0.3,
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%", // trigger earlier for more drama
          once: true,
        },
      });

      // Paragraph fade-in
      gsap.from(paragraphRef.current, {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: paragraphRef.current,
          start: "top 90%",
          once: true,
        },
      });

      // Button gentle float-in
      gsap.from(buttonRef.current, {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: buttonRef.current,
          start: "top 95%",
          once: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="absolute top-[110px] left-0 w-full z-10 text-center px-4 pointer-events-none">
      
      <h1
        ref={titleRef}
        className="text-[60px] sm:text-[72px] font-bold text-foreground text-glow hero-title"
        style={{ fontFamily: "MPLUSRounded" }}
      >
        <span className="word" style={{ fontFamily: "EduCursive" }}>Feel</span>{" "}
        <span className="word">like</span>{" "}
        <span className="word">royalty,</span>
        <br />
        <span className="word">every</span>{" "}
        <span className="word">single</span>{" "}
        <span className="word" style={{ fontFamily: "EduCursive" }}>day</span>.
      </h1>

      <p
        ref={paragraphRef}
        className="mt-4 max-w-xl mx-auto text-lg md:text-xl text-white"
        style={{ fontFamily: "MPLUSRounded" }}
      >
        Rediscover self-love through skincare rituals crafted to treat you
        like the queen you are.
      </p>

      <a
        ref={buttonRef}
        href="home"
        className="mt-14 px-6 py-2 rounded-full bg-[#C8145A] text-white text-sm font-mplus shadow-md animate-glow inline-block pointer-events-auto"
        title="Explore Rajkonna products"
        onMouseEnter={(e) => {
          gsap.to(e.currentTarget, {
            scale: 1.08,
            rotation: -1,
            boxShadow: "0 0 26px rgba(200, 20, 90, 0.6)",
            filter: "brightness(1.2) blur(0.5px)",
            backgroundColor: "#C8145A",
            duration: 0.4,
            ease: "power2.out",
          });
        }}
        onMouseLeave={(e) => {
          gsap.to(e.currentTarget, {
            scale: 1,
            rotation: 0,
            boxShadow: "0 0 0 rgba(0,0,0,0)",
            filter: "brightness(1) blur(0px)",
            backgroundColor: "#C8145A",
            duration: 0.4,
            ease: "power2.inOut",
          });
        }}
      >
        Enter Ritual Space
      </a>
    </div>
  );
};

export default HeroSection;
