@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;
  --color-primary: #00FF85;
  --color-accent: #8B5CF6;
  --color-bg-dark: #080809;
}

@layer base {
  body {
    @apply bg-bg-dark text-white antialiased selection:bg-primary/30;
  }
}

@layer utilities {
  .glass {
    @apply backdrop-blur-xl bg-white/[0.03] border border-white/[0.08];
  }
  .glass-dark {
    @apply backdrop-blur-xl bg-black/40 border border-white/[0.05];
  }
  .text-gradient {
    @apply bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60;
  }
  .animate-marquee {
    animation: marquee 30s linear infinite;
  }
}

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* Background Radial Pattern */
.bg-radial-pattern {
  background-image: radial-gradient(circle at center, rgba(139, 92, 246, 0.05) 0%, transparent 70%);
}

.bg-grid-pattern {
  background-size: 40px 40px;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
}

