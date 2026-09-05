import { useEffect, useRef, useState } from "react";

export default function NeonReflex() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const [gameState, setGameState] = useState("idle"); // "idle" | "playing" | "gameover"
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("neonReflexHighScore") || "0", 10);
  });
  const [timeLeft, setTimeLeft] = useState(30);
  const [lastReaction, setLastReaction] = useState(null);
  const [combo, setCombo] = useState(1);
  const [stats, setStats] = useState({ hits: 0, avgReaction: 0, fastestReaction: 9999 });

  const stateRef = useRef({
    gameState: "idle",
    score: 0,
    highScore: 0,
    timeLeft: 30,
    target: null,
    particles: [],
    floatingTexts: [],
    reactionTimes: [],
    combo: 1,
    lastFrame: 0,
  });

  stateRef.current.highScore = highScore;

  // Start a new game
  const startGame = () => {
    const freshHighScore = parseInt(localStorage.getItem("neonReflexHighScore") || "0", 10);
    setHighScore(freshHighScore);
    setScore(0);
    setTimeLeft(30);
    setLastReaction(null);
    setCombo(1);
    setStats({ hits: 0, avgReaction: 0, fastestReaction: 9999 });
    setGameState("playing");

    stateRef.current = {
      gameState: "playing",
      score: 0,
      highScore: freshHighScore,
      timeLeft: 30,
      target: null,
      particles: [],
      floatingTexts: [],
      reactionTimes: [],
      combo: 1,
      lastFrame: performance.now(),
    };

    spawnTarget();
  };

  const spawnTarget = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.clientWidth || 320;
    const h = canvas.clientHeight || 240;

    const margin = 45;
    const x = margin + Math.random() * (w - margin * 2);
    const y = margin + Math.random() * (h - margin * 2);

    // Difficulty scaling: as score increases, targets shrink slightly & expire faster
    const currentScore = stateRef.current.score;
    const radius = Math.max(20, 32 - Math.floor(currentScore / 600) * 2);
    const baseDuration = Math.max(750, 1600 - Math.floor(currentScore / 300) * 70);
    const isBonus = Math.random() < 0.18; // 18% chance of golden bonus target

    stateRef.current.target = {
      x,
      y,
      radius,
      spawnTime: performance.now(),
      duration: isBonus ? baseDuration * 0.85 : baseDuration,
      isBonus,
      phase: 0,
    };
  };

  // Handle hit on target
  const handleHit = (clientX, clientY) => {
    if (stateRef.current.gameState !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const target = stateRef.current.target;
    if (!target) return;

    const dx = x - target.x;
    const dy = y - target.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Hit registration (with slight generous padding for mobile responsiveness)
    if (dist <= target.radius + 12) {
      const now = performance.now();
      const reactionMs = Math.max(1, Math.round(now - target.spawnTime));

      // Haptic feedback on mobile if available
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(20);
      }

      // Calculate score based on reaction speed and combo
      let basePoints = 100;
      if (reactionMs < 250) basePoints = 350;
      else if (reactionMs < 350) basePoints = 250;
      else if (reactionMs < 500) basePoints = 180;

      if (target.isBonus) basePoints *= 2;

      const currentCombo = stateRef.current.combo;
      const pointsEarned = basePoints * currentCombo;
      const newScore = stateRef.current.score + pointsEarned;
      stateRef.current.score = newScore;
      setScore(newScore);

      // Update reaction times
      stateRef.current.reactionTimes.push(reactionMs);
      const avg = Math.round(
        stateRef.current.reactionTimes.reduce((a, b) => a + b, 0) / stateRef.current.reactionTimes.length
      );
      const fastest = Math.min(...stateRef.current.reactionTimes);

      setLastReaction(reactionMs);
      setStats({
        hits: stateRef.current.reactionTimes.length,
        avgReaction: avg,
        fastestReaction: fastest,
      });

      // Increase combo up to 5x
      const nextCombo = Math.min(5, currentCombo + 1);
      stateRef.current.combo = nextCombo;
      setCombo(nextCombo);

      // Check high score
      if (newScore > stateRef.current.highScore) {
        stateRef.current.highScore = newScore;
        setHighScore(newScore);
        localStorage.setItem("neonReflexHighScore", String(newScore));
      }

      // Trigger hit particles
      const count = target.isBonus ? 24 : 16;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
        const speed = 2.5 + Math.random() * 4.5;
        stateRef.current.particles.push({
          x: target.x,
          y: target.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 2 + Math.random() * 2.5,
          color: target.isBonus ? "#818CF8" : "#22D3EE",
          alpha: 1,
          decay: 0.025 + Math.random() * 0.02,
        });
      }

      // Add floating text
      stateRef.current.floatingTexts.push({
        x: target.x,
        y: target.y - 12,
        text: `+${pointsEarned} (${reactionMs}ms)${nextCombo > 1 ? ` x${nextCombo}` : ""}`,
        color: target.isBonus ? "#818CF8" : "#22D3EE",
        alpha: 1,
        vy: -1.2,
      });

      // Small time bonus for bonus target
      if (target.isBonus) {
        stateRef.current.timeLeft = Math.min(30, stateRef.current.timeLeft + 1.5);
      }

      // Spawn next target
      stateRef.current.target = null;
      setTimeout(() => {
        if (stateRef.current.gameState === "playing") {
          spawnTarget();
        }
      }, 60);
    }
  };

  // Main canvas animation and game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resize = () => {
      const container = containerRef.current;
      if (!container) return;
      const w = container.clientWidth;
      const h = w < 480 ? 250 : 290;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const render = (now) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      // Cyber background grid
      ctx.strokeStyle = "rgba(34, 211, 238, 0.04)";
      ctx.lineWidth = 1;
      const gridSize = 28;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // If active play
      if (stateRef.current.gameState === "playing") {
        const deltaSec = (now - stateRef.current.lastFrame) / 1000;
        stateRef.current.lastFrame = now;

        // Countdown timer
        if (stateRef.current.timeLeft > 0) {
          stateRef.current.timeLeft -= deltaSec;
          setTimeLeft(Math.max(0, Math.ceil(stateRef.current.timeLeft)));
        } else {
          // Time over!
          stateRef.current.gameState = "gameover";
          setGameState("gameover");
          stateRef.current.target = null;
        }

        // Draw and update current target
        const target = stateRef.current.target;
        if (target) {
          const elapsed = now - target.spawnTime;
          const progress = elapsed / target.duration;

          if (progress >= 1) {
            // Target expired without hit
            stateRef.current.combo = 1;
            setCombo(1);

            // Dissipation particles
            for (let i = 0; i < 8; i++) {
              const a = (Math.PI * 2 * i) / 8;
              stateRef.current.particles.push({
                x: target.x,
                y: target.y,
                vx: Math.cos(a) * 1.5,
                vy: Math.sin(a) * 1.5,
                radius: 2,
                color: "#94A3B8",
                alpha: 0.6,
                decay: 0.04,
              });
            }

            stateRef.current.target = null;
            setTimeout(() => {
              if (stateRef.current.gameState === "playing") {
                spawnTarget();
              }
            }, 80);
          } else {
            // Target alive -> Render pulsating cyber target
            target.phase = (target.phase || 0) + 0.05;
            const pulse = Math.sin(target.phase) * 3;
            const currentR = target.radius + pulse;
            const targetColor = target.isBonus ? "#818CF8" : "#22D3EE";
            const glowColor = target.isBonus ? "rgba(129, 140, 248, 0.45)" : "rgba(34, 211, 238, 0.45)";

            // Outer timer ring (shrinks down as time expires)
            const remainingRatio = Math.max(0, 1 - progress);
            ctx.beginPath();
            ctx.arc(target.x, target.y, currentR + 8, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * remainingRatio);
            ctx.strokeStyle = targetColor;
            ctx.lineWidth = 2.5;
            ctx.stroke();

            // Outer glowing aura
            ctx.beginPath();
            ctx.arc(target.x, target.y, currentR, 0, Math.PI * 2);
            ctx.fillStyle = glowColor;
            ctx.fill();

            // Concentric cyber ring
            ctx.beginPath();
            ctx.arc(target.x, target.y, currentR * 0.65, 0, Math.PI * 2);
            ctx.strokeStyle = "#F1F5F9";
            ctx.lineWidth = 1.8;
            ctx.stroke();

            // Center target core
            ctx.beginPath();
            ctx.arc(target.x, target.y, currentR * 0.28, 0, Math.PI * 2);
            ctx.fillStyle = targetColor;
            ctx.fill();

            // Crosshair micro-lines
            ctx.strokeStyle = "rgba(241, 245, 249, 0.8)";
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(target.x - currentR - 3, target.y);
            ctx.lineTo(target.x + currentR + 3, target.y);
            ctx.moveTo(target.x, target.y - currentR - 3);
            ctx.lineTo(target.x, target.y + currentR + 3);
            ctx.stroke();
          }
        }

        // Draw and update particles
        for (let i = stateRef.current.particles.length - 1; i >= 0; i--) {
          const p = stateRef.current.particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.95;
          p.vy *= 0.95;
          p.alpha -= p.decay;

          if (p.alpha <= 0) {
            stateRef.current.particles.splice(i, 1);
          } else {
            ctx.save();
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }

        // Draw floating score text
        for (let i = stateRef.current.floatingTexts.length - 1; i >= 0; i--) {
          const ft = stateRef.current.floatingTexts[i];
          ft.y += ft.vy;
          ft.alpha -= 0.025;

          if (ft.alpha <= 0) {
            stateRef.current.floatingTexts.splice(i, 1);
          } else {
            ctx.save();
            ctx.globalAlpha = Math.max(0, ft.alpha);
            ctx.fillStyle = ft.color;
            ctx.font = "bold 13px 'Space Grotesk', sans-serif";
            ctx.textAlign = "center";
            ctx.shadowColor = ft.color;
            ctx.shadowBlur = 6;
            ctx.fillText(ft.text, ft.x, ft.y);
            ctx.restore();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    stateRef.current.lastFrame = performance.now();
    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="glass-card p-6 sm:p-8 rounded-3xl border border-cyan-400/20 relative overflow-hidden flex flex-col justify-between select-none shadow-2xl"
    >
      {/* Header Info & Stats Bar */}
      <div className="flex items-center justify-between mb-4 border-b border-cyan-400/15 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-primary game-icon-playful">
            <span className="material-symbols-outlined text-xl">speed</span>
          </div>
          <div>
            <h3 className="text-base font-bold font-headline text-on-surface tracking-wide flex items-center gap-2">
              Neon Reflex
              <span className="text-[10px] uppercase font-label px-2 py-0.5 rounded-full bg-cyan-400/15 text-primary border border-cyan-400/30">
                Mini Game
              </span>
            </h3>
            <p className="text-xs text-on-surface-variant font-label">Tap targets at lightning speed</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] font-label uppercase tracking-widest text-outline">Score</div>
            <div className="text-lg font-bold font-headline text-primary tabular-nums drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
              {score}
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-[10px] font-label uppercase tracking-widest text-outline">High Score</div>
            <div className="text-lg font-bold font-headline text-secondary tabular-nums drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]">
              {highScore}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic HUD in active play */}
      <div className="flex items-center justify-between px-2 mb-3 text-xs font-label">
        <div className="flex items-center gap-2">
          <span className="text-outline">Time Left:</span>
          <span
            className={`font-bold tabular-nums text-sm ${
              timeLeft <= 5 ? "text-red-400 animate-pulse" : "text-primary"
            }`}
          >
            {timeLeft}s
          </span>
        </div>

        {lastReaction && (
          <div className="flex items-center gap-1.5 text-on-surface">
            <span className="text-outline">Reaction:</span>
            <span className="font-bold text-primary tabular-nums">{lastReaction} ms</span>
          </div>
        )}

        <div className="flex items-center gap-1.5">
          <span className="text-outline">Streak:</span>
          <span
            className={`font-bold px-2 py-0.5 rounded-md ${
              combo > 1 ? "bg-cyan-400/20 text-primary border border-cyan-400/40" : "text-outline"
            }`}
          >
            {combo}x
          </span>
        </div>
      </div>

      {/* Game Canvas Arena */}
      <div className="relative rounded-2xl overflow-hidden border border-cyan-400/20 bg-[#080B12] shadow-inner flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="w-full block cursor-crosshair"
          style={{ touchAction: "manipulation" }}
          onClick={(e) => handleHit(e.clientX, e.clientY)}
          onTouchStart={(e) => {
            if (e.touches.length > 0) {
              const t = e.touches[0];
              handleHit(t.clientX, t.clientY);
            }
          }}
        />

        {/* Start Screen Overlay */}
        {gameState === "idle" && (
          <div className="absolute inset-0 bg-[#080B12]/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-10">
            <div className="w-14 h-14 rounded-2xl bg-cyan-400/15 border border-cyan-400/40 flex items-center justify-center text-primary mb-3 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
              <span className="material-symbols-outlined text-3xl">ads_click</span>
            </div>
            <h4 className="text-xl font-bold font-headline text-on-surface mb-1">Neon Reflex Challenge</h4>
            <p className="text-xs text-on-surface-variant font-label max-w-xs mb-5">
              Click or tap glowing targets before they vanish. Earn points and test your reflex speed in milliseconds!
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-[#080B12] font-bold text-sm font-label shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              Start Challenge
            </button>
          </div>
        )}

        {/* Game Over Screen Overlay */}
        {gameState === "gameover" && (
          <div className="absolute inset-0 bg-[#080B12]/92 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-10">
            <span className="material-symbols-outlined text-4xl text-primary mb-1 drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]">
              military_tech
            </span>
            <h4 className="text-xl font-bold font-headline text-on-surface mb-1">Time's Up!</h4>
            <p className="text-xs text-on-surface-variant font-label mb-4">Great reflexes! Here is your breakdown:</p>

            <div className="grid grid-cols-3 gap-3 w-full max-w-xs mb-5">
              <div className="bg-[#101622] p-2.5 rounded-xl border border-cyan-400/15 text-center">
                <div className="text-[10px] text-outline font-label uppercase">Final Score</div>
                <div className="text-base font-bold text-primary font-headline">{score}</div>
              </div>
              <div className="bg-[#101622] p-2.5 rounded-xl border border-cyan-400/15 text-center">
                <div className="text-[10px] text-outline font-label uppercase">Avg Speed</div>
                <div className="text-base font-bold text-secondary font-headline">
                  {stats.avgReaction ? `${stats.avgReaction}ms` : "--"}
                </div>
              </div>
              <div className="bg-[#101622] p-2.5 rounded-xl border border-cyan-400/15 text-center">
                <div className="text-[10px] text-outline font-label uppercase">Fastest</div>
                <div className="text-base font-bold text-cyan-300 font-headline">
                  {stats.fastestReaction < 9000 ? `${stats.fastestReaction}ms` : "--"}
                </div>
              </div>
            </div>

            <button
              onClick={startGame}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-[#080B12] font-bold text-sm font-label shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">replay</span>
              <span>Play Again</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer Instructions / Tip */}
      <div className="mt-3 text-center">
        <p className="text-[11px] text-outline font-label">
          Tip: Hit bonus indigo targets for double points and combo boosts
        </p>
      </div>
    </div>
  );
}
