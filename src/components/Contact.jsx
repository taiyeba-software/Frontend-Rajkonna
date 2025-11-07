
"use client";
import { useScroll, useSpring, animated } from "@react-spring/web";
import { useRef } from "react";
import bgImg from "/assets/contact-bg.jpg"; // your skincare image
import StarBackground  from "./StarBackground";

export const Contact = () => {
  const ref = useRef();
  const { scrollYProgress } = useScroll({
  // tracks whole window scroll instead of a specific ref
  container: typeof window !== "undefined" ? window : undefined,
  });


  // Parallax layer animations
  const imageSpring = useSpring({
  transform: scrollYProgress.to((y) => `translateY(${y * -50}px) scale(1.1)`),
  });

  const whiteLayerSpring = useSpring({
    transform: scrollYProgress.to((y) => `translateY(${y * -30}px)`),
  });

  const blackLayerSpring = useSpring({
    transform: scrollYProgress.to((y) => `translateY(${y * -160}px)`),
  });

  

  return (
    <section
      ref={ref}
      id="contact"
      className="relative w-full h-[150vh] overflow-hidden grid grid-cols-1 md:grid-cols-2"
    >
      {/* 🌸 Layer 1 – Background Image */}
      <animated.div
        style={imageSpring}
        className="absolute inset-0 w-full h-[200vh]"
      >
        <img
          src={bgImg}
          alt="Skincare products"
          className="w-full h-full object-cover"
        />
      </animated.div>

      <animated.div
          style={whiteLayerSpring}
          className="absolute top-[50vh] top-md-[62vh] left-0 w-full h-[80vh]  bg-background backdrop-blur-sm shadow-lg flex justify-start items-center px-16 py-10 text-gray-700"
        >
          <StarBackground/>

          <div className="w-1/2 flex justify-evenly flex-wrap gap-10">
            <div className="flex flex-col space-y-1">
              <h3 className="text-md font-bold text-[#C8145A]" style={{ fontFamily: "EduCursive" }}>EXPLORE</h3>
              <ul className="space-y-1 text-sm" style={{ fontFamily: "MPLUSRounded" }}>
                <li>Shop</li>
                <li>Philosophy</li>
                <li>Gallery</li>
                <li>Journal</li>
                <li>Sign Up/Login</li>
              </ul>
            </div>

            <div className="flex flex-col space-y-2">
              <h3 className="text-md font-bold text-[#C8145A]"  style={{ fontFamily: "EduCursive" }} >FOLLOW US</h3>
              <p style={{ fontFamily: "MPLUSRounded" }}>Instagram</p>
              <p style={{ fontFamily: "MPLUSRounded" }}>Facebook</p>
            </div>

            <div className="flex flex-col space-y-2">
              <h3 className="text-md font-bold text-[#C8145A]"  style={{ fontFamily: "EduCursive" }}>CONTACT US</h3>
              <p style={{ fontFamily: "MPLUSRounded" }}>Rajkonna@gmail.com</p>
              <p style={{ fontFamily: "MPLUSRounded" }}>1111-2222-3333</p>
            </div>
          </div>
        </animated.div>

  


      {/* 🖤 Layer 3 – Black contact form */}
      
      <animated.div
        style={blackLayerSpring}
        className="absolute right-0 top-[50vh] bg-black text-white rounded-l-3xl shadow-2xl p-14 w-[45%] h-[80vh]"
      >
        <h2 className="text-2xl font-bold mb-4 tracking-wide" style={{ fontFamily: "EduCursive" }}>
          HEAR MORE FROM US
        </h2>
        <p className="text-gray-400 mb-8 text-sm"  style={{ fontFamily: "MPLUSRounded" }}>
          Get the latest news about skincare tips and new products.
        </p>

        <form className="space-y-6">
          <input
            type="email"
            placeholder="YOUR EMAIL"
            className="w-full px-[15vw] py-1 rounded-full border border-gray-500 bg-transparent text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C8145A] text-sm"
          />
          <animated.button
            type="submit"
            className="block mx-auto bg-gray-700 hover:bg-[#C8145A] text-white px-8 py-3 rounded-full text-md transition-all"
          >
            SUBSCRIBE
          </animated.button>
        </form>

        <p className="mt-8 text-xs text-gray-500 text-center hidden md:block ">
          No Spam, only quality articles that make you more radiant. You can opt out anytime.
        </p>
      </animated.div>
     


    </section>
  );
};
