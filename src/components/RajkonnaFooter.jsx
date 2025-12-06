import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";


export const RajkonnaFooter = () => {
  return (
    <footer className="gpu  relative w-full bg-gradient-to-b bg-background text-[#81414d] py-12 px-6 overflow-hidden filter-glitter">
        
      <div className="absolute inset-0 pointer-events-none opacity-30 animate-pulse bg-[url('/stars.svg')] bg-repeat" />

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
        <div className="text-center md:text-left">
          <h3 className="text-3xl  font-bold text-foreground" style={{ fontFamily: "MPLUSRounded" }}>
            Rajkonna
        </h3>

          <p className="mt-1 text-sm font-mplus text-foreground italic">
            Feel like royalty, every single day
          </p>
        </div>
        <div className="flex gap-6 text-primary text-2xl">
          {[
            {
              href: "https://www.facebook.com/rajkonna.social/",
              icon: <FaFacebookF />,
              label: "Facebook",
            },
            {
              href: "https://www.instagram.com/ami.rajkonna/",
              icon: <FaInstagram />,
              label: "Instagram",
            },
            {
              href: "https://www.tiktok.com/@shajgojbd/",
              icon: <FaTiktok />,
              label: "TikTok",
            },
          ].map(({ href, icon, label }, idx) => (
            <motion.a
              key={label}
              href={href}
              title={`Rajkonna ${label}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, rotate: -5 }}
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: 2 + idx * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="hover:text-[#ff91ac] transition-all gpu "
            >
              {icon}
            </motion.a>
          ))}
        </div>

        {/* Right: Copyright */}
        <div className="text-sm text-foreground text-center md:text-right font-mplus">
          &copy; {new Date().getFullYear()} Rajkonna. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
