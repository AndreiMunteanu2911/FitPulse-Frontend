import type { ExerciseType } from "@/types";

const COMPOUND_MUSCLES = new Set([
  "back",
  "chest",
  "upper legs",
  "lower legs",
  "waist",
  "quads",
  "hamstrings",
  "glutes",
  "spine",
]);

const COMPOUND_BODY_PARTS = new Set(["back", "chest", "upper legs", "lower legs"]);

export function detectExerciseType(exercise: {
  target_muscles?: string[] | null;
  body_parts?: string[] | null;
}): ExerciseType {
  const muscles = (exercise.target_muscles ?? []).map((muscle) => muscle.toLowerCase());
  const bodyParts = (exercise.body_parts ?? []).map((part) => part.toLowerCase());
  const isCompound =
    muscles.some((muscle) => COMPOUND_MUSCLES.has(muscle)) ||
    bodyParts.some((part) => COMPOUND_BODY_PARTS.has(part));

  return isCompound ? "compound" : "isolation";
}

export const REST_DURATIONS: Record<ExerciseType, number> = {
  compound: 180,
  isolation: 90,
};
