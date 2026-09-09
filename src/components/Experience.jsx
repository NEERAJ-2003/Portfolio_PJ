import Reveal from "./Reveal";

export default function Experience() {
  return (
    <section className="py-24 bg-surface" id="experience">
      <div className="max-w-7xl mx-auto px-8">
        <Reveal>
          <h2 className="text-3xl md:text-5xl font-bold font-headline mb-16 text-center text-on-surface">
            Milestones &<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"> Training</span>
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-12">
            <Reveal>
              <h3 className="text-2xl font-bold font-headline text-primary mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined icon-interactive">workspace_premium</span>
                Certification & Training
              </h3>
            </Reveal>
            <div className="relative pl-8 border-l-2 border-primary/25">
              <div className="timeline-dot absolute -left-[9px] top-0 w-4 h-4 bg-primary rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
              <Reveal delay={120}>
                <div className="glass-card p-6 rounded-2xl mb-6 border border-cyan-400/15 hover:border-cyan-400/40 hover-lift transition-all duration-300">
                  <span className="inline-block px-3 py-1 rounded bg-cyan-400/15 border border-cyan-400/30 text-primary font-label text-xs mb-3">SDET PROGRAM</span>
                  <h4 className="text-lg font-bold font-headline mb-1 text-on-surface">SDET — Software Development Engineer in Testing</h4>
                  <p className="text-primary-dim font-medium mb-3">QSpiders, BTM</p>
                  <p className="text-base text-on-surface-variant font-label">
                    Hands-on training across manual testing, API testing with Postman, and Selenium-based automation frameworks.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
          <div className="space-y-12">
            <Reveal delay={80}>
              <h3 className="text-2xl font-bold font-headline text-secondary mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined icon-interactive">history_edu</span>
                Education History
              </h3>
            </Reveal>
            <div className="relative pl-8 border-l-2 border-secondary/25 space-y-12">
              <div className="relative">
                <div className="timeline-dot tertiary absolute -left-[41px] top-0 w-4 h-4 bg-secondary rounded-full shadow-[0_0_15px_rgba(129,140,248,0.8)]" />
                <Reveal delay={160}>
                  <div className="glass-card p-6 rounded-2xl border border-indigo-400/15 hover:border-indigo-400/40 hover-lift transition-all duration-300">
                    <span className="inline-block px-3 py-1 rounded bg-indigo-400/15 border border-indigo-400/30 text-secondary font-label text-xs mb-3">2021 - 2025</span>
                    <h4 className="text-xl font-bold font-headline mb-1 text-on-surface">Bachelor of Technology, Computer Science & Engineering</h4>
                    <p className="text-secondary font-medium mb-3">Universal Engineering College, Thrissur</p>
                    <div className="text-base text-on-surface-variant font-label">
                      Graduated with a CGPA of <span className="text-on-surface font-semibold">7.1</span>
                    </div>
                  </div>
                </Reveal>
              </div>
              <div className="relative">
                <div className="timeline-dot secondary absolute -left-[41px] top-0 w-4 h-4 bg-secondary rounded-full shadow-[0_0_15px_rgba(129,140,248,0.8)]" />
                <Reveal delay={240}>
                  <div className="glass-card p-6 rounded-2xl border border-indigo-400/15 hover:border-indigo-400/40 hover-lift transition-all duration-300">
                    <span className="inline-block px-3 py-1 rounded bg-indigo-400/15 border border-indigo-400/30 text-secondary font-label text-xs mb-3">2019 - 2021</span>
                    <h4 className="text-xl font-bold font-headline mb-1 text-on-surface">Higher Secondary Education</h4>
                    <p className="text-secondary font-medium mb-3">GFVHSS Kaipamangalam, Thrissur</p>
                    <p className="text-base text-on-surface-variant font-label">
                      Secured <span className="text-on-surface font-semibold">90%</span>.
                    </p>
                  </div>
                </Reveal>
              </div>
              <div className="relative">
                <div className="timeline-dot absolute -left-[41px] top-0 w-4 h-4 bg-primary-dim rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                <Reveal delay={320}>
                  <div className="glass-card p-6 rounded-2xl border border-cyan-400/15 hover:border-cyan-400/40 hover-lift transition-all duration-300">
                    <span className="inline-block px-3 py-1 rounded bg-cyan-400/15 border border-cyan-400/30 text-primary-dim font-label text-xs mb-3">2019</span>
                    <h4 className="text-xl font-bold font-headline mb-1 text-on-surface">Secondary Education</h4>
                    <p className="text-primary-dim font-medium mb-3">OLFGHS Mathilakam, Thrissur</p>
                    <p className="text-base text-on-surface-variant font-label">
                      Secured <span className="text-on-surface font-semibold">88%</span>.
                    </p>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
