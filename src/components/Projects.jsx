import Reveal from "./Reveal";

export default function Projects() {
  return (
    <section className="py-24 bg-surface-container-low" id="projects">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <Reveal>
              <h2 className="text-3xl md:text-5xl font-bold font-headline mb-4 text-on-surface">
                Testing <span className="text-secondary">Projects</span>
              </h2>
            </Reveal>
            <Reveal delay={80}>
              <p className="text-lg text-on-surface-variant font-label">Frameworks and applications built to validate real user flows and keep software trustworthy.</p>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <a
              className="text-primary font-label text-sm tracking-widest uppercase hover:underline flex items-center gap-1.5 group"
              style={{ textDecoration: "none" }}
              href="https://github.com/poojakp2003?tab=repositories"
              target="_blank"
              rel="noreferrer"
            >
              <span>View All Projects</span>
              <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </a>
          </Reveal>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Reveal delay={80}>
            <div className="glass-card p-8 rounded-3xl flex flex-col h-full hover-lift border border-cyan-400/15 hover:border-cyan-400/45 transition-all duration-300">
              <span className="material-symbols-outlined text-4xl text-primary mb-6 project-card-icon">shopping_cart</span>
              <h3 className="text-xl font-bold font-headline mb-3 text-on-surface">Shop Cart — E-Commerce Web Application</h3>
              <p className="text-sm text-primary-dim font-label mb-4">Java · Selenium WebDriver · TestNG · Hybrid Framework · Apache POI · POM</p>
              <ul className="text-base text-on-surface-variant font-label space-y-2 list-disc list-inside mb-8">
                <li>Built a hybrid automation framework combining method-driven, modular-driven, and data-driven approaches.</li>
                <li>Automated Login, Product Search, Shopping Cart, Wishlist, and Checkout modules.</li>
                <li>Wrote test scenarios and cases directly from business requirements.</li>
                <li>Implemented data-driven testing using Apache POI.</li>
              </ul>
              <div className="mt-auto flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-cyan-400/15 border border-cyan-400/30 rounded-full text-primary text-xs font-label">Automation</span>
                <span className="px-3 py-1 bg-surface-variant/80 border border-slate-700/50 rounded-full text-on-surface-variant text-xs font-label">Selenium</span>
                <span className="px-3 py-1 bg-surface-variant/80 border border-slate-700/50 rounded-full text-on-surface-variant text-xs font-label">TestNG</span>
              </div>
            </div>
          </Reveal>
          <Reveal delay={180}>
            <div className="glass-card p-8 rounded-3xl flex flex-col h-full hover-lift border border-indigo-400/15 hover:border-indigo-400/45 transition-all duration-300">
              <span className="material-symbols-outlined text-4xl text-secondary mb-6 project-card-icon">how_to_vote</span>
              <h3 className="text-xl font-bold font-headline mb-3 text-on-surface">Online Voting System Using Face Recognition</h3>
              <p className="text-sm text-secondary-dim font-label mb-4">Face Recognition · Secure Authentication</p>
              <ul className="text-base text-on-surface-variant font-label space-y-2 list-disc list-inside mb-8">
                <li>Designed a secure online voting system using face recognition to prevent multiple voting.</li>
                <li>Addressed key drawbacks of manual voting systems through automated identity verification.</li>
              </ul>
              <div className="mt-auto flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-indigo-400/15 border border-indigo-400/30 rounded-full text-secondary text-xs font-label">Security</span>
                <span className="px-3 py-1 bg-surface-variant/80 border border-slate-700/50 rounded-full text-on-surface-variant text-xs font-label">Face Recognition</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
