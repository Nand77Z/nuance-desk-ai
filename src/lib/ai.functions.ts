import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";

import { AI_MODEL, createLovableAiGatewayProvider } from "./ai-gateway.server";

const EmailInput = z.object({
  kind: z.literal("email"),
  purpose: z.string().min(1),
  recipient: z.string().default(""),
  tone: z.string().default("Professional"),
  length: z.string().default("Medium"),
  keyPoints: z.string().default(""),
});

const NotesInput = z.object({
  kind: z.literal("notes"),
  title: z.string().default(""),
  attendees: z.string().default(""),
  transcript: z.string().min(1),
  focus: z.string().default("Balanced summary"),
});

const ChatInput = z.object({
  kind: z.literal("chat"),
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })).min(1),
});

const AiInput = z.discriminatedUnion("kind", [EmailInput, NotesInput, ChatInput]);
export type AiInput = z.infer<typeof AiInput>;

function buildPrompt(data: AiInput): { system: string; messages: { role: "user" | "assistant"; content: string }[] } {
  if (data.kind === "email") {
    return {
      system:
        "You are a workplace communication assistant. Write clear, ready-to-send business emails in Markdown. Always include a subject line as the first line formatted as `Subject: ...`, then the email body. Never invent facts that were not provided.",
      messages: [
        {
          role: "user",
          content: [
            `Purpose of the email: ${data.purpose}`,
            `Recipient: ${data.recipient || "Not specified"}`,
            `Tone: ${data.tone}`,
            `Desired length: ${data.length}`,
            `Key points to include: ${data.keyPoints || "None provided"}`,
          ].join("\n"),
        },
      ],
    };
  }
  if (data.kind === "notes") {
    return {
      system:
        "You are a meeting notes summarizer. Given raw notes or a transcript, produce Markdown with these sections: `## Summary`, `## Key Decisions`, `## Action Items` (as a checklist with owners and due dates when stated), and `## Open Questions`. Only use information present in the input; write 'Not mentioned' where the input is silent.",
      messages: [
        {
          role: "user",
          content: [
            `Meeting title: ${data.title || "Untitled meeting"}`,
            `Attendees: ${data.attendees || "Not specified"}`,
            `Summary focus: ${data.focus}`,
            "Raw notes / transcript:",
            data.transcript,
          ].join("\n"),
        },
      ],
    };
  }
  return {
    system:
      "You are an AI workplace productivity assistant. Help with planning, writing, prioritising, and problem solving at work. Be concise, practical, and use Markdown. If you are unsure, say so.",
    messages: data.messages,
  };
}

export const runAi = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AiInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured for this project.");

    const gateway = createLovableAiGatewayProvider(key);
    const { system, messages } = buildPrompt(data);

    try {
      const result = streamText({
        model: gateway(AI_MODEL),
        system,
        messages,
      });
      const text = await result.text;
      return { text };
    } catch (error) {
      const status = (error as { statusCode?: number; status?: number })?.statusCode ??
        (error as { status?: number })?.status;
      if (status === 429) {
        throw new Error("The AI service is rate limited right now. Please try again in a moment.");
      }
      if (status === 402) {
        throw new Error("AI credits are exhausted. Please add credits in Lovable to continue.");
      }
      if (status === 403) {
        throw new Error("AI access is currently blocked for this workspace.");
      }
      throw new Error(
        error instanceof Error ? error.message : "The AI request failed. Please try again.",
      );
    }
  });
