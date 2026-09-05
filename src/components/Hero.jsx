import { useEffect, useRef, useState } from "react";

const PHRASES = ["Software Tester", "QA Engineer", "SDET"];

export default function Hero() {
  const canvasRef = useRef(null);
  const heroRef = useRef(null);
  const typingRef = useRef(null);
  const [clock, setClock] = useState("");

  // Light-cycling mesh canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    const ctx = canvas.getContext("2d");
    let rafId;

    function resizeCanvas() {
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const colors = [
      [34, 211, 238],
      [129, 140, 248],
      [6, 182, 212],
      [99, 102, 241],
      [103, 232, 249],
    ];

    const orbs = [
      { xf: 0.18, yf: 0.22, size: 0.55 },
      { xf: 0.82, yf: 0.18, size: 0.45 },
      { xf: 0.75, yf: 0.8, size: 0.5 },
      { xf: 0.22, yf: 0.78, size: 0.4 },
      { xf: 0.5, yf: 0.5, size: 0.32 },
    ];

    const particles = Array.from({ length: 42 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00035,
      vy: (Math.random() - 0.5) * 0.00035,
      r: 0.8 + Math.random() * 1.6,
    }));

    let t = 0;
    function lv(a, b, f) {
      return a + (b - a) * f;
    }

    function drawCanvas() {
      const W = canvas.width,
        H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      t += 0.003;
      const cycleLen = Math.PI * 2;
      const phase = (t % (cycleLen * colors.length)) / cycleLen;
      const fromIdx = Math.floor(phase) % colors.length;
      const toIdx = (fromIdx + 1) % colors.length;
      const raw = phase - Math.floor(phase);
      const smooth = raw < 0.5 ? 2 * raw * raw : 1 - Math.pow(-2 * raw + 2, 2) / 2;
      const col = colors[fromIdx].map((v, i) => Math.round(lv(v, colors[toIdx][i], smooth)));

      orbs.forEach((orb, i) => {
        const ox = orb.xf * W + Math.sin(t * 0.38 + i * 1.3) * W * 0.055;
        const oy = orb.yf * H + Math.cos(t * 0.32 + i * 1.1) * H * 0.055;
        const r = Math.min(W, H) * orb.size;
        const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, r);
        g.addColorStop(0, `rgba(${col[0]},${col[1]},${col[2]},0.10)`);
        g.addColorStop(0.4, `rgba(${col[0]},${col[1]},${col[2]},0.04)`);
        g.addColorStop(1, `rgba(${col[0]},${col[1]},${col[2]},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(ox, oy, r, 0, Math.PI * 2);
        ctx.fill();
      });

      particles.forEach((p) => {
        p.x += p.vx + Math.sin(t + p.y * 8) * 0.00008;
        p.y += p.vy + Math.cos(t + p.x * 8) * 0.00008;
        if (p.x < 0) p.x = 1;
        if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1;
        if (p.y > 1) p.y = 0;
      });

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        const ax = a.x * W;
        const ay = a.y * H;
        ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},0.45)`;
        ctx.beginPath();
        ctx.arc(ax, ay, a.r, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = ax - b.x * W;
          const dy = ay - b.y * H;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},${0.18 * (1 - dist / 120)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(b.x * W, b.y * H);
            ctx.stroke();
          }
        }
      }

      rafId = requestAnimationFrame(drawCanvas);
    }
    drawCanvas();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // Typing effect
  useEffect(() => {
    const el = typingRef.current;
    let phraseIndex = 0,
      charIndex = 0,
      isDeleting = false,
      typeSpeed = 100;
    let timer;

    function type() {
      const cur = PHRASES[phraseIndex];
      if (isDeleting) {
        el.textContent = cur.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
      } else {
        el.textContent = cur.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 150;
      }
      if (!isDeleting && charIndex === cur.length) {
        isDeleting = true;
        typeSpeed = 2000;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % PHRASES.length;
        typeSpeed = 500;
      }
      timer = setTimeout(type, typeSpeed);
    }
    type();

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    function tick() {
      setClock(
        new Intl.DateTimeFormat("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).format(new Date())
      );
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden" id="home">
      <canvas id="hero-canvas" ref={canvasRef} />

      <div className="absolute inset-0 mesh-gradient opacity-40" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-dim rounded-full blur-[160px] opacity-20 animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-tertiary-dim rounded-full blur-[160px] opacity-10 animate-pulse-slow" />

      <div className="max-w-7xl mx-auto px-8 w-full relative z-10 text-center">
        <div className="hero-enter flex flex-wrap items-center justify-center gap-3 mb-8">
          <span className="status-pill">
            <span className="status-dot" />
            Open to roles
          </span>
          <span className="status-pill">Bengaluru · {clock || "--:--"} IST</span>
        </div>
        <h1
          className="hero-name text-on-surface mb-6 leading-none drop-shadow-2xl whitespace-nowrap"
          style={{ fontSize: "clamp(2.4rem, 9.5vw, 8.5rem)" }}
        >
          POOJA
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary-dim to-secondary inline-block filter drop-shadow-[0_0_30px_rgba(34,211,238,0.45)]">
            &nbsp;K&nbsp;P
          </span>
        </h1>

        <div className="hero-enter hero-enter-delay text-2xl md:text-4xl text-on-surface-variant mb-12 h-12 flex items-center justify-center">
          <span className="typing-container font-mono text-primary font-semibold tracking-tight md:tracking-normal" ref={typingRef} id="typing-text">
            Software Tester
          </span>
        </div>

        <div className="hero-enter hero-enter-cta flex flex-wrap justify-center gap-6">
          <a className="btn-shine px-10 py-5 rounded-xl bg-gradient-to-r from-primary to-tertiary-dim text-on-primary-container font-bold shadow-2xl neon-glow-primary hover:scale-105 transition-all duration-300" href="#contact">
            Connect
          </a>
          <a className="btn-shine px-10 py-5 rounded-xl bg-gradient-to-r from-primary to-tertiary-dim text-on-primary-container font-bold shadow-2xl neon-glow-primary hover:scale-105 transition-all duration-300" href="/Pooja_KP_Resume.pdf" download="Pooja_KP_Resume.pdf">
            Resume
          </a>
        </div>
      </div>
    </section>
  );
}
