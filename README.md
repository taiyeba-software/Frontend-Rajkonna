# Rajkonna 👑

A reimagined luxury skincare website project. Experience the perfect blend of elegance, performance, and conscious beauty with Rajkonna's premium skincare line.


---

## ✨ Features

- **🎭 Immersive Hero Experience**: Dynamic video background with animated text overlays and smooth parallax effects
- **⭐ Animated Starry Background**: Multi-layered starfield with glitter animations for a cosmic feel
- **🌀 Smooth Scrolling**: Lenis-powered smooth scrolling with GSAP animations
- **🎵 Audio Integration**: Background music toggle for enhanced user experience
- **📱 Responsive Design**: Fully responsive across all devices with mobile-first approach
- **🛒 Product Showcase**: Interactive product galleries with hover effects and smooth scrolling
- **📧 Contact Section**: Elegant contact form with parallax background effects
- **🎨 Custom Animations**: GSAP-powered animations with ScrollTrigger for engaging interactions
- **🌿 Conscious Branding**: Clean, conscious, and performance-focused skincare philosophy

---

## 🛠️ Tech Stack

### Frontend Framework
- ⚛️ **React 19** - Modern React with latest features
- 🎞️ **Vite** - Fast build tool and development server

### Animation & Interactions
- 🎬 **GSAP** - Professional-grade animation library
- 🌊 **Framer Motion** - React animation library for complex animations
- 🌀 **Lenis** - Smooth scrolling library
- 📜 **ScrollTrigger** - GSAP plugin for scroll-based animations

### Styling & UI
- 🌿 **Tailwind CSS** - Utility-first CSS framework
- 🎨 **Custom Fonts** - Edu NSW ACT Cursive and MPLUS Rounded fonts
- 🎯 **Lucide React** - Beautiful icon library
- 📱 **React Responsive** - Responsive design utilities

### Development Tools
- 🔧 **ESLint** - Code linting and formatting
- 📦 **Vite Plugins** - Optimized build and development experience

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/taiyeba-software/Rajkonna-website.git
   cd Rajkonna-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## 📁 Project Structure

```
Rajkonna-website/
├── public/
│   ├── assets/
│   │   ├── audio/          # Background music files
│   │   ├── fonts/          # Custom font files
│   │   ├── images/         # Static images
│   │   └── videos/         # Hero video content
│   ├── facewash/           # Facewash product images
│   ├── Moisture/           # Moisture product images
│   └── fab.png            # Favicon
├── src/
│   ├── components/
│   │   ├── AboutSection.jsx    # About section with parallax
│   │   ├── AudioToggle.jsx     # Background music control
│   │   ├── Contact.jsx         # Contact form and info
│   │   ├── Facewash.jsx        # Facewash product gallery
│   │   ├── Hero.jsx            # Main hero container
│   │   ├── HeroSection.jsx     # Animated hero text
│   │   ├── Moisture.jsx        # Moisture product gallery
│   │   ├── Navbar.jsx          # Navigation component
│   │   ├── Product.jsx         # Product section wrapper
│   │   ├── RajkonnaFooter.jsx  # Footer with social links
│   │   ├── StarBackground.jsx  # Animated starfield
│   │   └── VideoPinSection.jsx # Video background component
│   ├── lib/
│   │   └── utils.jsx          # Utility functions
│   ├── pages/
│   │   ├── Home.jsx           # Main landing page
│   │   └── NotFound.jsx       # 404 error page
│   ├── styles/
│   ├── App.jsx                # Main app component
│   ├── index.css              # Global styles and Tailwind
│   └── main.jsx               # App entry point
├── index.html                 # HTML template
├── package.json               # Dependencies and scripts
├── vite.config.js             # Vite configuration
└── README.md                  # Project documentation
```

---

## 🎯 Key Components

### Hero Section
- Video background with lazy loading
- Animated text with GSAP ScrollTrigger
- Starry background overlay
- Call-to-action button with hover effects

### Product Galleries
- Horizontal scrolling product cards
- Hover effects with image transitions
- Pricing display with discounts
- Smooth scroll navigation

### About Section
- Parallax scrolling effects
- Animated text reveals
- Floating rose elements
- Brand philosophy cards

### Contact Section
- Multi-layer parallax background
- Newsletter subscription form
- Social media links
- Contact information

---

## 🎨 Design Philosophy

Rajkonna embodies the concept of "Clean, Conscious, Performance" skincare:

- **Clean**: Transparent ingredients, no harmful chemicals
- **Conscious**: Planet-friendly, ethically sourced
- **Performance**: Effective, multi-tasking formulas

The website design reflects this philosophy through:
- Elegant, minimalist aesthetics
- Smooth, performant animations
- Conscious use of resources
- Accessible and inclusive design

---

## 🔧 Customization

### Colors
The color scheme is defined in `src/index.css` using CSS custom properties:
```css
:root {
  --background: 340 26% 70%;
  --foreground: 0 0% 95%;
  --primary: 26 44% 89%;
  /* ... */
}
```

### Fonts
Custom fonts are loaded from `/public/assets/fonts/`:
- **Edu NSW ACT Cursive**: For headings and decorative text
- **MPLUS Rounded**: For body text and UI elements

### Animations
GSAP animations are configured in individual components. Adjust timing and easing in the respective component files.

---

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

---


*Feel like royalty, every single day* 👑
