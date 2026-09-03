import { Check, Copy, Pencil, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";

import { AiDisclaimer } from "@/components/AiDisclaimer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

export function OutputSkeleton() {
  return (
    <div className="space-y-3" aria-live="polite" aria-busy="true">
      <Skeleton className="h-4 w-2/5" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-11/12" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-3/5" />
      <p className="text-xs text-muted-foreground">Generating with AI…</p>
    </div>
  );
}

export function AiOutput({
  title,
  value,
  onChange,
  loading,
  emptyHint,
  onRegenerate,
  canRegenerate,
}: {
  title: string;
  value: string;
  onChange: (next: string) => void;
  loading: boolean;
  emptyHint: string;
  onRegenerate?: () => void;
  canRegenerate?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Copying isn't available in this browser");
    }
  };

  return (
    <Card className="border-border/80">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
        <CardTitle className="text-base">{title}</CardTitle>
        {value && !loading ? (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setEditing((e) => !e)}>
              <Pencil className="size-3.5" aria-hidden="true" />
              {editing ? "Preview" : "Edit"}
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={copy}>
              {copied ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
              Copy
            </Button>
            {onRegenerate ? (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={onRegenerate}
                disabled={!canRegenerate}
              >
                <RotateCcw className="size-3.5" aria-hidden="true" />
                Regenerate
              </Button>
            ) : null}
          </div>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <OutputSkeleton />
        ) : value ? (
          editing ? (
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="min-h-72 font-mono text-sm"
              aria-label={`Edit ${title}`}
            />
          ) : (
            <div className="prose-ai text-sm text-foreground">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
            </div>
          )
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-muted/40 p-8 text-center">
            <p className="text-sm text-muted-foreground">{emptyHint}</p>
          </div>
        )}
        {value && !loading ? <AiDisclaimer /> : null}
      </CardContent>
    </Card>
  );
}
