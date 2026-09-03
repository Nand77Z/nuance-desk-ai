import { Info } from "lucide-react";

export const AI_DISCLAIMER =
  "AI-generated content. Review for accuracy before sharing or acting on it.";

export function AiDisclaimer({ className = "" }: { className?: string }) {
  return (
    <p
      className={`flex items-start gap-2 text-xs text-muted-foreground ${className}`}
      role="note"
    >
      <Info className="mt-px size-3.5 shrink-0 text-primary" aria-hidden="true" />
      <span>{AI_DISCLAIMER}</span>
    </p>
  );
}
