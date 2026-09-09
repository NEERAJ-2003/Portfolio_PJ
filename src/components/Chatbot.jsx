import { useEffect, useRef, useState } from "react";
import { findAnswer, isSmalltalk, pickThinkingPhrase } from "../chatbot/chatbotEngine";

function TinaLogo({ size = 24, className = "", glow = false, id = "tina-logo" }) {
  const gradId = `${id}-grad`;
  const filterId = `${id}-glow`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Tina AI Logo"
    >
      <defs>
        <linearGradient id={gradId} x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#818CF8" />
        </linearGradient>
        {glow && (
          <filter id={filterId} x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#22D3EE" floodOpacity="0.8" />
          </filter>
        )}
      </defs>

      {/* Cyber AI aperture perimeter */}
      <path
        d="M12 2.5C7.3 2.5 3.5 6.1 3.5 10.7C3.5 12.8 4.3 14.8 5.7 16.3L5 20.3C4.9 20.8 5.3 21.2 5.8 21L9.7 19.5C10.4 19.8 11.2 20 12 20C16.7 20 20.5 16.4 20.5 11.8C20.5 7.2 16.7 2.5 12 2.5Z"
        stroke={`url(#${gradId})`}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={glow ? `url(#${filterId})` : undefined}
      />

      {/* Central Neural AI Core */}
      <circle
        cx="12"
        cy="11.2"
        r="2.8"
        fill={`url(#${gradId})`}
      />

      {/* Inner Sparkle Accent */}
      <circle cx="12" cy="11.2" r="1" fill="#080B12" />
      <circle cx="12.35" cy="10.85" r="0.45" fill="#FFFFFF" />

      {/* Neural Synapse Connectors */}
      <line x1="12" y1="5.2" x2="12" y2="7.4" stroke={`url(#${gradId})`} strokeWidth="1.4" strokeLinecap="round" />
      <line x1="7.4" y1="11.2" x2="8.6" y2="11.2" stroke={`url(#${gradId})`} strokeWidth="1.4" strokeLinecap="round" />
      <line x1="15.4" y1="11.2" x2="16.6" y2="11.2" stroke={`url(#${gradId})`} strokeWidth="1.4" strokeLinecap="round" />

      {/* Synapse Nodes */}
      <circle cx="12" cy="5.2" r="0.9" fill="#22D3EE" />
      <circle cx="7.4" cy="11.2" r="0.9" fill="#22D3EE" />
      <circle cx="16.6" cy="11.2" r="0.9" fill="#818CF8" />
    </svg>
  );
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesRef = useRef(null);
  const idRef = useRef(0);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const greetedRef = useRef(false);

  function nextId() {
    idRef.current += 1;
    return idRef.current;
  }

  function addMessage(text, sender) {
    const id = nextId();
    setMessages((prev) => [...prev, { id, text, sender }]);
    return id;
  }

  function updateMessage(id, text, sender) {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, text, sender: sender ?? m.sender } : m)));
  }

  function typeOutMessage(id, text, speed = 18) {
    let i = 0;
    updateMessage(id, "");
    const timer = setInterval(() => {
      i++;
      updateMessage(id, text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, speed);
  }

  function openChat() {
    setOpen(true);
    if (!greetedRef.current) {
      greetedRef.current = true;
      addMessage("Hi, I'm Tina, Pooja's AI. Ask me about her.", "bot");
    }
  }

  useEffect(() => {
    function onOpen() {
      openChat();
    }
    window.addEventListener("open-tina", onOpen);
    return () => window.removeEventListener("open-tina", onOpen);
  }, []);

  function closeChat() {
    setOpen(false);
  }

  function sendMessage() {
    const text = input.trim();
    if (!text) return;
    addMessage(text, "user");
    setInput("");

    if (isSmalltalk(text)) {
      const id = addMessage("", "bot");
      setTimeout(() => {
        typeOutMessage(id, findAnswer(text), 18);
      }, 250);
      return;
    }

    let currentPhrase = pickThinkingPhrase(null);
    const id = addMessage(currentPhrase, "typing");
    const thinkDelay = 1600 + Math.random() * 1000;

    const phraseTimer = setInterval(() => {
      currentPhrase = pickThinkingPhrase(currentPhrase);
      updateMessage(id, currentPhrase);
    }, 650);

    setTimeout(() => {
      clearInterval(phraseTimer);
      const answer = findAnswer(text);
      updateMessage(id, "", "bot");
      typeOutMessage(id, answer, 26);
    }, thinkDelay);
  }

  const sparkles = [
    { top: "5%", left: "50%", sx: "-22px", sy: "-14px", delay: "0s" },
    { top: "50%", left: "95%", sx: "16px", sy: "6px", delay: "0.9s" },
    { top: "90%", left: "20%", sx: "-10px", sy: "18px", delay: "1.8s" },
    { top: "20%", left: "10%", sx: "-18px", sy: "10px", delay: "2.5s" },
  ];

  return (
    <>
      <div id="chat-toggle-wrap">
        {!open && (
          <>
            <div className="tina-halo" />
            <div className="tina-halo delay" />
            {sparkles.map((s, i) => (
              <span
                key={i}
                className="tina-sparkle"
                style={{ top: s.top, left: s.left, "--sx": s.sx, "--sy": s.sy, animationDelay: s.delay }}
              />
            ))}
          </>
        )}
        <button
          id="chat-toggle-btn"
          className={open ? "is-open" : ""}
          aria-label="Open Tina AI chat assistant"
          onClick={() => (open ? closeChat() : openChat())}
        >
          {open ? (
            <span className="material-symbols-outlined text-surface font-bold text-2xl">close</span>
          ) : (
            <img src="/tina-logo.png" alt="Tina AI Chatbot" className="tina-btn-logo" />
          )}
        </button>
      </div>

      <div id="chat-window" className={open ? "open" : ""}>
        <div id="chat-header">
          <div className="chat-header-logo-wrap">
            <img src="/tina-logo.png" alt="Tina AI" className="chat-header-logo" />
          </div>
          <div id="chat-header-text">
            <div id="chat-header-title">Tina AI</div>
          </div>
          <button id="chat-close-btn" aria-label="Close chat" onClick={closeChat}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div id="chat-messages" ref={messagesRef}>
          <div className="tina-welcome-card">
            <div className="tina-welcome-logo-container">
              <img src="/tina-logo.png" alt="Tina AI" className="tina-welcome-logo-img" />
            </div>
            <div className="font-headline font-bold text-sm text-on-surface">Tina AI</div>
            <div className="text-xs text-on-surface-variant font-label mt-0.5">
              Pooja's AI Assistant · Ask about skills, projects & experience
            </div>
          </div>
          {messages.map((m) => (
            <div key={m.id} className={`chat-msg ${m.sender}`}>
              {m.sender === "typing" && (
                <span className="typing-dots">
                  <span />
                  <span />
                  <span />
                </span>
              )}
              {m.text}
            </div>
          ))}
        </div>
        <div id="chat-input-area">
          <input
            type="text"
            id="chat-input"
            placeholder="Ask Tina about Pooja's projects, skills..."
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <button id="chat-send-btn" aria-label="Send message" onClick={sendMessage}>
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </div>
    </>
  );
}
