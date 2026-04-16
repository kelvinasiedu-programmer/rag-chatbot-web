"use client";

/**
 * BoltStyleChat — adapted from the Bolt chat reference component.
 *
 * Design rules applied:
 *   - ONE flat background color (#0F0F12)
 *   - ONE accent color (#7C5CFC)
 *   - No gradients, no glassmorphism, no backdrop-filter, no radial blooms
 *
 * Wiring:
 *   - Hits the live RAG backend at NEXT_PUBLIC_RAG_API
 *     (default: https://kelvin-programmer-rag-chatbot.hf.space)
 *   - Supports PDF upload, grounded Q&A with source citations.
 */

import React, { useEffect, useRef, useState } from "react";
import {
  Plus,
  FileText,
  Trash2,
  Github,
  SendHorizontal,
  Sparkles,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ---------- API wiring ----------
const API_BASE =
  process.env.NEXT_PUBLIC_RAG_API ||
  "https://kelvin-programmer-rag-chatbot.hf.space";
const API = `${API_BASE}/api/v1`;

interface SourceChunk {
  text: string;
  score: number;
  metadata?: { source?: string; page?: number; chunk_index?: number };
}

interface Message {
  role: "user" | "assistant" | "error";
  content: string;
  sources?: SourceChunk[];
  pending?: boolean;
}

// ---------- attach menu ----------
function AttachMenu({
  onUpload,
  onClear,
}: {
  onUpload: () => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        aria-label="Open document actions"
        className="focus-ring flex size-8 items-center justify-center rounded-full bg-surface-2 text-ink-dim transition-colors hover:bg-border hover:text-ink"
      >
        <Plus
          className={cn(
            "size-4 transition-transform duration-150",
            open && "rotate-45",
          )}
        />
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute bottom-full left-0 z-50 mb-2 min-w-[200px] overflow-hidden rounded-md border border-border bg-surface-2 shadow-xl animate-slide-up">
            <div className="p-1.5">
              <button
                type="button"
                onClick={() => {
                  onUpload();
                  setOpen(false);
                }}
                className="focus-ring flex w-full items-center gap-3 rounded-sm px-3 py-2 text-ink-dim transition-colors hover:bg-surface hover:text-ink"
              >
                <FileText className="size-4 text-accent" />
                <span className="text-sm">Upload PDF</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onClear();
                  setOpen(false);
                }}
                className="focus-ring flex w-full items-center gap-3 rounded-sm px-3 py-2 text-ink-dim transition-colors hover:bg-surface hover:text-ink"
              >
                <Trash2 className="size-4" />
                <span className="text-sm">Clear documents</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ---------- chat input ----------
function ChatInput({
  onSend,
  onUpload,
  onClear,
  placeholder = "Ask anything about your documents…",
  autofocus,
}: {
  onSend: (msg: string) => void;
  onUpload: () => void;
  onClear: () => void;
  placeholder?: string;
  autofocus?: boolean;
}) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const t = textareaRef.current;
    if (t) {
      t.style.height = "auto";
      t.style.height = `${Math.min(t.scrollHeight, 220)}px`;
    }
  }, [message]);

  useEffect(() => {
    if (autofocus) textareaRef.current?.focus();
  }, [autofocus]);

  const submit = () => {
    const v = message.trim();
    if (!v) return;
    onSend(v);
    setMessage("");
  };

  return (
    <div className="relative mx-auto w-full max-w-[700px]">
      <div className="rounded-lg border border-border bg-surface transition-colors focus-within:border-accent focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 focus-within:ring-offset-bg">
        <textarea
          ref={textareaRef}
          aria-label="Ask a question about your documents"
          autoComplete="off"
          enterKeyHint="send"
          name="question"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={placeholder}
          className="min-h-[80px] w-full resize-none bg-transparent px-5 pb-2 pt-5 text-[15px] text-ink placeholder:text-ink-mute focus:outline-none"
          style={{ maxHeight: 220 }}
        />
        <div className="flex flex-wrap items-center gap-2 px-3 pb-3 pt-1">
          <AttachMenu onUpload={onUpload} onClear={onClear} />
          <div className="flex-1" />
          <button
            type="button"
            onClick={submit}
            disabled={!message.trim()}
            className="focus-ring flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition-[filter] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:brightness-100"
          >
            <span>Ask</span>
            <SendHorizontal className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- announcement pill ----------
function Announcement() {
  return (
    <a
      href="https://github.com/kelvinasiedu-programmer/rag-chatbot-web"
      target="_blank"
      rel="noopener noreferrer"
      className="focus-ring inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-xs text-ink-dim transition-colors hover:border-accent hover:text-ink"
    >
      <Sparkles className="size-3.5 text-accent" />
      <span>Introducing RAG Chatbot — Next.js edition</span>
    </a>
  );
}

// ---------- import buttons ----------
function ImportButtons({ onUpload }: { onUpload: () => void }) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
      <span className="text-sm text-ink-mute">Quick start</span>
      <button
        type="button"
        onClick={onUpload}
        className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-border bg-bg px-3 py-1.5 text-xs font-medium text-ink-dim transition-colors hover:border-accent hover:text-ink"
      >
        <Upload className="size-3.5" />
        PDF
      </button>
      <a
        href="https://github.com/kelvinasiedu-programmer/rag-chatbot"
        target="_blank"
        rel="noopener noreferrer"
        className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-border bg-bg px-3 py-1.5 text-xs font-medium text-ink-dim transition-colors hover:border-accent hover:text-ink"
      >
        <Github className="size-3.5" />
        API repo
      </a>
    </div>
  );
}

