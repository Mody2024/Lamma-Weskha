import { motion } from 'motion/react';

interface Props {
  className?: string;
  size?: number;
}

export default function Logo({ className = "", size = 64 }: Props) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <motion.div
        initial={{ rotate: -5 }}
        animate={{ rotate: 5 }}
        transition={{ repeat: Infinity, duration: 4, repeatType: "reverse" }}
        className="relative z-10"
      >
        {/* We use the logo.png if it exists, otherwise a fallback SVG */}
        <img 
          src="/logo.png" 
          alt="اللمة الوسخة Logo" 
          className="object-contain" 
          style={{ width: size, height: size }}
          onError={(e) => {
            // Fallback to a styled SVG if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
              svg.setAttribute("viewBox", "0 0 100 100");
              svg.setAttribute("width", size.toString());
              svg.setAttribute("height", size.toString());
              svg.style.borderRadius = "24px";
              svg.innerHTML = `
                <rect width="100" height="100" rx="24" fill="#6366f1" />
                <circle cx="50" cy="50" r="30" fill="white" fill-opacity="0.2" />
                <path d="M30 70 L50 30 L70 70 Z" fill="white" />
                <circle cx="50" cy="45" r="5" fill="#f43f5e" />
              `;
              parent.appendChild(svg);
            }
          }}
        />
      </motion.div>
      <div className="absolute inset-0 bg-indigo-500/10 blur-xl rounded-full"></div>
    </div>
  );
}
