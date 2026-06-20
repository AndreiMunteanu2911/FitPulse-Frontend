import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import type {
  ExerciseFormRules,
  FormMetricSample,
  FormRepMetric,
  FormSessionFeedbackItem,
} from "@/types";
import { categorizeFeedback } from "@/lib/form-analysis";
import { getLandmarkVisibility, type CameraViewStatus } from "@/lib/form-geometry";
import type { ResolvedExerciseFormRules, ResolvedFormRule } from "@/lib/form-rules";

export type TrackingQuality = "good" | "limited" | "lost";

/** Filters angular velocity so pauses and one-frame reversals do not flip movement phase. */
export class MovementPhaseTracker {
  private lastAngle: number | null = null;
  private lastTimestampMs: number | null = null;
  private filteredVelocity = 0;
  private phase: FormMetricSample["phase"] = "unknown";

  update(
    angle: number,
    timestampMs: number,
    phaseLogic: ExerciseFormRules["primaryMetric"]["phaseLogic"] = "flexion_extension",
  ): FormMetricSample["phase"] {
    if (this.lastAngle === null || this.lastTimestampMs === null) {
      this.lastAngle = angle;
      this.lastTimestampMs = timestampMs;
      return "unknown";
    }
    const seconds = Math.max(0.016, (timestampMs - this.lastTimestampMs) / 1000);
    const rawVelocity = (angle - this.lastAngle) / seconds;
    this.filteredVelocity = (rawVelocity * 0.32) + (this.filteredVelocity * 0.68);
    this.lastAngle = angle;
    this.lastTimestampMs = timestampMs;
    if (Math.abs(this.filteredVelocity) < 10) return this.phase;
    const towardMin = phaseLogic === "flexion_extension" || phaseLogic === "cyclic"
      ? this.filteredVelocity < 0
      : phaseLogic === "extension_flexion"
        ? this.filteredVelocity > 0
        : this.filteredVelocity < 0;
    this.phase = towardMin ? "eccentric" : "concentric";
    return this.phase;
  }

  reset(): void {
    this.lastAngle = null;
    this.lastTimestampMs = null;
    this.filteredVelocity = 0;
    this.phase = "unknown";
  }
}

export function getRepWindow(
  resolvedRules: ResolvedExerciseFormRules | null,
): Pick<ResolvedFormRule, "min" | "max" | "visibilityThreshold"> | null {
  if (!resolvedRules || resolvedRules.rules.length === 0) return null;
  const primaryLandmarks = resolvedRules.primaryMetric.landmarks.join(",");
  const angleRules = resolvedRules.rules.filter((rule) => (rule.kind ?? "angle") === "angle" && rule.landmarks.length >= 3);
  const primaryRules = angleRules.filter((rule) => rule.landmarks.join(",") === primaryLandmarks);
  const rules = primaryRules.length > 0 ? primaryRules : angleRules;
  if (rules.length === 0) return null;

  return {
    min: Math.min(...rules.map((rule) => rule.min)),
    max: Math.max(...rules.map((rule) => rule.max)),
    visibilityThreshold: Math.min(...rules.map((rule) => rule.visibilityThreshold)),
  };
}

export function getEffectiveRepWindow(
  repWindow: Pick<ResolvedFormRule, "min" | "max" | "visibilityThreshold"> | null,
  observedRange: { min: number; max: number },
): Pick<ResolvedFormRule, "min" | "max" | "visibilityThreshold"> | null {
  if (!repWindow || !Number.isFinite(observedRange.min) || !Number.isFinite(observedRange.max)) return repWindow;
  const span = observedRange.max - observedRange.min;
  if (span < 24) return repWindow;
  const min = Math.max(repWindow.min, Math.round(observedRange.min + (span * 0.2)));
  const max = Math.min(repWindow.max, Math.round(observedRange.max - (span * 0.2)));
  return min < max ? { min, max, visibilityThreshold: repWindow.visibilityThreshold } : repWindow;
}

export function getRepCountingWindow(
  repWindow: Pick<ResolvedFormRule, "min" | "max" | "visibilityThreshold"> | null,
  observedRange: { min: number; max: number },
  minimumRange: number,
): Pick<ResolvedFormRule, "min" | "max" | "visibilityThreshold"> | null {
  if (!repWindow || !Number.isFinite(observedRange.min) || !Number.isFinite(observedRange.max)) return repWindow;
  const span = observedRange.max - observedRange.min;
  if (span < minimumRange) return repWindow;
  return {
    min: Math.round(observedRange.min + (span * 0.18)),
    max: Math.round(observedRange.max - (span * 0.18)),
    visibilityThreshold: Math.min(repWindow.visibilityThreshold, 0.42),
  };
}

