import { useRef } from "react";

export default function SpotlightCard({ children, className = "", ...props }) {
  const ref = useRef(null);

  function onMove(e) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
  }

  return (
    <div ref={ref} className={`spotlight-card ${className}`} onMouseMove={onMove} {...props}>
      {children}
    </div>
  );
}
