import { useState } from "react";
import NeonReflex from "./NeonReflex";
import Reveal from "./Reveal";

function copyText(value, label) {
  navigator.clipboard?.writeText(value);
  window.dispatchEvent(new CustomEvent("portfolio-toast", { detail: `${label} copied` }));
}

export default function Contact() {
  const [copied, setCopied] = useState("");

  function copy(value, label) {
    copyText(value, label);
    setCopied(label);
    setTimeout(() => setCopied(""), 1600);
  }

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-surface-container-low relative overflow-hidden" id="contact">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[600px] h-[320px] sm:h-[600px] bg-primary/5 rounded-full blur-[100px] animate-pulse-slow pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10 w-full">
        <div className="grid md:grid-cols-2 gap-10 sm:gap-12 md:gap-16 items-center">
          <div className="w-full min-w-0">
            <Reveal>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold font-headline mb-3 sm:mb-4">
                Let's <span className="text-primary">Connect</span>
              </h2>
            </Reveal>
            <Reveal delay={80}>
              <p className="text-base sm:text-lg text-on-surface-variant font-label mb-6 sm:mb-8 leading-relaxed">
                Open to Software Testing roles — my inbox is always open.
              </p>
            </Reveal>
            <div className="space-y-3.5 sm:space-y-5">
              <Reveal delay={140}>
                <div className="flex items-center gap-3.5 sm:gap-5 group p-3 sm:p-4 rounded-2xl glass-card border border-cyan-400/15 hover:border-cyan-400/40 transition-all duration-300">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-cyan-400/10 flex items-center justify-center text-primary border border-cyan-400/25 group-hover:border-cyan-400/50 group-hover:shadow-[0_0_16px_rgba(34,211,238,0.3)] transition-all duration-300">
                    <span className="material-symbols-outlined icon-bounce-hover text-xl sm:text-2xl">mail</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] sm:text-xs font-label text-outline uppercase tracking-widest">Email</p>
                    <p className="text-sm sm:text-base text-on-surface-variant font-label truncate">
                      <a href="mailto:poojaprakasan00@gmail.com" className="hover:text-primary transition-colors block truncate" title="poojaprakasan00@gmail.com">
                        poojaprakasan00@gmail.com
                      </a>
                    </p>
                  </div>
                  <button className="copy-btn shrink-0" onClick={() => copy("poojaprakasan00@gmail.com", "Email")} aria-label="Copy email">
                    <span className="material-symbols-outlined text-base sm:text-lg">{copied === "Email" ? "check" : "content_copy"}</span>
                  </button>
                </div>
              </Reveal>
              <Reveal delay={220}>
                <div className="flex items-center gap-3.5 sm:gap-5 group p-3 sm:p-4 rounded-2xl glass-card border border-indigo-400/15 hover:border-indigo-400/40 transition-all duration-300">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-indigo-400/10 flex items-center justify-center text-secondary border border-indigo-400/25 group-hover:border-indigo-400/50 group-hover:shadow-[0_0_16px_rgba(129,140,248,0.3)] transition-all duration-300">
                    <span className="material-symbols-outlined icon-bounce-hover text-secondary text-xl sm:text-2xl">call</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] sm:text-xs font-label text-outline uppercase tracking-widest">Phone</p>
                    <p className="text-sm sm:text-base text-on-surface-variant font-label truncate">
                      <a href="tel:+919037238826" className="hover:text-secondary transition-colors block truncate" title="+91 90372 38826">
                        +91 90372 38826
                      </a>
                    </p>
                  </div>
                  <button className="copy-btn shrink-0" onClick={() => copy("+919037238826", "Phone")} aria-label="Copy phone">
                    <span className="material-symbols-outlined text-base sm:text-lg">{copied === "Phone" ? "check" : "content_copy"}</span>
                  </button>
                </div>
              </Reveal>
            </div>
          </div>

          <div className="w-full min-w-0">
            <Reveal delay={160}>
              <NeonReflex />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
