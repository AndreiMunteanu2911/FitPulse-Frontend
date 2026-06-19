import { describe, expect, it } from "vitest";
import { REST_DURATIONS, detectExerciseType } from "@/lib/rest-timer";

describe("rest timer helpers", () => {
  it("detects compound exercises from muscles or body parts", () => {
    expect(detectExerciseType({ target_muscles: ["Chest"] })).toBe("compound");
    expect(detectExerciseType({ body_parts: ["Upper Legs"] })).toBe("compound");
    expect(detectExerciseType({ target_muscles: ["Biceps"] })).toBe("isolation");
    expect(REST_DURATIONS.compound).toBeGreaterThan(REST_DURATIONS.isolation);
  });
});
