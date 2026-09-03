import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Clock,
  Mail,
  MessagesSquare,
  NotebookPen,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { AiDisclaimer } from "@/components/AiDisclaimer";
import { AppShell } from "@/components/AppShell";
import { ResponsibleAiDialog } from "@/components/ResponsibleAiDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@/lib/session-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — WorkFlow AI Productivity Assistant" },
      {
        name: "description",
        content:
          "A no-login AI workplace assistant: generate emails, summarize meeting notes, and chat for everyday work help.",
      },
      { property: "og:title", content: "WorkFlow AI Productivity Assistant" },
      {
        property: "og:description",
        content: "Generate emails, summarize meetings, and chat with AI. No accounts, no storage.",
      },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    body: "Describe the message, choose a tone and length, and get an editable draft ready to send.",
    key: "email" as const,
  },
  {
    to: "/notes",
    icon: NotebookPen,
    title: "Meeting Notes Summarizer",
    body: "Turn messy notes into a summary with decisions, action items, and open questions.",
    key: "notes" as const,
  },
  {
    to: "/chat",
    icon: MessagesSquare,
    title: "AI Chatbot",
    body: "Ask for help planning, prioritising, and problem solving through the working day.",
    key: "chat" as const,
  },
];

function timeAgo(at: number) {
  const s = Math.max(1, Math.round((Date.now() - at) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.round(m / 60)}h ago`;
}

function Dashboard() {
  const { counts, activity } = useSession();
  const total = counts.email + counts.notes + counts.chat;

  return (
    <AppShell
      title="Dashboard"
      description="Your AI workplace toolkit — no sign-in, nothing stored."
    >
      <div className="space-y-6">
        <Card className="overflow-hidden border-border/80 bg-card">
          <CardContent className="flex flex-col gap-5 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                <Sparkles className="size-3.5" aria-hidden="true" />
                Session-only AI workspace
              </span>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Get the writing work done, faster.
              </h2>
              <p className="text-sm text-muted-foreground">
                Three focused AI tools for everyday workplace communication. Everything runs
                per request — there are no accounts, and nothing you type is saved.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <Button asChild className="gap-2">
                  <Link to="/email">
                    Draft an email
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <ResponsibleAiDialog>
                  <Button variant="outline" className="gap-2">
                    <ShieldCheck className="size-4" aria-hidden="true" />
                    Responsible AI use
                  </Button>
                </ResponsibleAiDialog>
              </div>
            </div>
            <div className="grid w-full max-w-xs grid-cols-3 gap-3 md:w-auto">
              {[
                { label: "Emails", value: counts.email },
                { label: "Summaries", value: counts.notes },
                { label: "Chats", value: counts.chat },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-border bg-background px-3 py-4 text-center"
                >
                  <p className="text-2xl font-semibold text-primary">{stat.value}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map(({ to, icon: Icon, title, body, key }) => (
            <Link key={to} to={to} className="group">
              <Card className="h-full border-border/80 transition-all group-hover:-translate-y-0.5 group-hover:border-primary/40 group-hover:shadow-md">
                <CardHeader className="space-y-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <CardTitle className="text-base">{title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{body}</p>
                  <p className="text-xs text-muted-foreground">
                    {counts[key]} this session
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="size-4 text-primary" aria-hidden="true" />
              Session activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activity.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-muted/40 p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Nothing yet. Anything you generate this session shows up here and disappears when
                  you refresh.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {activity.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-4 py-2.5">
                    <span className="min-w-0 truncate text-sm text-foreground">{item.label}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {item.tool === "email"
                        ? "Email"
                        : item.tool === "notes"
                          ? "Summary"
                          : "Chat"}{" "}
                      · {timeAgo(item.at)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <p className="text-xs text-muted-foreground">
              {total === 0
                ? "Counters reset every time the page reloads."
                : `${total} AI generations this session. Counters reset on reload.`}
            </p>
            <AiDisclaimer />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
