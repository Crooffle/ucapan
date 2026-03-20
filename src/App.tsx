import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
  useInView,
  useMotionValueEvent,
  MotionValue,
  useMotionValue,
  useMotionTemplate,
} from "motion/react";
import { 
  Moon, 
  Star, 
  Sparkles, 
  Send, 
  ArrowRight, 
  Heart, 
  Share2, 
  Music2, 
  Volume2, 
  VolumeX,
  Compass,
  Users,
  Utensils,
  Gift
} from "lucide-react";

// --- Constants & Easing ---
const EASE_AE = [0.16, 1, 0.3, 1]; 
const GOLD = "#d4af37";

// --- Components ---

/**
 * Floating Lantern Component
 */
const Lantern = ({ delay = 0, x = "50%", y = "50%", size = 40 }: { delay?: number; x?: string; y?: string; size?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ 
        opacity: [0.4, 0.8, 0.4],
        y: [0, -40, 0],
        rotate: [-5, 5, -5]
      }}
      transition={{
        y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay },
        rotate: { duration: 8, repeat: Infinity, ease: "easeInOut", delay },
        opacity: { duration: 4, repeat: Infinity, ease: "easeInOut", delay },
        initial: { duration: 2, delay }
      }}
      style={{ left: x, top: y, width: size, height: size * 1.5 }}
      className="absolute pointer-events-none z-0"
    >
      <div className="w-full h-full bg-[#d4af37]/20 blur-[10px] absolute inset-0 rounded-full" />
      <div className="w-full h-full border border-[#d4af37]/40 rounded-t-full rounded-b-lg relative flex flex-col items-center">
        <div className="w-1/2 h-1/2 bg-[#d4af37]/30 mt-2 rounded-full blur-[5px]" />
        <div className="absolute bottom-0 w-full h-1/4 border-t border-[#d4af37]/40" />
      </div>
    </motion.div>
  );
};

/**
 * Advanced Typographic Reveal
 */
