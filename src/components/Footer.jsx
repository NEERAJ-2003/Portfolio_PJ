const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/poojakp2003",
    iconClass: "icon-github-hover",
    svg: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/pooja-k-p-a5b6bb38b",
    iconClass: "icon-linkedin-hover",
    svg: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.25c-.9 0-1.63.73-1.63 1.63 0 .9.73 1.63 1.63 1.63.9 0 1.63-.73 1.63-1.63 0-.9-.73-1.63-1.63-1.63z" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/9037238826",
    iconClass: "icon-bounce-hover",
    svg: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 012.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#080B12] w-full pt-12 sm:pt-16 pb-24 sm:pb-12 border-t border-cyan-400/15">
      <div className="flex flex-col md:flex-row justify-between items-center px-4 sm:px-6 md:px-12 max-w-7xl mx-auto space-y-6 md:space-y-0 text-center md:text-left">
        <div>
          <div className="text-xl font-bold text-on-surface font-headline tracking-tight">
            Pooja <span className="text-primary">K P</span>
          </div>
          <p className="text-xs text-outline font-label mt-1">
            Software Tester · QA Engineer · SDET
          </p>
        </div>

        <div className="text-outline font-body text-xs tracking-wide">
          &copy; 2026 Pooja K P · Testing With Precision
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              className={`text-outline hover:text-on-surface font-label text-sm transition-all duration-200 flex items-center gap-2 ${s.iconClass}`}
              href={s.href}
              target="_blank"
              rel="noreferrer"
            >
              {s.svg}
              <span>{s.label}</span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
