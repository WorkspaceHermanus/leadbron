"use client";

import { useState, useEffect } from "react";
import ChatInterface from "./ChatInterface";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [visitorId, setVisitorId] = useState("");

  useEffect(() => {
    let id = sessionStorage.getItem("leadbron_visitor_id");
    if (!id) {
      id = `visitor_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
      sessionStorage.setItem("leadbron_visitor_id", id);
    }
    setVisitorId(id);

    let shown = false;
    const show = () => {
      if (!shown) {
        shown = true;
        setIsVisible(true);
      }
    };

    const timer = setTimeout(show, 20000);
    const handleScroll = () => {
      if (window.scrollY > 200) show();
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen ? (
        <div className="h-[min(520px,calc(100vh-2.5rem))] w-[min(24rem,calc(100vw-2.5rem))]">
          <ChatInterface visitorId={visitorId} onClose={() => setIsOpen(false)} />
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-brass text-2xl text-white shadow-lg transition hover:scale-110 hover:bg-brassdeep"
          aria-label="Open chat"
        >
          💬
        </button>
      )}
    </div>
  );
}
