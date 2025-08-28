import { google } from "@ai-sdk/google";
import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";

export const supportAgent = new Agent(components.agent, {
  name: "viora-ai-agent",
  languageModel: google("gemini-2.5-pro"),
  instructions: "Anda adalah agen dukungan pelanggan",
});
