import { z } from "zod";
import { feedCandidateSchema } from "./geography.ts";

const storySourceSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["public-record", "local-reporting", "specialist-analysis", "official-statement"]),
  geography: z.string().min(1),
  note: z.string().min(1),
}).strict();

export const demoStorySchema = feedCandidateSchema.extend({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  geographyLabel: z.string().min(1),
  category: z.string().min(1),
  headline: z.string().min(1),
  summary: z.string().min(1),
  whyItMatters: z.string().min(1),
  uncertainty: z.string().min(1),
  sourceCount: z.number().int().positive(),
  readingMinutes: z.number().int().positive(),
  updatedLabel: z.string().min(1),
  accent: z.enum(["gold", "violet", "green", "blue"]),
  keyPoints: z.array(z.string().min(1)).min(2).max(5),
  timeline: z.array(z.object({ label: z.string().min(1), detail: z.string().min(1) }).strict()).min(2).max(5),
  sources: z.array(storySourceSchema).min(1),
}).strict().superRefine((story, context) => {
  if (story.sources.length !== story.sourceCount) {
    context.addIssue({ code: "custom", message: "Source count must match the fictional source register", path: ["sourceCount"] });
  }
});

export type DemoStory = z.infer<typeof demoStorySchema>;

const source = (name: string, type: z.infer<typeof storySourceSchema>["type"], geography: string, note: string) => ({ name, type, geography, note });

export const demoStories: DemoStory[] = z.array(demoStorySchema).parse([
  {
    id: "heat-services", slug: "cities-prepare-public-services-for-heat", countryCodes: ["US", "CA"], regionIds: ["northern-america"], subjectIds: ["public-policy", "climate"],
    geographyLabel: "Northern America", category: "Public policy", headline: "How cities are preparing public services for longer heat seasons", summary: "A multi-source demo briefing comparing adaptation plans, funding questions, and local trade-offs.", whyItMatters: "Longer heat seasons can strain transit, health, energy, and public-space systems at the same time, making coordination and equitable access central planning questions.", uncertainty: "Plans and funding remain preliminary; this demo does not predict local outcomes.", sourceCount: 3, readingMinutes: 6, updatedLabel: "Updated 2 hours ago", accent: "gold",
    keyPoints: ["Agencies are testing shared heat-response thresholds.", "Funding timelines differ across participating cities.", "Access for outdoor workers and vulnerable residents remains a review priority."],
    timeline: [{ label: "Planning stage", detail: "Departments publish fictional resilience priorities." }, { label: "Current review", detail: "Cross-agency capacity and funding assumptions are compared." }, { label: "What to watch", detail: "Public consultation and budget decisions would determine implementation." }],
    sources: [source("Metro planning record", "public-record", "United States", "Fictional public planning record."), source("Civic services desk", "local-reporting", "Canada", "Fictional local reporting summary."), source("Urban resilience review", "specialist-analysis", "Regional", "Fictional specialist context; not a live publication.")],
  },
  {
    id: "language-ai", slug: "small-language-ai-investment", countryCodes: ["TG", "GH"], regionIds: ["west-africa"], subjectIds: ["technology", "culture"],
    geographyLabel: "West Africa", category: "Technology", headline: "Small-language AI tools gain new investment and research attention", summary: "What emerging tools could mean for access, preservation, and responsible deployment.", whyItMatters: "Language technology can widen digital access, but small datasets, consent, dialect variation, and community governance materially affect quality and trust.", uncertainty: "Capabilities, datasets, and deployment commitments are fictional and require independent verification.", sourceCount: 3, readingMinutes: 5, updatedLabel: "Updated 4 hours ago", accent: "violet",
    keyPoints: ["Researchers are testing community-informed data practices.", "Evaluation must account for dialect and code-switching.", "Commercial interest does not establish product quality or consent."],
    timeline: [{ label: "Research interest", detail: "Fictional research groups outline evaluation needs." }, { label: "Community review", detail: "Consent and language stewardship questions are raised." }, { label: "What to watch", detail: "Transparent datasets and locally meaningful benchmarks." }],
    sources: [source("Language research note", "specialist-analysis", "Togo", "Fictional research context."), source("Digital access desk", "local-reporting", "Ghana", "Fictional local reporting summary."), source("Community technology statement", "official-statement", "Regional", "Fictional statement for interface testing.")],
  },
  {
    id: "care-capacity", slug: "regional-care-capacity-planning", countryCodes: ["JP"], regionIds: ["eastern-asia"], subjectIds: ["health"],
    geographyLabel: "Japan", category: "Health", headline: "Regional care networks test shared capacity planning", summary: "A fictional overview of operational questions being evaluated across several care networks.", whyItMatters: "Shared capacity planning may help coordinate staffing and specialist access, but privacy, accountability, and local needs require careful governance.", uncertainty: "No clinical result or operational rollout is claimed; all metrics and organizations are fictional.", sourceCount: 2, readingMinutes: 4, updatedLabel: "Updated 6 hours ago", accent: "green",
    keyPoints: ["The demo model separates capacity signals from patient records.", "Local governance remains responsible for escalation decisions."],
    timeline: [{ label: "Prototype", detail: "Fictional networks define non-patient capacity indicators." }, { label: "Review", detail: "Privacy and accountability controls are assessed." }, { label: "What to watch", detail: "Whether local operators approve a limited pilot." }],
    sources: [source("Regional health planning note", "public-record", "Japan", "Fictional administrative record."), source("Care operations review", "specialist-analysis", "Japan", "Fictional specialist analysis.")],
  },
  {
    id: "trade-corridors", slug: "trade-corridors-weather-delays", countryCodes: ["AU", "NZ"], regionIds: ["australia-new-zealand"], subjectIds: ["economy", "transportation"],
    geographyLabel: "Australia & New Zealand", category: "Economy", headline: "Transport planners compare options after recurring weather delays", summary: "A demo comparison of resilience proposals, cost questions, and supply-chain trade-offs.", whyItMatters: "Repeated delays can affect food, medicine, and business continuity across connected communities.", uncertainty: "The proposals and effects are illustrative; no forecast or investment recommendation is provided.", sourceCount: 2, readingMinutes: 4, updatedLabel: "Updated yesterday", accent: "blue",
    keyPoints: ["Proposals balance redundancy against long-term cost.", "Local access and essential goods receive explicit consideration."],
    timeline: [{ label: "Options published", detail: "Fictional planners outline resilience alternatives." }, { label: "Current review", detail: "Cost and community-access assumptions are compared." }, { label: "What to watch", detail: "Public feedback and environmental assessment." }],
    sources: [source("Transport options paper", "public-record", "Australia", "Fictional public record."), source("Regional logistics desk", "local-reporting", "New Zealand", "Fictional reporting summary.")],
  },
]);

export function getDemoStory(slug: string): DemoStory | undefined {
  return demoStories.find((story) => story.slug === slug);
}
