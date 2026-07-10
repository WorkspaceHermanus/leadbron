"use client";

import { useState, useRef, useEffect } from "react";
import {
  FLOW,
  type Answer,
  type LeadCategory,
  isValidEmail,
  isValidSaPhone,
} from "@/lib/chat-flow";
import { PROVINCES } from "@/lib/verticals";

export type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

type Contact = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  province: string;
};

const EMPTY_CONTACT: Contact = { firstName: "", lastName: "", email: "", phone: "", province: "" };

export default function ChatInterface({
  visitorId,
  onClose,
}: {
  visitorId: string;
  onClose: () => void;
}) {
  const [stepId, setStepId] = useState("greeting");
  const [messages, setMessages] = useState<Message[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [contact, setContact] = useState<Contact>(EMPTY_CONTACT);
  const [category, setCategory] = useState<LeadCategory>("GENERAL");
  const [input, setInput] = useState("");
  const [inputError, setInputError] = useState("");
  const [botTyping, setBotTyping] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [finished, setFinished] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const spokenSteps = useRef<Set<string>>(new Set());

  const step = FLOW[stepId];

  // Speak the current step's bot line once, with a short typing delay.
  // The "spoken" flag is only set when the message lands, so React 18
  // StrictMode's mount-cleanup-mount cycle in dev doesn't swallow it.
  useEffect(() => {
    if (!step || spokenSteps.current.has(stepId)) return;
    setBotTyping(true);
    const t = setTimeout(() => {
      spokenSteps.current.add(stepId);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: step.bot, timestamp: new Date().toISOString() },
      ]);
      setBotTyping(false);
      if (step.kind === "end") setFinished(true);
    }, 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, botTyping, submitting]);

  function say(content: string) {
    setMessages((prev) => [
      ...prev,
      { role: "user", content, timestamp: new Date().toISOString() },
    ]);
  }

  function goTo(next: string) {
    // Returning to a step (e.g. browsing -> greeting) should re-speak it.
    spokenSteps.current.delete(next);
    setStepId(next);
  }

  function handleOption(label: string) {
    if (step.kind !== "options") return;
    const option = step.options.find((o) => o.label === label);
    if (!option) return;
    say(label);
    setAnswers((prev) => [
      ...prev.filter((a) => a.stepId !== step.id),
      { stepId: step.id, question: step.bot, answer: label },
    ]);
    if (option.category) setCategory(option.category);
    goTo(option.next ?? step.next ?? "timing");
  }

  function handleInput(e: React.FormEvent) {
    e.preventDefault();
    if (step.kind !== "input") return;
    const value = input.trim();
    setInputError("");

    if (!value) return;
    if (step.field === "email" && !isValidEmail(value)) {
      setInputError("That email address doesn't look right — please check it.");
      return;
    }
    if (step.field === "phone" && !isValidSaPhone(value)) {
      setInputError("Please enter a valid SA phone number (at least 9 digits).");
      return;
    }
    if ((step.field === "firstName" || step.field === "lastName") && value.length < 2) {
      setInputError("Please enter your full name.");
      return;
    }

    say(step.field === "phone" || step.field === "email" ? value : value);
    setContact((prev) => ({ ...prev, [step.field]: value }));
    setInput("");
    goTo(step.next);
  }

  function handleProvince(province: string) {
    if (step.kind !== "province") return;
    say(province);
    setContact((prev) => ({ ...prev, province }));
    goTo(step.next);
  }

  async function handleConsent(agreed: boolean) {
    if (!agreed) {
      say("Not now");
      goTo("goodbye");
      return;
    }
    say("I agree — request my call");
    setSubmitting(true);
    setSubmitError("");

    const finalTranscript: Message[] = [
      ...messages,
      { role: "user", content: "I agree — request my call (POPIA consent)", timestamp: new Date().toISOString() },
    ];

    try {
      const res = await fetch("/api/chat/qualify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId,
          category,
          answers,
          contact,
          consent: true,
          transcript: finalTranscript,
          source:
            new URLSearchParams(window.location.search).get("utm_source") ?? "chat",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        goTo("done");
      } else {
        setSubmitError(data.error ?? "Something went wrong — please try again.");
      }
    } catch {
      setSubmitError("Connection problem — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const showControls = !botTyping && !submitting && !finished;

  return (
    <div className="flex h-full flex-col rounded-lg border border-moss/20 bg-white shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between rounded-t-lg border-b border-moss/20 bg-ink px-4 py-3 text-mist">
        <div>
          <p className="font-display font-700">LeadBron Assistant</p>
          <p className="text-xs text-mist/70">Free quotes · accredited advisers</p>
        </div>
        <button onClick={onClose} className="text-mist/60 transition hover:text-mist" aria-label="Close chat">
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-lg px-4 py-2 text-sm ${
                msg.role === "user"
                  ? "rounded-br-none bg-brass text-white"
                  : "rounded-bl-none bg-mist text-ink"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {(botTyping || submitting) && (
          <div className="flex justify-start">
            <div className="rounded-lg rounded-bl-none bg-mist px-4 py-3">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-moss" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-moss" style={{ animationDelay: "0.15s" }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-moss" style={{ animationDelay: "0.3s" }} />
              </div>
            </div>
          </div>
        )}

        {submitError && (
          <div className="rounded-lg border border-signal/30 bg-signal/10 p-3">
            <p className="text-sm text-signal">{submitError}</p>
            <button
              onClick={() => handleConsent(true)}
              className="mt-2 text-sm font-semibold text-brassdeep hover:text-brass"
            >
              Try again →
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Controls */}
      <div className="border-t border-moss/15 bg-mist/50 p-3">
        {showControls && step.kind === "options" && (
          <div className="flex flex-wrap gap-2">
            {step.options.map((o) => (
              <button
                key={o.label}
                onClick={() => handleOption(o.label)}
                className="rounded-full border border-brass/50 bg-white px-3 py-1.5 text-sm font-medium text-ink transition hover:border-brass hover:bg-brass hover:text-white"
              >
                {o.label}
              </button>
            ))}
          </div>
        )}

        {showControls && step.kind === "input" && (
          <form onSubmit={handleInput}>
            <div className="flex gap-2">
              <input
                type={step.field === "email" ? "email" : step.field === "phone" ? "tel" : "text"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={step.placeholder}
                autoFocus
                className="flex-1 rounded-md border border-moss/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brass"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="rounded-md bg-brass px-4 py-2 text-sm font-semibold text-white transition hover:bg-brassdeep disabled:opacity-50"
              >
                Send
              </button>
            </div>
            {inputError && <p className="mt-2 text-xs text-signal">{inputError}</p>}
          </form>
        )}

        {showControls && step.kind === "province" && (
          <div className="flex flex-wrap gap-2">
            {PROVINCES.map((p) => (
              <button
                key={p}
                onClick={() => handleProvince(p)}
                className="rounded-full border border-brass/50 bg-white px-3 py-1.5 text-sm font-medium text-ink transition hover:border-brass hover:bg-brass hover:text-white"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {showControls && step.kind === "consent" && (
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleConsent(true)}
              className="rounded-md bg-brass px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brassdeep"
            >
              I agree — request my call
            </button>
            <button
              onClick={() => handleConsent(false)}
              className="rounded-md border border-moss/20 px-4 py-2 text-sm font-medium text-moss transition hover:bg-moss/10"
            >
              Not now
            </button>
          </div>
        )}

        {(finished || step.kind === "end") && !botTyping && (
          <p className="text-center text-xs text-moss/70">
            Protected by POPIA — your details are only shared with one accredited adviser, with your consent.
          </p>
        )}

        {showControls && step.kind !== "end" && (
          <p className="mt-2 text-center text-[11px] text-moss/60">
            POPIA protected · no spam · one adviser only
          </p>
        )}
      </div>
    </div>
  );
}
