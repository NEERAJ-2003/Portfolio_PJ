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
    <section className="py-24 bg-surface-container-low relative overflow-hidden" id="contact">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] animate-pulse-slow" />
      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <Reveal>
              <h2 className="text-4xl md:text-6xl font-bold font-headline mb-8">
                Let's <span className="text-primary">Connect</span>
              </h2>
            </Reveal>
            <Reveal delay={80}>
              <p className="text-lg text-on-surface-variant font-label">Open to Software Testing roles — my inbox is always open.</p>
            </Reveal>
            <br />
            <div className="space-y-6">
              <Reveal delay={140}>
                <div className="flex items-center gap-6 group">
                  <div className="w-12 h-12 rounded-xl glass-card flex items-center justify-center text-primary border border-cyan-400/20 group-hover:border-cyan-400/50 group-hover:shadow-[0_0_16px_rgba(34,211,238,0.3)] transition-all duration-300">
                    <span className="material-symbols-outlined icon-bounce-hover">mail</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-label text-outline uppercase tracking-widest">Email</p>
                    <p className="text-base text-on-surface-variant font-label">
                      <a href="mailto:poojaprakasan00@gmail.com" className="hover:text-primary transition-colors">
                        poojaprakasan00@gmail.com
                      </a>
                    </p>
                  </div>
                  <button className="copy-btn" onClick={() => copy("poojaprakasan00@gmail.com", "Email")} aria-label="Copy email">
                    <span className="material-symbols-outlined">{copied === "Email" ? "check" : "content_copy"}</span>
                  </button>
                </div>
              </Reveal>
              <Reveal delay={220}>
                <div className="flex items-center gap-6 group">
                  <div className="w-12 h-12 rounded-xl glass-card flex items-center justify-center text-secondary border border-indigo-400/20 group-hover:border-indigo-400/50 group-hover:shadow-[0_0_16px_rgba(129,140,248,0.3)] transition-all duration-300">
                    <span className="material-symbols-outlined icon-bounce-hover text-secondary">call</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-label text-outline uppercase tracking-widest">Phone</p>
                    <p className="text-base text-on-surface-variant font-label">
                      <a href="tel:+919037238826" className="hover:text-secondary transition-colors">
                        +91 90372 38826
                      </a>
                    </p>
                  </div>
                  <button className="copy-btn" onClick={() => copy("+919037238826", "Phone")} aria-label="Copy phone">
                    <span className="material-symbols-outlined">{copied === "Phone" ? "check" : "content_copy"}</span>
                  </button>
                </div>
              </Reveal>
            </div>
          </div>

          <Reveal delay={160}>
            <NeonReflex />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
