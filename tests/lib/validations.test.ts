import { describe, expect, it } from "vitest";
import { loginSchema, signupSchema } from "@/lib/validations";

describe("auth validation schemas", () => {
  it("accepts valid credentials and rejects invalid credentials", () => {
    expect(loginSchema.safeParse({ email: "user@example.com", password: "secret1" }).success).toBe(true);
    expect(loginSchema.safeParse({ email: "bad", password: "123" }).success).toBe(false);
  });

  it("requires matching signup passwords", () => {
    expect(signupSchema.safeParse({
      email: "user@example.com",
      password: "secret1",
      confirmPassword: "secret2",
    }).success).toBe(false);
  });
});
