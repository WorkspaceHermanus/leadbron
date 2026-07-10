"use client";

import { useState, useEffect } from "react";
import ChatInterface, { type Message } from "./ChatInterface";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isQualified, setIsQualified] = useState(false);
  const [visitorId, setVisitorId] = useState<string>("");
  const [hasShown, setHasShown] = useState(false);

  // Initialize visitor ID and trigger timing
  useEffect(() => {
    // Generate or retrieve visitor ID from sessionStorage
    let id = sessionStorage.getItem("leadbron_visitor_id");
    if (!id) {
      id = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem("leadbron_visitor_id", id);
    }
    setVisitorId(id);

    // Trigger after 30 seconds or on scroll to certain point
    const timer = setTimeout(() => {
      if (!hasShown) {
        setIsVisible(true);
        setHasShown(true);
      }
    }, 30000);

    const handleScroll = () => {
      if (!hasShown && window.scrollY > 200) {
        setIsVisible(true);
        setHasShown(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasShown]);

  // Send initial message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0 && !isLoading) {
      handleInitialMessage();
    }
  }, [isOpen]);

  const handleInitialMessage = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId,
          message: "Hi, I'd like to learn more about financial products.",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setConversationId(data.conversationId);
        setMessages([
          {
            role: "assistant",
            content: data.response,
            timestamp: new Date().toISOString(),
          },
        ]);
      } else {
        setMessages([
          {
            role: "assistant",
            content:
              "Hi! I'm the LeadBron advisor assistant. I'm having a little trouble connecting right now — you can also request a call back via our quote form.",
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } catch (error) {
      console.error("Failed to send initial message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!visitorId) return;

    const newMessage: Message = {
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId,
          conversationId: conversationId || undefined,
          message,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setConversationId(data.conversationId);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.response,
            timestamp: data.timestamp,
          },
        ]);
      } else {
        const error = await response.json();
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: error.error || "Sorry, something went wrong. Please try again.",
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble connecting. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQualify = async (consent: boolean) => {
    if (!conversationId || !consent) {
      setIsQualified(false);
      return;
    }

    try {
      const response = await fetch("/api/chat/qualify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          consent: true,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.qualified) {
          setIsQualified(true);
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: data.message || "Thank you! An adviser will contact you shortly.",
              timestamp: new Date().toISOString(),
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Failed to qualify:", error);
    }
  };

  const handleOpenChat = () => {
    setIsOpen(true);
  };

  const handleCloseChat = () => {
    setIsOpen(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm">
      {isOpen ? (
        <div className="h-96 rounded-lg overflow-hidden">
          <ChatInterface
            conversationId={conversationId || ""}
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onQualify={handleQualify}
            isQualified={isQualified}
            onClose={handleCloseChat}
          />
        </div>
      ) : (
        <button
          onClick={handleOpenChat}
          className="bg-brass text-white rounded-full w-14 h-14 shadow-lg hover:bg-brassdeep transition flex items-center justify-center text-2xl hover:scale-110"
          aria-label="Open chat"
        >
          💬
        </button>
      )}
    </div>
  );
}
