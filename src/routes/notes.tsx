import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, NotebookPen, Wand2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { AiOutput } from "@/components/AiOutput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { runAi } from "@/lib/ai.functions";
import { recordActivity } from "@/lib/session-store";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — WorkFlow AI" },
      {
        name: "description",
        content:
          "Paste raw meeting notes or a transcript and get a structured summary with decisions and action items.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — WorkFlow AI" },
      {
        property: "og:description",
        content: "Structured summaries, decisions, and action items from messy meeting notes.",
      },
    ],
  }),
  component: NotesPage,
});

const FOCUS = [
  "Balanced summary",
  "Action items first",
  "Decisions and risks",
  "Executive brief",
] as const;

function NotesPage() {
  const generate = useServerFn(runAi);
  const [title, setTitle] = useState("");
  const [attendees, setAttendees] = useState("");
  const [transcript, setTranscript] = useState("");
  const [focus, setFocus] = useState<string>(FOCUS[0]);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!transcript.trim()) {
      toast.error("Paste your meeting notes or transcript first.");
      return;
    }
    setLoading(true);
    try {
      const result = await generate({
        data: { kind: "notes", title, attendees, transcript, focus },
      });
      setOutput(result.text);
      recordActivity("notes", title.trim() || "Meeting summary");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Summarizing failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      title="Meeting Notes Summarizer"
      description="Turn raw notes into a summary, decisions, and action items."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <NotebookPen className="size-4 text-primary" aria-hidden="true" />
              Meeting input
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Meeting title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Q3 planning sync"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="focus">Summary focus</Label>
                <Select value={focus} onValueChange={setFocus}>
                  <SelectTrigger id="focus">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FOCUS.map((f) => (
                      <SelectItem key={f} value={f}>
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="attendees">Attendees</Label>
              <Input
                id="attendees"
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                placeholder="e.g. Nandi, Peter, Aisha"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transcript">Raw notes or transcript</Label>
              <Textarea
                id="transcript"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Paste everything you captured during the meeting…"
                className="min-h-64"
              />
            </div>
            <Button onClick={run} disabled={loading} className="w-full gap-2">
              {loading ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Wand2 className="size-4" aria-hidden="true" />
              )}
              {loading ? "Summarizing…" : "Summarize notes"}
            </Button>
          </CardContent>
        </Card>

        <AiOutput
          title="Structured summary"
          value={output}
          onChange={setOutput}
          loading={loading}
          emptyHint="Your summary, decisions, and action items will appear here once you summarize a meeting."
          onRegenerate={run}
          canRegenerate={Boolean(transcript.trim()) && !loading}
        />
      </div>
    </AppShell>
  );
}
