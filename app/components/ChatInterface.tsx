"use client";

import { useState, useRef, useEffect } from "react";

export type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

interface ChatInterfaceProps {
  conversationId: string;
  messages: Message[];
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
  onQualify: (consent: boolean) => Promise<void>;
  isQualified: boolean;
  onClose: () => void;
}

export default function ChatInterface({
  conversationId,
  messages,
  onSendMessage,
  isLoading,
  onQualify,
  isQualified,
  onClose,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [qualifyLoading, setQualifyLoading] = useState(false);
  const [showQualifyPrompt, setShowQualifyPrompt] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setError("");
    const message = input.trim();
    setInput("");

    try {
      await onSendMessage(message);
      // Check if we should show qualify prompt after a certain number of messages
      if (messages.length > 4 && messages.length % 4 === 0) {
        setShowQualifyPrompt(true);
      }
    } catch (err) {
      setError("Failed to send message. Please try again.");
    }
  };

  const handleQualify = async (consent: boolean) => {
    setQualifyLoading(true);
    try {
      await onQualify(consent);
      setShowQualifyPrompt(false);
    } catch (err) {
      setError("Failed to qualify. Please try again.");
    } finally {
      setQualifyLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-white rounded-lg border border-moss/20 shadow-lg">
      {/* Header */}
      <div className="border-b border-moss/20 bg-ink text-mist px-4 py-3 flex items-center justify-between rounded-t-lg">
        <div>
          <p className="font-semibold">LeadBron Advisor</p>
          <p className="text-xs text-mist/70">Powered by AI</p>
        </div>
        <button
          onClick={onClose}
          className="text-mist/60 hover:text-mist transition"
          aria-label="Close chat"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-moss/70 py-8">
            <p className="text-sm">Start chatting to explore your options</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                  msg.role === "user"
                    ? "bg-brass text-white rounded-br-none"
                    : "bg-moss/20 text-ink rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-moss/20 text-ink px-4 py-2 rounded-lg rounded-bl-none">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-ink rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-ink rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                <div className="w-2 h-2 bg-ink rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          </div>
        )}

        {/* Qualify Prompt */}
        {showQualifyPrompt && !isQualified && (
          <div className="bg-brass/10 border border-brass/30 rounded-lg p-3 mt-4">
            <p className="text-sm text-ink font-semibold mb-3">
              Would you like an accredited adviser to contact you about your needs?
            </p>
            <p className="text-xs text-moss mb-3">
              Your information will be shared with a qualified adviser (POPIA consent required).
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleQualify(true)}
                disabled={qualifyLoading}
                className="flex-1 bg-brass text-white px-3 py-2 rounded text-sm font-semibold hover:bg-brassdeep disabled:opacity-60 transition"
              >
                {qualifyLoading ? "Processing..." : "Yes, contact me"}
              </button>
              <button
                onClick={() => handleQualify(false)}
                disabled={qualifyLoading}
                className="flex-1 border border-moss/20 text-ink px-3 py-2 rounded text-sm font-semibold hover:bg-moss/10 disabled:opacity-60 transition"
              >
                Not now
              </button>
            </div>
          </div>
        )}

        {isQualified && (
          <div className="bg-green-50 border border-green-300 rounded-lg p-3 mt-4">
            <p className="text-sm text-green-900 font-semibold">✓ Your request has been received</p>
            <p className="text-xs text-green-800 mt-1">
              An accredited adviser will contact you shortly.
            </p>
          </div>
        )}

        {error && (
          <div className="bg-signal/10 border border-signal/30 rounded-lg p-3 mt-4">
            <p className="text-sm text-signal">{error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {!isQualified && (
        <form
          onSubmit={handleSendMessage}
          className="border-t border-moss/20 p-3 bg-mist/50"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 px-3 py-2 rounded-md border border-moss/20 text-sm focus:outline-none focus:ring-2 focus:ring-brass disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-brass text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-brassdeep disabled:opacity-60 transition"
            >
              Send
            </button>
          </div>
          <p className="text-xs text-moss/60 mt-2">
            Your information is protected by POPIA. We'll never share your details without consent.
          </p>
        </form>
      )}
    </div>
  );
}