const RevealText = ({
  text,
  className = "",
  delay = 0,
  stagger = 0.05,
  as: Tag = "div",
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: any;
}) => {
  const words = text.split(" ");
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10%" });

  return (
    <Tag ref={containerRef} className={`flex flex-wrap ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.3em] py-[0.1em]">
          <motion.span
            initial={{ y: "100%", skewY: 10, opacity: 0 }}
            animate={
              isInView
                ? { y: 0, skewY: 0, opacity: 1 }
                : { y: "100%", skewY: 10, opacity: 0 }
            }
            transition={{
              duration: 1.2,
              delay: delay + i * stagger,
              ease: EASE_AE,
            }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
};

/**
 * Magnetic Button
 */
const MagneticButton = ({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 200, damping: 20, mass: 0.1 }}
      className={`relative group ${className}`}
      onClick={onClick}
    >
      <span className="relative z-10">{children}</span>
      <motion.div
        className="absolute inset-0 bg-white/10 rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        layoutId="magnetic-bg"
      />
    </motion.button>
  );
};

const ALLOWED_NAMES = [
  "zidane",
  "rakha",
  "guest",
  "zahra",
  "bayu",
  "arip" // Anda bisa menambahkan nama lain di sini nanti
];

// --- Awwwards Core Components ---

const Noise = () => (
  <div className="fixed inset-0 z-[9999] pointer-events-none opacity-[0.05] mix-blend-overlay overflow-hidden">
    <svg width="100%" height="100%" className="opacity-20">
      <filter id="noiseFilter">
        <feTurbulence 
          type="fractalNoise" 
          baseFrequency="0.6" 
          numOctaves="3" 
          stitchTiles="stitch" 
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);

function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(
        target.tagName.toLowerCase() === 'a' || 
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'input' ||
        target.closest('a') !== null || 
        target.closest('button') !== null ||
        target.classList.contains('cursor-pointer')
      );
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div
        style={{ x: cursorX, y: cursorY }}
        className="fixed top-0 left-0 w-2 h-2 bg-[#d4af37] rounded-full pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference hidden md:block"
        animate={{ opacity: isHovering ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        style={{ x: smoothX, y: smoothY }}
        className="fixed top-0 left-0 w-10 h-10 border border-[#d4af37]/50 rounded-full pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center backdrop-blur-sm hidden md:flex"
        animate={{
          scale: isHovering ? 1.8 : 1,
          backgroundColor: isHovering ? "rgba(212, 175, 55, 0.1)" : "rgba(0, 0, 0, 0.0)",
          borderColor: isHovering ? "rgba(212, 175, 55, 0)" : "rgba(212, 175, 55, 0.5)",
        }}
        transition={{ duration: 0.3 }}
      />
    </>
  );
}

function Preloader({ onComplete }: { onComplete: () => void; key?: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 10) + 2;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 800);
      }
      setProgress(current);
    }, 120);
    
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-[100000] bg-[#050505] flex flex-col items-center justify-center px-6 overflow-hidden"
      exit={{ 
        y: "-100%", 
        transition: { 
          duration: 1.2, 
          ease: [0.85, 0, 0.15, 1] 
        } 
      }}
    >
      {/* Decorative Shutter Layers */}
      <motion.div 
        initial={{ y: "100%" }}
        exit={{ y: "-100%" }}
        transition={{ duration: 1.2, ease: [0.85, 0, 0.15, 1], delay: 0.1 }}
        className="absolute inset-0 bg-[#d4af37]/5 z-0"
      />
      
      <div className="w-full max-w-xs flex flex-col justify-center gap-4 relative z-10">
        <div className="flex justify-between items-end font-mono text-[10px] tracking-widest text-[#d4af37]">
          <span>LOADING EXPERIENCE</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-px bg-white/10 relative overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-[#d4af37]"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

const Gatekeeper = ({ onEnter }: { onEnter: (name: string) => void }) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const particles = React.useMemo(() => {
    return [...Array(20)].map(() => ({
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
      y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
      duration: Math.random() * 10 + 10,
      animY: Math.random() * -500
    }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = ALLOWED_NAMES.some(allowed => 
      input.toLowerCase().includes(allowed.toLowerCase())
    );
    
    if (isValid) {
      onEnter(input);
    } else {
      setError("Maaf, nama tidak terdaftar dalam undangan.");
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#050505] text-[#f5f5f0] flex items-center justify-center grain scanlines">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_60%)] pointer-events-none" />
      
      {/* Floating particles background for gatekeeper */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         {particles.map((p, i) => (
           <motion.div
             key={i}
             className="absolute w-1 h-1 bg-[#d4af37]/30 rounded-full"
             initial={{ x: p.x, y: p.y }}
             animate={{
               y: [null, p.animY],
               opacity: [0, 1, 0],
             }}
             transition={{
               duration: p.duration,
               repeat: Infinity,
               ease: "linear",
             }}
           />
         ))}
      </div>

      <motion.form 
        initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.2, ease: EASE_AE }}
        onSubmit={handleSubmit} 
        className="glass p-12 rounded-[40px] flex flex-col items-center text-center max-w-md w-full mx-6 relative z-10 border border-[#d4af37]/20 shadow-[0_0_50px_rgba(212,175,55,0.1)]"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Star size={40} strokeWidth={1} className="text-[#d4af37] mb-8 opacity-80" />
        </motion.div>
        
        <h2 className="font-display text-5xl mb-3 tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">Welcome</h2>
        <p className="font-serif italic opacity-60 text-xl mb-12">Please enter your name to open</p>
        
        <div className="w-full relative mb-8">
          <input 
            type="text" 
            value={input} 
            onChange={e => { setInput(e.target.value); setError(""); }} 
            className="w-full bg-transparent border-b-2 border-white/10 focus:border-[#d4af37] outline-none px-4 py-3 text-center text-3xl font-serif italic transition-colors placeholder:text-white/10" 
            placeholder="Your Name..." 
          />
          <AnimatePresence>
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                className="absolute -bottom-8 left-0 w-full text-red-400/80 text-xs font-mono uppercase tracking-widest"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        
        <MagneticButton className="mt-4 px-12 py-5 bg-gradient-to-r from-[#d4af37] to-[#b5952f] text-black rounded-full font-mono text-xs uppercase tracking-[0.3em] font-bold hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-500">
          Open Invitation
        </MagneticButton>
      </motion.form>
    </div>
  );
};

/**
 * Bento Card
 */
const BentoCard = ({ 
  title, 
  description, 
  icon: Icon, 
  className = "", 
  delay = 0 
}: { 
  title: string; 
  description: string; 
  icon: any; 
  className?: string;
  delay?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 1, delay, ease: EASE_AE }}
      className={`glass p-8 rounded-3xl flex flex-col justify-between group hover:border-[#d4af37]/40 transition-colors duration-500 ${className}`}
    >
      <div className="flex justify-between items-start">
        <div className="p-3 rounded-2xl bg-[#d4af37]/10 text-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-black transition-colors duration-500">
          <Icon size={24} />
        </div>
        <ArrowRight size={20} className="opacity-0 group-hover:opacity-40 -translate-x-4 group-hover:translate-x-0 transition-all duration-500" />
      </div>
      <div>
        <h3 className="text-xl font-serif italic mb-2">{title}</h3>
        <p className="text-sm opacity-50 font-sans leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

/**
 * Interactive Typographic Row for Section 4
 */
const HoverTypoRow = ({ title, desc, number }: { title: string; desc: string; number: string }) => {
  return (
    <motion.div 
      initial="initial"
      whileHover="hover"
      className="group relative flex flex-col border-b border-white/10 pb-6 cursor-pointer"
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-6">
          <span className="font-mono text-xs opacity-30 group-hover:text-[#d4af37] group-hover:opacity-100 transition-colors duration-500">{number}</span>
          <motion.h3 
            variants={{
              initial: { x: 0, fontStyle: "normal", color: "rgba(255,255,255,0.8)" },
              hover: { x: 10, fontStyle: "italic", color: "#d4af37" }
            }}
            transition={{ duration: 0.5, ease: EASE_AE }}
            className="text-4xl md:text-5xl font-display uppercase tracking-wider"
          >
            {title}
          </motion.h3>
        </div>
        <ArrowRight className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 text-[#d4af37]" />
      </div>
      
      <motion.div 
        variants={{
          initial: { height: 0, opacity: 0 },
          hover: { height: "auto", opacity: 0.5, marginTop: "1rem" }
        }}
        transition={{ duration: 0.5, ease: EASE_AE }}
        className="overflow-hidden font-sans text-sm pl-[3.5rem]"
      >
        {desc}
      </motion.div>
    </motion.div>
  );
};

// --- Main App ---

const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
};

const FADE_UP = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
};

const FADE_IN = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
};

const SCALE_UP = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 } }
};

