import { useEffect, useState } from "react";

export default function ToastHost() {
  const [msg, setMsg] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    let hide;
    function onToast(e) {
      setMsg(e.detail || "Copied");
      setShow(true);
      clearTimeout(hide);
      hide = setTimeout(() => setShow(false), 1800);
    }
    window.addEventListener("portfolio-toast", onToast);
    return () => {
      window.removeEventListener("portfolio-toast", onToast);
      clearTimeout(hide);
    };
  }, []);

  return (
    <div className={`toast-host ${show ? "is-visible" : ""}`} role="status">
      {msg}
    </div>
  );
}
