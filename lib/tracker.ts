export const trackerStatuses = [
  "NOT_STARTED",
  "DISCOVERY",
  "PLANNED",
  "IN_PROGRESS",
  "BLOCKED",
  "IN_REVIEW",
  "VALIDATING",
  "DONE",
  "DEFERRED",
] as const;

export const trackerCheckpoints = ["SCOPE", "BUILD", "VALIDATE", "REVIEW", "DONE"] as const;

export type TrackerStatus = (typeof trackerStatuses)[number];
export type TrackerCheckpoint = (typeof trackerCheckpoints)[number];

export type TrackerFeature = {
  id: string;
  sprintId: string;
  phaseId: string;
  title: string;
  priority: string;
  status: TrackerStatus;
  progress: number;
  checkpoint: TrackerCheckpoint;
  owner: string;
  evidence: string;
  risk: string;
  dependencies: string;
};

export type TrackerPhase = {
  id: string;
  title: string;
  status: TrackerStatus;
  exitCriteria: string;
  features: TrackerFeature[];
  progress: number;
};

export type TrackerSprint = {
  id: string;
  title: string;
  goal: string;
  status: TrackerStatus;
  phases: TrackerPhase[];
  progress: number;
};

export type ProductTracker = {
  lastUpdated: string;
  overallProgress: number;
  sprints: TrackerSprint[];
  phases: TrackerPhase[];
  features: TrackerFeature[];
};

type MarkdownRow = Record<string, string>;

function splitRow(line: string): string[] {
  return line.trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim());
}

function tableAfter(markdown: string, heading: string): MarkdownRow[] {
  const lines = markdown.split(/\r?\n/);
  const headingIndex = lines.findIndex((line) => line.trim() === heading);
  if (headingIndex < 0) throw new Error(`Tracker is missing ${heading}`);

  const headerIndex = lines.findIndex((line, index) => index > headingIndex && line.trim().startsWith("|"));
  if (headerIndex < 0 || !lines[headerIndex + 1]?.includes("---")) {
    throw new Error(`Tracker table under ${heading} is malformed`);
  }

  const headers = splitRow(lines[headerIndex]);
  const rows: MarkdownRow[] = [];
  for (let index = headerIndex + 2; index < lines.length && lines[index].trim().startsWith("|"); index += 1) {
    const cells = splitRow(lines[index]);
    if (cells.length !== headers.length) throw new Error(`Tracker row under ${heading} has ${cells.length} cells; expected ${headers.length}`);
    rows.push(Object.fromEntries(headers.map((header, cellIndex) => [header, cells[cellIndex]])));
  }
  return rows;
}

function requireStatus(value: string, context: string): TrackerStatus {
  if (!trackerStatuses.includes(value as TrackerStatus)) throw new Error(`${context} has invalid status ${value}`);
  return value as TrackerStatus;
}

function requireCheckpoint(value: string, context: string): TrackerCheckpoint {
  if (!trackerCheckpoints.includes(value as TrackerCheckpoint)) throw new Error(`${context} has invalid checkpoint ${value}`);
  return value as TrackerCheckpoint;
}

function requireProgress(value: string, context: string): number {
  const progress = Number(value.replace("%", ""));
  if (!Number.isFinite(progress) || progress < 0 || progress > 100) throw new Error(`${context} has invalid progress ${value}`);
  return progress;
}

function average(values: number[]): number {
  return values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;
}

export function parseProductTracker(markdown: string): ProductTracker {
  const summaryRows = tableAfter(markdown, "## Program summary");
  const phaseRows = tableAfter(markdown, "## Phase tracker");
  const sprintRows = tableAfter(markdown, "### Sprint register");
  const featureRows = tableAfter(markdown, "### Feature progress register");

  const features: TrackerFeature[] = featureRows.map((row) => ({
    id: row.ID,
    sprintId: row.Sprint,
    phaseId: row.Phase,
    title: row.Feature,
    priority: row.Priority,
    status: requireStatus(row.Status, row.ID),
    progress: requireProgress(row.Progress, row.ID),
    checkpoint: requireCheckpoint(row.Checkpoint, row.ID),
    owner: row.Owner,
    evidence: row["Acceptance / evidence"],
    risk: row.Risk,
    dependencies: row.Dependencies,
  }));

  const featureIds = new Set<string>();
  for (const feature of features) {
    if (!feature.id || featureIds.has(feature.id)) throw new Error(`Tracker feature ID is missing or duplicated: ${feature.id}`);
    featureIds.add(feature.id);
  }

  const phases: TrackerPhase[] = phaseRows.map((row) => {
    const phaseFeatures = features.filter((feature) => feature.phaseId === row.ID);
    return {
      id: row.ID,
      title: row.Phase,
      status: requireStatus(row.Status, row.ID),
      exitCriteria: row["Exit criteria"],
      features: phaseFeatures,
      progress: average(phaseFeatures.map((feature) => feature.progress)),
    };
  });

  const phaseIds = new Set(phases.map((phase) => phase.id));
  const sprints: TrackerSprint[] = sprintRows.map((row) => {
    const requestedPhaseIds = row.Phases.split(",").map((value) => value.trim());
    const sprintPhases = requestedPhaseIds.map((phaseId) => {
      const phase = phases.find((candidate) => candidate.id === phaseId);
      if (!phase) throw new Error(`${row.ID} references unknown phase ${phaseId}`);
      return phase;
    });
    return {
      id: row.ID,
      title: row.Sprint,
      goal: row.Goal,
      status: requireStatus(row.Status, row.ID),
      phases: sprintPhases,
      progress: average(sprintPhases.flatMap((phase) => phase.features.map((feature) => feature.progress))),
    };
  });

  const sprintIds = new Set(sprints.map((sprint) => sprint.id));
  for (const feature of features) {
    if (!phaseIds.has(feature.phaseId)) throw new Error(`${feature.id} references unknown phase ${feature.phaseId}`);
    if (!sprintIds.has(feature.sprintId)) throw new Error(`${feature.id} references unknown sprint ${feature.sprintId}`);
    const sprint = sprints.find((candidate) => candidate.id === feature.sprintId);
    if (!sprint?.phases.some((phase) => phase.id === feature.phaseId)) {
      throw new Error(`${feature.id} maps ${feature.phaseId} outside ${feature.sprintId}`);
    }
  }

  const lastUpdated = summaryRows.find((row) => row.Field === "Last updated")?.Value;
  if (!lastUpdated) throw new Error("Tracker program summary is missing Last updated");

  return {
    lastUpdated,
    overallProgress: average(features.map((feature) => feature.progress)),
    sprints,
    phases,
    features,
  };
}