function MainContent({ userName }: { userName: string }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlightBackground = useMotionTemplate`radial-gradient(800px circle at ${mouseX}px ${mouseY}px, rgba(212, 175, 55, 0.1), transparent 80%)`;
  
  const smoothMouseX = useSpring(mouseX, { stiffness: 400, damping: 30, mass: 0.5 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 400, damping: 30, mass: 0.5 });
  const cursorX = useTransform(smoothMouseX, (x) => x - 24);
  const cursorY = useTransform(smoothMouseY, (y) => y - 24);

  const [isMuted, setIsMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Parallax & Scale Transforms
  const heroScale = useTransform(smoothProgress, [0, 0.2], [1, 1.2]);
  const heroBlur = useTransform(smoothProgress, [0, 0.15], ["blur(0px)", "blur(10px)"]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);
  const moonY = useTransform(smoothProgress, [0, 0.3], [0, -150]);

  // Handle Mouse Move
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  // Scrollytelling Logic for Section 3
  const storyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: storyProgress } = useScroll({
    target: storyRef,
    offset: ["start start", "end end"]
  });
  
  // Track maximum progress strictly to prevent the blur effect from replaying in reverse
  const maxStoryProgress = useMotionValue(0);
  useMotionValueEvent(storyProgress, "change", (latest) => {
    if (latest > maxStoryProgress.get()) {
      maxStoryProgress.set(latest);
    }
  });

  const forOpacity = useTransform(storyProgress, [0.0, 0.08], [0, 1]);
  const forY = useTransform(storyProgress, [0.0, 0.08], [50, 0]);
  const forBlur = useTransform(maxStoryProgress, [0.0, 0.08], ["blur(20px)", "blur(0px)"]);
  
  const youOpacity = useTransform(storyProgress, [0.08, 0.16], [0, 1]);
  const youY = useTransform(storyProgress, [0.08, 0.16], [50, 0]);
  const youBlur = useTransform(maxStoryProgress, [0.08, 0.16], ["blur(20px)", "blur(0px)"]);
  
  const nameOpacity = useTransform(storyProgress, [0.16, 0.28], [0, 1]);
  const nameScale = useTransform(storyProgress, [0.16, 0.28], [0.9, 1]);
  const nameBlur = useTransform(maxStoryProgress, [0.16, 0.28], ["blur(20px)", "blur(0px)"]);
  const nameY = useTransform(storyProgress, [0.16, 0.28], [50, 0]);

  // Smooth fade out before entering Section 4
  const fadeOutOpacity = useTransform(storyProgress, [0.85, 0.95], [1, 0]);

  // Marquee Scroll Logic
  const marqueeRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: marqueeProgress } = useScroll({
    target: marqueeRef,
    offset: ["start start", "end end"]
  });
  
  // Turunkan kecepatan secara drastis (dari 15% ke 8%) agar pergerakannya sangat tenang dan elegan
  const mX = useTransform(marqueeProgress, [0, 1], ["-8%", "0%"]);
  const mXRev = useTransform(marqueeProgress, [0, 1], ["0%", "-8%"]);

  const greetingParagraphs = [
    "Eid Mubarak.",
    "May Allah accept every prayer you’ve made, even the ones you couldn’t put into words. May He ease what weighs on your heart, grant you quiet strength, and guide you toward what is truly best for you.",
    "I pray this Eid brings you a deep sense of peace, sincere happiness, and blessings that stay with you long after the day has passed."
  ];

  const typingStart = 0.30;
  const typingEnd = 0.70;
  
  const wordsWithTiming = React.useMemo(() => {
    let index = 0;
    const totalWords = greetingParagraphs.reduce((sum, p) => sum + p.split(" ").length, 0);
    const step = (typingEnd - typingStart) / Math.max(totalWords, 1);
    
    return greetingParagraphs.map((p) => {
      return p.split(" ").map((word) => {
        const start = typingStart + index * step;
        const end = start + step * 2;
        index++;
        return { word, start, end };
      });
    });
  }, [typingStart, typingEnd]);

  return (
    <div
      ref={containerRef}
      className="relative bg-[#050505] text-[#f5f5f0] font-sans selection:bg-[#d4af37] selection:text-black grain scanlines min-h-screen overflow-x-clip"
    >
      {/* --- Global Visuals --- */}
      <div className="atmosphere" />
      
      {/* Interactive Spotlight */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-50 mix-blend-screen opacity-20"
        style={{
          background: spotlightBackground,
        }}
      />

      {/* Floating Lanterns Layer */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <Lantern x="10%" y="20%" delay={0} size={30} />
        <Lantern x="85%" y="15%" delay={1.5} size={45} />
        <Lantern x="75%" y="60%" delay={3} size={35} />
        <Lantern x="15%" y="75%" delay={4.5} size={50} />
        <Lantern x="50%" y="40%" delay={2} size={25} />
      </div>

      {/* --- Navigation --- */}
      <nav className="fixed top-0 w-full p-8 flex justify-between items-center z-[60] mix-blend-difference">
        <MagneticButton onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-display text-4xl tracking-tighter cursor-pointer"
          >
            EID<span className="text-[#d4af37]">.</span>26
          </motion.div>
        </MagneticButton>
        
        <div className="flex items-center gap-8">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-full border border-white/10 hover:border-[#d4af37]/50 transition-colors"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <MagneticButton className="px-6 py-2 glass rounded-full font-mono text-[10px] uppercase tracking-widest">
            Menu
          </MagneticButton>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden z-10">
        <motion.div
          style={{ scale: heroScale, filter: heroBlur, opacity: heroOpacity }}
          className="relative flex flex-col items-center"
        >
          {/* Moon Element */}
          <motion.div
            style={{ y: moonY }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2.5, ease: EASE_AE }}
            className="relative mb-8"
          >
            <div className="absolute inset-0 bg-[#d4af37] blur-[150px] opacity-20 rounded-full" />
            <Moon 
              size={180} 
              strokeWidth={0.3} 
              className="text-[#d4af37] relative z-10 drop-shadow-[0_0_50px_rgba(212,175,55,0.4)]" 
            />
            <motion.div
              animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.2, 1] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -top-6 -right-6"
            >
              <Sparkles size={40} className="text-[#d4af37]" />
            </motion.div>
          </motion.div>

          {/* Hero Typography */}
          <div className="text-center px-6">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="font-mono text-[10px] uppercase tracking-[0.6em] text-[#d4af37] mb-8"
            >
              Celebrating the Festival of Breaking the Fast
            </motion.p>
            
            <h1 className="flex flex-col items-center">
              <RevealText
                text="EID AL-FITR"
                className="font-display text-8xl md:text-[14vw] leading-[0.85] tracking-tighter mb-2"
                delay={1}
              />
              <RevealText
                text="MUBARAK 1447 H"
                className="font-serif italic text-3xl md:text-6xl tracking-tight opacity-40"
                delay={1.4}
              />
            </h1>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 2, duration: 2, ease: EASE_AE }}
              className="h-px bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent mt-12 max-w-md mx-auto"
            />
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 flex flex-col items-center gap-4 opacity-30"
        >
          <span className="font-mono text-[8px] uppercase tracking-[0.4em]">Begin the Experience</span>
          <div className="w-px h-16 bg-gradient-to-b from-[#d4af37] to-transparent" />
        </motion.div>
      </section>

      {/* --- Kinetic Marquee Section --- */}
      <section ref={marqueeRef} className="relative h-[300vh] z-10 pointer-events-none">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center gap-8 opacity-60">
          <motion.h2
            style={{ x: mX, WebkitTextStroke: "1.5px rgba(212,175,55,0.8)" }}
            className="text-[12vw] font-display whitespace-nowrap leading-none italic text-transparent w-max"
          >
            FORGIVENESS • GRATITUDE • UNITY • PEACE • FORGIVENESS • GRATITUDE • UNITY • PEACE • FORGIVENESS • GRATITUDE • UNITY • PEACE • FORGIVENESS • GRATITUDE • UNITY • PEACE •
          </motion.h2>
          <motion.h2
            style={{ x: mXRev, WebkitTextStroke: "1.5px rgba(212,175,55,0.8)" }}
            className="text-[12vw] font-display whitespace-nowrap leading-none text-transparent w-max"
          >
            CELEBRATION • HARMONY • BLESSINGS • LOVE • CELEBRATION • HARMONY • BLESSINGS • LOVE • CELEBRATION • HARMONY • BLESSINGS • LOVE • CELEBRATION • HARMONY • BLESSINGS • LOVE •
          </motion.h2>
        </div>
      </section>

      {/* --- Scrollytelling Section --- */}
      <section ref={storyRef} className="relative h-[500vh] z-20">
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-6 overflow-clip">
          
          <motion.div 
            style={{ opacity: fadeOutOpacity }}
            className="flex flex-col items-center justify-center text-center max-w-5xl w-full"
          >
            
            <div className="flex gap-4 md:gap-5 text-5xl md:text-7xl font-serif italic mb-4">
              <motion.span style={{ opacity: forOpacity, y: forY, filter: forBlur, display: "inline-block" }}>For</motion.span>
              <motion.span style={{ opacity: youOpacity, y: youY, filter: youBlur, display: "inline-block" }} className="text-[#d4af37]">You,</motion.span>
            </div>
            
            <motion.div 
              style={{ opacity: nameOpacity, scale: nameScale, filter: nameBlur, y: nameY }}
              className="font-display text-[10vw] sm:text-6xl md:text-[8vw] mb-6 md:mb-8 max-w-full overflow-hidden text-ellipsis whitespace-pre-wrap uppercase tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              {userName}
            </motion.div>

            {/* The Greeting Messages */}
            <div className="max-w-5xl px-4 w-full flex flex-col items-center gap-6 md:gap-8 relative">
              {/* Subtle ambient glow behind text */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06)_0%,transparent_60%)] pointer-events-none -z-10" />

              {wordsWithTiming.map((paragraph, pIdx) => {
                const isTitle = pIdx === 0;
                let wordClass = "text-xl md:text-2xl font-serif italic text-white/80 text-center";
                
                if (isTitle) {
                  wordClass = "text-3xl md:text-5xl font-display uppercase tracking-[0.2em] text-[#d4af37] drop-shadow-[0_0_20px_rgba(212,175,55,0.4)]";
                }

                return (
                  <div key={pIdx} className={`flex flex-wrap justify-center gap-x-2 md:gap-x-3 gap-y-1 md:gap-y-2 relative w-full`}>
                    {/* Decorative Giant Background Quotes */}
                    {pIdx === 1 && (
                      <span className="absolute -top-10 -left-6 md:-left-12 text-[100px] font-serif opacity-[0.03] text-white select-none leading-none">"</span>
                    )}
                    {pIdx === 2 && (
                      <span className="absolute -bottom-8 -right-6 md:-right-12 text-[100px] font-serif opacity-[0.03] text-white select-none leading-none">"</span>
                    )}

                    {paragraph.map((item, wIdx) => (
                      <ScrollWord 
                        key={`${pIdx}-${wIdx}`} 
                        progress={storyProgress} 
                        maxProgress={maxStoryProgress} 
                        range={[item.start, item.end]}
                        className={wordClass}
                      >
                        {item.word}
                      </ScrollWord>
                    ))}
                    
                    {/* Golden divider gracefully placed after Title block */}
                    {isTitle && (
                      <div className="w-full flex justify-center mt-6 mb-2">
                        <div className="w-px h-10 bg-gradient-to-b from-[#d4af37]/60 to-transparent" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </motion.div>
        </div>
      </section>

      {/* --- Section 4: Typography Interactive Area --- */}
      <section className="relative min-h-[100vh] flex flex-col md:flex-row items-center justify-center px-6 z-30 py-32 bg-[#050505] overflow-hidden">
        <motion.div 
          variants={STAGGER_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          className="w-full md:w-1/2 flex flex-col justify-center items-start pl-0 md:pl-16 mb-16 md:mb-0"
        >
          <motion.h2 variants={FADE_UP} className="font-display text-4xl md:text-7xl leading-[1.1] mb-6 text-[#d4af37]">
            THE ESSENCE <br />OF EID
          </motion.h2>
          <motion.p variants={FADE_UP} className="font-sans text-xl md:text-2xl text-white/50 max-w-lg leading-relaxed">
            A moment to return to purity, weave harmony, and celebrate reconciliation with our loved ones.
          </motion.p>
        </motion.div>
        
        <motion.div 
          variants={STAGGER_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          className="w-full md:w-1/2 flex flex-col justify-center items-end pr-0 md:pr-16 gap-6"
        >
          <motion.div variants={FADE_UP} className="w-full">
            <HoverTypoRow title="FORGIVENESS" desc="Forgiving one another, letting go of resentment." number="01" />
          </motion.div>
          <motion.div variants={FADE_UP} className="w-full">
            <HoverTypoRow title="GRATITUDE" desc="Appreciating every little blessing." number="02" />
          </motion.div>
          <motion.div variants={FADE_UP} className="w-full">
            <HoverTypoRow title="UNITY" desc="Strengthening the bonds of family and kinship." number="03" />
          </motion.div>
        </motion.div>
      </section>
      {/* --- Section 5: The Grand Finale --- */}
      <section className="relative min-h-[100vh] flex flex-col items-center justify-center px-6 z-30 pt-32 pb-32 overflow-hidden">
        <motion.div 
          variants={STAGGER_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          className="text-center max-w-6xl w-full"
        >
          <motion.div variants={FADE_IN} className="mb-16 inline-block">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
              <Star size={64} strokeWidth={0.5} className="text-[#d4af37] opacity-40" />
            </motion.div>
          </motion.div>

          <motion.h2 variants={FADE_UP} className="font-display text-5xl md:text-[9vw] leading-[0.8] mb-16 tracking-tighter uppercase relative z-10">
            EMBRACE <br />
            <span className="italic text-[#d4af37] font-serif lowercase">the</span> NEW <br />
            BEGINNING
          </motion.h2>

          <motion.div variants={FADE_UP} className="flex flex-col md:flex-row items-center justify-center gap-6">
            <MagneticButton className="px-12 py-6 bg-[#d4af37] text-black rounded-full font-mono text-[10px] uppercase tracking-widest font-bold flex items-center gap-3 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
              Share the Joy <Share2 size={16} />
            </MagneticButton>
            
            <MagneticButton className="px-12 py-6 glass rounded-full font-mono text-[10px] uppercase tracking-widest flex items-center gap-3 border border-white/10 hover:border-[#d4af37]/50 transition-colors">
              Send Greetings <Send size={16} />
            </MagneticButton>
          </motion.div>
        </motion.div>
      </section>

      {/* --- Section 6: Spécial THR Section --- */}
      <section className="relative min-h-[100vh] flex flex-col items-center justify-center px-6 z-30 pt-24 pb-16 overflow-hidden bg-[#070707]">
        {/* Continuous Ambient Background Typography */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] overflow-hidden pointer-events-none opacity-[0.02] flex flex-col gap-4 z-0">
          <motion.h1 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="font-display text-[25vw] whitespace-nowrap leading-none tracking-tighter"
          >
            T.H.R T.H.R T.H.R T.H.R T.H.R T.H.R T.H.R
          </motion.h1>
          <motion.h1 
            animate={{ x: ["-50%", "0%"] }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="font-display text-[25vw] whitespace-nowrap leading-none tracking-tighter ml-[-15vw]"
          >
            GIFT GIFT GIFT GIFT GIFT GIFT
          </motion.h1>
        </div>

        <motion.div 
          variants={STAGGER_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          className="text-center max-w-6xl relative z-10 w-full flex flex-col items-center"
        >
          
          <motion.div
            variants={SCALE_UP}
            className="mb-12 inline-block relative"
          >
            <div className="absolute inset-0 bg-[#d4af37] blur-[80px] opacity-40 rounded-full" />
            <Gift size={64} strokeWidth={1.5} className="text-[#d4af37] relative z-10 animate-pulse" />
          </motion.div>
          
          <motion.h2 variants={FADE_UP} className="font-display text-4xl md:text-[6vw] leading-[0.85] mb-8 tracking-tighter uppercase relative z-10 text-[#d4af37]">
            SPECIAL EDITION
          </motion.h2>
          
          <motion.p variants={FADE_UP} className="font-sans text-xl md:text-2xl text-white/60 max-w-2xl mx-auto mb-16 leading-relaxed relative z-10">
            As a sign of love and gratitude on this joyful day of victory, a little special reward awaits. <br className="hidden md:block" /> 
            <span className="italic text-[#d4af37]/80">A token of appreciation just for you.</span>
          </motion.p>

          <motion.div variants={FADE_UP} className="flex flex-col items-center justify-center relative z-10 mb-8 w-full max-w-md">
            {/* The Awwwards T.H.R Button linking to WA */}
            <THRButton phone="6281234567890" />
            
            <span className="mt-8 font-mono text-[11px] md:text-[12px] uppercase tracking-widest text-[#d4af37]/50 flex items-center gap-2">
              Claim Now • Limited Availability
            </span>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <footer className="absolute bottom-6 w-full px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30 font-mono text-[10px] uppercase tracking-[0.3em] z-10">
          <div className="flex items-center gap-3">
            <Heart size={14} className="text-[#d4af37]" />
            <span>Crafted by Greyy • 2026</span>
          </div>
          <div className="flex gap-8 md:gap-12">
            <a href="#" className="hover:text-[#d4af37] transition-colors">Instagram</a>
            <a href="#" className="hover:text-[#d4af37] transition-colors">Twitter</a>
            <a href="#" className="hover:text-[#d4af37] transition-colors">Behance</a>
          </div>
        </footer>
      </section>

    </div>
  );
}

function THRButton({ phone }: { phone: string }) {
  const message = "Hello, I would like to claim the Special Edition THR! 🎉";
  const waLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a 
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      initial="initial"
      whileHover="hover"
      className="relative overflow-hidden flex items-center justify-center px-10 md:px-16 py-6 md:py-8 rounded-[50px] border border-[#d4af37]/30 cursor-pointer shadow-[0_0_30px_rgba(212,175,55,0.15)] group"
    >
      {/* Background fill unrolling from bottom */}
      <motion.div 
        variants={{
          initial: { scaleY: 0 },
          hover: { scaleY: 1 }
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 bg-[#d4af37] origin-bottom z-0"
      />
      
      {/* Container layer for text animation */}
      <div className="relative z-10 flex items-center justify-center min-w-[280px] w-full">
        {/* Default State Text */}
        <motion.div 
          variants={{
            initial: { y: 0, opacity: 1 },
            hover: { y: "-100%", opacity: 0 }
          }} 
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} 
          className="flex font-display text-4xl md:text-5xl text-[#d4af37] tracking-[0.2em] uppercase"
        >
          CLAIM THR
        </motion.div>

        {/* Hover State Text (Absolute Overlaid) */}
        <div className="absolute inset-0 flex justify-center items-center font-display text-4xl md:text-5xl text-black tracking-[0.2em] uppercase pointer-events-none">
          {"HERE".split("").map((l, i) => (
            <motion.span 
              key={i} 
              className="inline-block"
              variants={{
                 initial: { y: "150%", rotate: 20, opacity: 0 },
                 hover: { y: 0, rotate: 0, opacity: 1 }
              }}
               transition={{ duration: 0.5, delay: i * 0.02, ease: [0.16, 1, 0.3, 1] }}
            >
              {l === " " ? "\u00A0" : l}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.a>
  );
}

function ScrollWord({ children, progress, maxProgress, range, className = "text-2xl md:text-4xl font-serif italic text-white/80 text-center" }: { children: React.ReactNode, progress: MotionValue<number>, maxProgress: MotionValue<number>, range: number[], className?: string, key?: React.Key }) {
  const opacity = useTransform(progress, range, [0, 1]);
  const filter = useTransform(maxProgress, range, ["blur(12px)", "blur(0px)"]);
  const y = useTransform(progress, range, [20, 0]);
  return (
    <motion.span style={{ opacity, filter, y }} className={`inline-block leading-relaxed ${className}`}>
      {children}
    </motion.span>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Hide default cursor across entire document on desktop devices
    if (window.matchMedia("(min-width: 768px)").matches) {
       const style = document.createElement("style");
       style.id = "hide-cursor";
       style.innerHTML = `* { cursor: none !important; }`;
       document.head.appendChild(style);
    }
    return () => {
      const style = document.getElementById("hide-cursor");
      if (style) style.remove();
    }
  }, []);

  return (
    <div className="bg-[#050505] text-[#f5f5f0] min-h-screen font-sans selection:bg-[#d4af37] selection:text-black">
      <Noise />
      <CustomCursor />
      
      <AnimatePresence mode="wait">
        {loading && <Preloader key="preloader" onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        !isAuthenticated ? (
          <Gatekeeper onEnter={(name) => { setUserName(name); setIsAuthenticated(true); }} />
        ) : (
          <MainContent userName={userName} />
        )
      )}
    </div>
  );
}
