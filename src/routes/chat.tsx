import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, MessagesSquare, RotateCcw, SendHorizonal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";

import { AiDisclaimer } from "@/components/AiDisclaimer";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { runAi } from "@/lib/ai.functions";
import { recordActivity } from "@/lib/session-store";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — WorkFlow AI" },
      {
        name: "description",
        content:
          "Ask the workplace AI assistant for help planning, prioritising, writing, and solving problems at work.",
      },
      { property: "og:title", content: "AI Chatbot — WorkFlow AI" },
      {
        property: "og:description",
        content: "A session-only AI assistant for everyday workplace questions.",
      },
    ],
  }),
  component: ChatPage,
});

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Help me prioritise five competing deadlines this week",
  "Draft an agenda for a 30-minute project kickoff",
  "Rewrite this update so it is clearer for executives",
  "What questions should I ask in a vendor review?",
];

function ChatPage() {
  const generate = useServerFn(runAi);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;
    const next: Message[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const result = await generate({ data: { kind: "chat", messages: next } });
      setMessages([...next, { role: "assistant", content: result.text }]);
      recordActivity("chat", content.slice(0, 70));
    } catch (error) {
      setMessages(next);
      toast.error(error instanceof Error ? error.message : "The assistant could not reply.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      title="AI Chatbot"
      description="Ask anything about your work. This conversation is not saved."
    >
      <Card className="flex h-[calc(100vh-11rem)] min-h-[30rem] flex-col border-border/80">
        <CardContent className="flex min-h-0 flex-1 flex-col gap-4 p-4 sm:p-6">
          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            {messages.length === 0 && !loading ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                <span className="grid size-12 place-items-center rounded-2xl bg-accent text-accent-foreground">
                  <MessagesSquare className="size-6" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">Start a conversation</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try one of these, or ask your own question.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => void send(s)}
                      className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
                  >
                    <div
                      className={
                        m.role === "user"
                          ? "max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                          : "prose-ai max-w-[90%] rounded-2xl rounded-bl-sm bg-muted px-4 py-3 text-sm text-foreground"
                      }
                    >
                      {m.role === "user" ? (
                        m.content
                      ) : (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                      )}
                    </div>
                  </div>
                ))}
                {loading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    Thinking…
                  </div>
                ) : null}
                <div ref={endRef} />
              </div>
            )}
          </div>

          <div className="space-y-2 border-t border-border pt-4">
            <div className="flex items-end gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send(input);
                  }
                }}
                placeholder="Ask about planning, writing, prioritising…"
                className="max-h-40 min-h-11 flex-1 resize-none"
                aria-label="Message"
              />
              <Button
                onClick={() => void send(input)}
                disabled={loading || !input.trim()}
                size="icon"
                aria-label="Send message"
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <SendHorizonal className="size-4" />
                )}
              </Button>
              {messages.length > 0 ? (
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Clear conversation"
                  onClick={() => setMessages([])}
                  disabled={loading}
                >
                  <RotateCcw className="size-4" />
                </Button>
              ) : null}
            </div>
            <AiDisclaimer />
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