export function getTrackingQuality(params: {
  angleStatus: CameraViewStatus;
  requiredVisibility: number;
  calibrationVariance: number;
  primaryTrackingLost: boolean;
}): TrackingQuality {
  if (params.primaryTrackingLost || params.requiredVisibility < 0.35) return "lost";
  if (params.angleStatus !== "good" || params.requiredVisibility < 0.6 || params.calibrationVariance > 0.012) return "limited";
  return "good";
}

export function dedupeFeedback<T extends FormSessionFeedbackItem>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.type}:${item.message}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function getRunningRepAverage(repMetrics: FormRepMetric[]): number {
  if (repMetrics.length === 0) return 0;
  return Math.round(repMetrics.reduce((sum, rep) => sum + rep.score, 0) / repMetrics.length);
}

function getFeedbackSeverityRank(type: FormSessionFeedbackItem["type"]): number {
  if (type === "error") return 3;
  if (type === "warning") return 2;
  return 1;
}

export function getAdjustedRunningScore(rawScore: number, activeFeedback: FormSessionFeedbackItem[]): number {
  if (rawScore <= 0) return 0;
  const grouped = new Map<string, FormSessionFeedbackItem>();
  for (const item of activeFeedback) {
    if (item.effect === "cue_only" || item.effect === "rep_gate") continue;
    const category = item.category ?? categorizeFeedback(item);
    const existing = grouped.get(category);
    if (!existing || getFeedbackSeverityRank(item.type) > getFeedbackSeverityRank(existing.type)) grouped.set(category, item);
  }
  const penalty = Array.from(grouped.values()).reduce((sum, item) => {
    const confidence = item.confidence ?? 1;
    const multiplier = confidence >= 0.75 ? 1 : confidence >= 0.55 ? 0.6 : 0.25;
    return sum + Math.round((item.type === "error" ? 16 : item.type === "warning" ? 7 : 0) * multiplier);
  }, 0);
  return Math.max(0, rawScore - Math.min(30, penalty));
}

export function isNearPhaseEndpoint(params: {
  phase: "eccentric" | "concentric" | "unknown";
  phaseLogic?: ExerciseFormRules["primaryMetric"]["phaseLogic"];
  angle: number;
  repWindow: Pick<ResolvedFormRule, "min" | "max" | "visibilityThreshold"> | null;
  confidence: number;
}): boolean {
  if (params.phase === "unknown" || params.angle < 0 || !params.repWindow) return false;
  const logic = params.phaseLogic ?? "flexion_extension";
  const movingTowardMin = logic === "flexion_extension" || logic === "cyclic"
    ? params.phase === "eccentric"
    : logic === "extension_flexion"
      ? params.phase === "concentric"
      : params.phase === "eccentric";
  const target = movingTowardMin ? params.repWindow.min : params.repWindow.max;
  return Math.abs(params.angle - target) <= (params.confidence < 0.72 ? 16 : 12);
}

export function enrichFeedbackConfidence<T extends FormSessionFeedbackItem>(items: T[], landmarks: NormalizedLandmark[]): T[] {
  return items.map((item) => ({
    ...item,
    category: item.category ?? categorizeFeedback(item),
    confidence: item.confidence ?? (item.landmarkIndices?.length
      ? getLandmarkVisibility(landmarks, item.landmarkIndices)
      : 1),
  }));
}

interface AccumulatedFeedback {
  item: FormSessionFeedbackItem;
  frames: number;
  firstMs: number;
  lastMs: number;
}

/** Records how persistent each cue was during a rep instead of treating one bad frame as a full-rep fault. */
export class RepFeedbackAccumulator {
  private observations = new Map<string, AccumulatedFeedback>();
  private totalFrames = 0;

  addFrame(items: FormSessionFeedbackItem[], timestampMs: number): void {
    this.totalFrames += 1;
    for (const item of dedupeFeedback(items)) {
      const key = `${item.ruleId ?? item.category ?? item.source}:${item.message}`;
      const current = this.observations.get(key);
      if (current) {
        current.frames += 1;
        current.lastMs = timestampMs;
        if (getFeedbackSeverityRank(item.type) > getFeedbackSeverityRank(current.item.type)) current.item = item;
      } else {
        this.observations.set(key, { item, frames: 1, firstMs: timestampMs, lastMs: timestampMs });
      }
    }
  }

  snapshot(): FormSessionFeedbackItem[] {
    return Array.from(this.observations.values()).map(({ item, frames, firstMs, lastMs }) => ({
      ...item,
      occurrenceRate: this.totalFrames > 0 ? frames / this.totalFrames : 0,
      activeDurationMs: Math.max(0, lastMs - firstMs),
    }));
  }

  reset(): void {
    this.observations.clear();
    this.totalFrames = 0;
  }
}
