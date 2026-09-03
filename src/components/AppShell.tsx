import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  NotebookPen,
  MessagesSquare,
  Menu,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { ResponsibleAiDialog } from "@/components/ResponsibleAiDialog";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Smart Email Generator", icon: Mail },
  { to: "/notes", label: "Meeting Notes Summarizer", icon: NotebookPen },
  { to: "/chat", label: "AI Chatbot", icon: MessagesSquare },
] as const;

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <Sparkles className="size-5" aria-hidden="true" />
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-semibold text-foreground">WorkFlow AI</span>
        <span className="block text-[11px] text-muted-foreground">Productivity assistant</span>
      </span>
    </div>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1" aria-label="Main">
      {NAV.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact: to === "/" }}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          activeProps={{
            className:
              "bg-primary/12 text-primary hover:bg-primary/12 hover:text-primary ring-1 ring-primary/20",
          }}
        >
          <Icon className="size-4 shrink-0" aria-hidden="true" />
          <span className="truncate">{label}</span>
        </Link>
      ))}
    </nav>
  );
}

function SidebarInner({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <div className="px-1 pt-1">
        <Brand />
      </div>
      <NavLinks onNavigate={onNavigate} />
      <div className="mt-auto rounded-xl border border-sidebar-border bg-card p-3">
        <p className="text-xs text-muted-foreground">
          No sign-in, no storage. Your prompts and results stay in this browser session only.
        </p>
        <ResponsibleAiDialog>
          <Button variant="outline" size="sm" className="mt-3 w-full justify-start gap-2">
            <ShieldCheck className="size-4" aria-hidden="true" />
            Responsible AI use
          </Button>
        </ResponsibleAiDialog>
      </div>
    </div>
  );
}

export function AppShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen surface-gradient">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
          <div className="sticky top-0 h-screen">
            <SidebarInner />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur">
            <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                    <Menu className="size-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 bg-sidebar p-0">
                  <SheetTitle className="sr-only">Navigation</SheetTitle>
                  <SidebarInner onNavigate={() => setOpen(false)} />
                </SheetContent>
              </Sheet>

              <div className="min-w-0 flex-1">
                <h1 className="truncate text-base font-semibold text-foreground sm:text-lg">
                  {title}
                </h1>
                <p className="hidden truncate text-xs text-muted-foreground sm:block">
                  {description}
                </p>
              </div>

              <ResponsibleAiDialog>
                <Button variant="outline" size="sm" className="gap-2">
                  <ShieldCheck className="size-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Responsible AI</span>
                </Button>
              </ResponsibleAiDialog>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-5xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
