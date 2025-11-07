import { useEffect, useState, useRef, useContext } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { Menu, X, ShoppingBag, LogIn } from "lucide-react";
import { AudioToggle } from "@/components/AudioToggle";
import { AuthContext } from "../context/AuthContext";
import { ModalContext } from "../context/ModalContext";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const navItems = [
  { name: "Home", href: "#hero" },
  { name: "About", href: "#about" },
  { name: "Products", href: "/products" }, // <-- now links to the product page
  { name: "Contact", href: "#contact" },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navContainerRef = useRef(null);
  const { user, logout } = useContext(AuthContext);
  const { openModal } = useContext(ModalContext);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    const body = document.body;
    if (isMenuOpen) {
      body.style.overflow = "hidden";
      body.style.position = "fixed";
      body.style.width = "100%";
    } else {
      body.style.overflow = "";
      body.style.position = "";
      body.style.width = "";
    }
    return () => {
      body.style.overflow = "";
      body.style.position = "";
      body.style.width = "";
    };
  }, [isMenuOpen]);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP hover animation for desktop nav links
  useGSAP(() => {
    const links = gsap.utils.toArray(".nav-link");
    links.forEach((link) => {
      const underline = link.querySelector(".underline-span");
      const tl = gsap.timeline({ paused: true });
      tl.to(underline, { width: "100%", duration: 0.4, ease: "easeInOut" });
      link.addEventListener("mouseenter", () => tl.play());
      link.addEventListener("mouseleave", () => tl.reverse());
    });
  }, { scope: navContainerRef });

  return (
    <nav
      ref={navContainerRef}
      className={cn(
        "navbar transition-all duration-300 z-50",
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-xs" : "bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between py-4" style={{ fontFamily: "MPLUS-Rounded" }}>
        {/* Brand Logo */}
        <div className="flex items-center gap-4">
          <div className="text-xl font-bold text-primary flex items-center">
            <img src="/images/Rajkonna.png" alt="Brand Logo" className="h-10" />
          </div>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item, key) => (
            <a
              key={key}
              href={item.href}
              className="nav-link relative text-sm font-light text-foreground/80 hover:text-primary transition-colors duration-300 group"
            >
              {item.name}
              <span
                className="underline-span absolute left-0 -bottom-0.5 h-[1px] bg-primary block"
                style={{ width: 0 }}
              />
            </a>
          ))}
        </div>

        {/* Desktop Auth & Cart */}
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <>
              <button
                onClick={() => openModal("login")}
                className="px-3 py-1 text-sm font-light text-foreground hover:text-primary border border-border hover:border-primary rounded-full transition flex items-center gap-1"
              >
                <LogIn size={18} /> Log In
              </button>
              <button
                onClick={() => openModal("register")}
                className="px-3 py-1 text-sm font-light text-foreground hover:text-primary border border-border hover:border-primary rounded-full transition flex items-center gap-1"
              >
                Create Account
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() =>
                  toast.success(`Welcome ${user.name || "User"} 💖`, { style: { fontFamily: "MPLUSRounded" } })
                }
                className="px-3 py-1 text-sm font-light text-foreground hover:text-primary border border-border hover:border-primary rounded-full transition flex items-center gap-1"
              >
                Profile
              </button>
              <button
                onClick={async () => await logout()}
                className="px-3 py-1 text-sm font-light text-foreground hover:text-primary border border-border hover:border-primary rounded-full transition flex items-center gap-1"
              >
                Logout
              </button>
            </>
          )}

          <Link to="/cart" className="px-3 py-1 text-sm font-light text-foreground hover:text-primary border border-border hover:border-primary rounded-full transition flex items-center gap-1">
            <ShoppingBag size={18} /> Cart
          </Link>

          <AudioToggle />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 text-foreground z-50"
          aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        <div
          className={cn(
            "fixed inset-0 bg-background/95 backdrop-blur-md z-40 flex flex-col items-center justify-center transition-all duration-300 md:hidden",
            isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
        >
          <div className="flex flex-col items-center space-y-8 text-xl" style={{ fontFamily: "EduCursive" }}>
            {navItems.map((item, key) => (
              <a
                key={key}
                href={item.href}
                className="text-foreground/80 hover:text-primary hover:underline underline-offset-4 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}

            {!user ? (
              <>
                <button
                  onClick={() => { setIsMenuOpen(false); openModal("login"); }}
                  className="text-foreground/80 hover:text-primary flex items-center gap-2 hover:underline underline-offset-4"
                >
                  <LogIn size={20} /> Log In
                </button>
                <button
                  onClick={() => { setIsMenuOpen(false); openModal("register"); }}
                  className="text-foreground/80 hover:text-primary flex items-center gap-2 hover:underline underline-offset-4"
                >
                  Create Account
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { toast.success(`Welcome ${user.name || "User"} 💖`); setIsMenuOpen(false); }}
                  className="text-foreground/80 hover:text-primary flex items-center gap-2 hover:underline underline-offset-4"
                >
                  Profile
                </button>
                <button
                  onClick={async () => { await logout(); setIsMenuOpen(false); }}
                  className="text-foreground/80 hover:text-primary flex items-center gap-2 hover:underline underline-offset-4"
                >
                  Logout
                </button>
              </>
            )}

            <Link
              to="/cart"
              className="text-foreground/80 hover:text-primary flex items-center gap-2 hover:underline underline-offset-4"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingBag size={20} /> Cart
            </Link>

            <AudioToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};
