import { ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const GUIDANCE: { heading: string; body: string }[] = [
  {
    heading: "AI assists, people decide",
    body: "Every output from this assistant is a draft. A person stays accountable for what is sent, shared, or acted on.",
  },
  {
    heading: "Always review before use",
    body: "AI can be confidently wrong. Check names, dates, numbers, commitments, and tone before an email leaves your outbox or a summary reaches your team.",
  },
  {
    heading: "Protect confidential information",
    body: "Do not paste passwords, personal identification numbers, financial account details, health records, or other sensitive information into any AI tool.",
  },
  {
    heading: "Nothing is stored",
    body: "This app has no accounts and no database. Prompts and outputs live only in your browser session and are sent to the AI provider solely to generate the response you requested. Refreshing or closing the tab clears everything.",
  },
  {
    heading: "Be alert to bias",
    body: "AI models learn from historical data and can reproduce bias. Take extra care with content that affects hiring, performance, pay, or client relationships.",
  },
  {
    heading: "Keep a human tone",
    body: "Edit generated text so it sounds like you and reflects your organisation's voice, policies, and commitments.",
  },
  {
    heading: "Follow your workplace policy",
    body: "Where your employer's AI, privacy, or records policy is stricter than this guidance, that policy applies.",
  },
];

export function ResponsibleAiDialog({ children }: { children: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[85vh] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" aria-hidden="true" />
            Responsible AI use
          </DialogTitle>
          <DialogDescription>
            How to get value from this assistant without putting your work or your data at risk.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[55vh] pr-4">
          <ul className="space-y-4">
            {GUIDANCE.map((item) => (
              <li key={item.heading}>
                <h3 className="text-sm font-semibold text-foreground">{item.heading}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