// ---------- message bubble ----------
function MessageBubble({ m }: { m: Message }) {
  if (m.role === "user") {
    return (
      <div className="rounded-md border border-border-hi bg-bg p-5">
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-accent">
          You
        </div>
        <div className="whitespace-pre-wrap text-[14px] leading-7 text-ink">
          {m.content}
        </div>
      </div>
    );
  }
  if (m.role === "error") {
    return (
      <div className="rounded-md border border-danger bg-surface p-5">
        <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-danger">
          Error
        </div>
        <div className="whitespace-pre-wrap text-[14px] leading-7 text-ink">
          {m.content}
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-md border border-border bg-surface p-5">
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-ink-mute">
        Assistant
      </div>
      {m.pending ? (
        <div className="inline-flex items-center gap-1">
          <span className="size-1.5 animate-blink rounded-full bg-ink-mute" />
          <span
            className="size-1.5 animate-blink rounded-full bg-ink-mute"
            style={{ animationDelay: "0.15s" }}
          />
          <span
            className="size-1.5 animate-blink rounded-full bg-ink-mute"
            style={{ animationDelay: "0.3s" }}
          />
        </div>
      ) : (
        <div className="whitespace-pre-wrap text-[14px] leading-7 text-ink">
          {m.content}
        </div>
      )}
      {m.sources && m.sources.length > 0 && (
        <div className="mt-3 flex flex-col gap-2">
          {m.sources.map((s, i) => (
            <div
              key={i}
              className="rounded-sm border border-border bg-bg p-3 text-[12px] text-ink-dim"
            >
              <div className="mb-1 flex justify-between gap-2 text-[11px] text-ink-mute">
                <span className="font-mono font-semibold text-accent">
                  Source {i + 1}
                </span>
                <span>
                  {s.metadata?.source}
                  {s.metadata?.page ? ` · p.${s.metadata.page}` : ""} · score{" "}
                  {s.score?.toFixed(3)}
                </span>
              </div>
              <div className="leading-6 text-ink">
                {s.text.slice(0, 420)}
                {s.text.length > 420 ? "…" : ""}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- main component ----------
export function BoltStyleChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [stats, setStats] = useState<{ total_documents: number } | null>(null);
  const [toast, setToast] = useState<{ msg: string; kind?: "error" | "success" } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  const inConversation = messages.length > 0;

  // --- toast ---
  function flash(msg: string, kind?: "error" | "success") {
    setToast({ msg, kind });
    window.setTimeout(() => setToast(null), 2800);
  }

  // --- scroll ---
  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  // --- stats ---
  async function loadStats() {
    try {
      const r = await fetch(`${API}/documents`);
      if (!r.ok) return;
      const d = await r.json();
      setStats({ total_documents: d.total_documents ?? 0 });
    } catch {
      /* offline; silent */
    }
  }
  useEffect(() => {
    loadStats();
  }, []);

  // --- upload ---
  function triggerUpload() {
    fileInputRef.current?.click();
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      flash("Only PDF files are supported", "error");
      return;
    }
    flash("Uploading & indexing…");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const r = await fetch(`${API}/documents/upload`, {
        method: "POST",
        body: fd,
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.detail || "Upload failed");
      flash(`Indexed ${d.chunks_added ?? "?"} chunks from ${file.name}`, "success");
      loadStats();
    } catch (err) {
      flash((err as Error).message, "error");
    }
  }

  async function clearDocuments() {
    if (!window.confirm("Clear all indexed documents?")) return;
    try {
      const r = await fetch(`${API}/documents`, { method: "DELETE" });
      if (!r.ok) throw new Error("Clear failed");
      flash("All documents cleared", "success");
      loadStats();
    } catch (err) {
      flash((err as Error).message, "error");
    }
  }

  // --- ask ---
  async function ask(question: string) {
    setMessages((prev) => [
      ...prev,
      { role: "user", content: question },
      { role: "assistant", content: "", pending: true },
    ]);
    try {
      const r = await fetch(`${API}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.detail || "Query failed");
      setMessages((prev) => {
        const copy = prev.slice();
        copy[copy.length - 1] = {
          role: "assistant",
          content: d.answer || "(no answer)",
          sources: d.sources,
        };
        return copy;
      });
    } catch (err) {
      setMessages((prev) => {
        const copy = prev.slice();
        copy[copy.length - 1] = {
          role: "error",
          content: (err as Error).message,
        };
        return copy;
      });
    }
  }

  function resetConversation() {
    setMessages([]);
  }

  // --- drag and drop PDF anywhere ---
  useEffect(() => {
    const prevent = (e: DragEvent) => e.preventDefault();
    const drop = (e: DragEvent) => {
      e.preventDefault();
      const f = e.dataTransfer?.files?.[0];
      if (f && f.name.toLowerCase().endsWith(".pdf")) {
        const dt = new DataTransfer();
        dt.items.add(f);
        if (fileInputRef.current) {
          fileInputRef.current.files = dt.files;
          fileInputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }
    };
    window.addEventListener("dragover", prevent);
    window.addEventListener("drop", drop);
    return () => {
      window.removeEventListener("dragover", prevent);
      window.removeEventListener("drop", drop);
    };
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-bg text-ink">
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFile}
        hidden
      />

      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-border px-6 py-4 sm:px-8">
        <div className="flex items-center gap-2.5">
          <div className="grid size-7 place-items-center rounded-sm bg-accent font-mono text-sm font-bold text-white">
            R
          </div>
          <span className="text-sm font-semibold tracking-tight">
            RAG Chatbot
          </span>
        </div>
        <nav className="flex items-center gap-1">
          <a
            href={`${API_BASE}/docs`}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring rounded-sm px-3 py-1.5 text-xs text-ink-dim transition-colors hover:bg-surface hover:text-ink"
          >
            API
          </a>
          <a
            href="https://github.com/kelvinasiedu-programmer/rag-chatbot-web"
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring rounded-sm px-3 py-1.5 text-xs text-ink-dim transition-colors hover:bg-surface hover:text-ink"
          >
            GitHub
          </a>
          <button
            type="button"
            onClick={resetConversation}
            disabled={!inConversation}
            className="focus-ring rounded-sm px-3 py-1.5 text-xs text-ink-dim transition-colors hover:bg-surface hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink-dim"
          >
            New chat
          </button>
        </nav>
      </header>

      {/* Hero vs conversation */}
      {!inConversation ? (
        <section className="flex flex-1 flex-col items-center justify-center px-5 pb-20 pt-12">
          <Announcement />
          <h1 className="mb-3 mt-14 text-center text-[2.2rem] font-bold leading-[1.1] tracking-tight sm:text-[3rem]">
            What would you like to{" "}
            <em className="font-bold not-italic text-accent">know</em> today?
          </h1>
          <p className="mb-9 max-w-[540px] text-center text-base text-ink-dim">
            Upload a PDF and ask grounded questions. Answers cite the source
            pages they came from.
          </p>

          <ChatInput
            onSend={ask}
            onUpload={triggerUpload}
            onClear={clearDocuments}
            autofocus
          />

          <ImportButtons onUpload={triggerUpload} />

          <div className="mt-9 flex items-center gap-2 text-xs text-ink-mute">
            <span>Indexed:</span>
            <strong className="font-semibold text-ink">
              {stats?.total_documents ?? 0}
            </strong>
            <span>documents</span>
          </div>
        </section>
      ) : (
        <>
          <section className="mx-auto flex w-full max-w-[820px] flex-1 flex-col gap-4 overflow-y-auto px-5 py-6">
            {messages.map((m, i) => (
              <MessageBubble key={i} m={m} />
            ))}
            <div ref={scrollAnchorRef} />
          </section>
          <div className="border-t border-border bg-bg px-5 py-4">
            <ChatInput
              onSend={ask}
              onUpload={triggerUpload}
              onClear={clearDocuments}
              placeholder="Follow up…"
            />
          </div>
        </>
      )}

      {/* Toast */}
      {toast && (
        <div
          aria-atomic="true"
          aria-live="polite"
          role="status"
          className={cn(
            "fixed bottom-7 left-1/2 z-50 -translate-x-1/2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-ink animate-fade-in",
            toast.kind === "error" && "border-danger text-danger",
            toast.kind === "success" && "border-accent text-accent",
          )}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
