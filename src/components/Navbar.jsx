import { useEffect, useRef, useState } from "react";

const LINKS = [
  { href: "#home", label: "Home", icon: "home", desc: "Overview & hero" },
  { href: "#about", label: "About", icon: "person", desc: "Background & philosophy" },
  { href: "#skills", label: "Skills", icon: "terminal", desc: "Tech stack & tools" },
  { href: "#projects", label: "Projects", icon: "code", desc: "Featured systems" },
  { href: "#experience", label: "Experience", icon: "work_history", desc: "Training & education" },
  { href: "#contact", label: "Contact", icon: "mail", desc: "Get in touch" },
];

export default function Navbar() {
  const [active, setActive] = useState("#home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isClickScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 16);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = ["home", "about", "skills", "projects", "experience", "contact"];

    function updateActiveSection() {
      // Do not override if currently animating a user click
      if (isClickScrollingRef.current) return;

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // When near the top of the page
      if (scrollY < 120) {
        setActive("#home");
        return;
      }

      // When at the very bottom of the page
      if (windowHeight + scrollY >= docHeight - 80) {
        setActive("#contact");
        return;
      }

      // Check sections against a reading focal line (160px from top of viewport)
      const focalY = 160;
      let current = null;

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= focalY && rect.bottom > focalY) {
          current = `#${id}`;
          break;
        }
      }

      // Fallback: closest section if between boundaries
      if (!current) {
        let minDiff = Infinity;
        for (const id of ids) {
          const el = document.getElementById(id);
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          const diff = Math.abs(rect.top - focalY);
          if (rect.top <= focalY + 150 && diff < minDiff) {
            minDiff = diff;
            current = `#${id}`;
          }
        }
      }

      if (current) {
        setActive(current);
      }
    }

    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection, { passive: true });
    updateActiveSection();

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close menu on Escape key press
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Close menu if window is resized to tablet/desktop
  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  function handleNavClick(e, href) {
    e.preventDefault();
    setActive(href);
    setMenuOpen(false);

    // Prevent scroll spy from overriding the clicked section during smooth scroll animation
    isClickScrollingRef.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      isClickScrollingRef.current = false;
    }, 1000);

    if (href === "#home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const el = document.querySelector(href);
    if (el) {
      const navOffset = 80;
      const targetTop = el.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
    }
  }

  return (
    <>
      <nav className={`site-nav ${scrolled ? "is-scrolled" : ""}`}>
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 sm:px-8 h-20">
          <a
            href="#home"
            className="text-xl font-bold font-headline text-on-surface tracking-tighter"
            onClick={(e) => handleNavClick(e, "#home")}
          >
            POOJA<span className="text-primary">&nbsp;K P</span>
          </a>

          <div className="hidden md:flex items-center space-x-8 ml-auto">
            {LINKS.filter((link) => link.href !== "#contact").map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`nav-link ${active === link.href ? "active" : ""}`}
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.label}
              </a>
            ))}
            <a className="nav-cta" href="#contact" onClick={(e) => handleNavClick(e, "#contact")}>
              Let's talk
            </a>
          </div>

          <div className="md:hidden flex items-center">
            <button
              id="menu-btn"
              className={`hamburger-btn ${menuOpen ? "is-open" : ""}`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
            >
              <span className="hamburger-box">
                <span className="hamburger-line line-1" />
                <span className="hamburger-line line-2" />
                <span className="hamburger-line line-3" />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Backdrop overlay for mobile menu */}
      <div
        className={`mobile-backdrop md:hidden ${menuOpen ? "is-visible" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      <div
        id="mobile-menu"
        className={`mobile-menu-drawer md:hidden ${menuOpen ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        <div className="mobile-menu-content">
          <div className="mobile-menu-links">
            {LINKS.map((link, idx) => {
              const isActive = active === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`mobile-nav-item ${isActive ? "active" : ""}`}
                  style={{ "--item-index": idx }}
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  <div className="mobile-nav-icon-wrap">
                    <span className="material-symbols-outlined icon-interactive">{link.icon}</span>
                  </div>
                  <div className="mobile-nav-text">
                    <span className="mobile-nav-label">{link.label}</span>
                    <span className="mobile-nav-desc">{link.desc}</span>
                  </div>
                  <span className="material-symbols-outlined mobile-nav-arrow">
                    chevron_right
                  </span>
                </a>
              );
            })}
          </div>

          <div className="mobile-menu-footer">
            <div className="mobile-status-badge">
              <span className="status-dot" />
              <span>Available for new projects</span>
            </div>

            <a
              href="#contact"
              className="mobile-cta-btn"
              onClick={(e) => handleNavClick(e, "#contact")}
            >
              <span className="material-symbols-outlined">send</span>
              <span>Let's talk</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
