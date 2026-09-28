import { describe, expect, it } from "vitest";
import { percentage } from "./logic";

describe("percentage", () => {
  it("solves each documented example", () => {
    expect(percentage("of", 15, 200)?.value).toBe(30);
    expect(percentage("is-what-percent", 30, 200)?.value).toBe(15);
    expect(percentage("change", 50, 65)?.value).toBe(30);
    expect(percentage("adjust", -15, 200)?.value).toBe(170);
  });

  it("reports decreases as negative change", () => {
    expect(percentage("change", 100, 80)?.value).toBe(-20);
    expect(percentage("change", -50, -25)?.value).toBe(50);
  });

  it("returns null for undefined results", () => {
    expect(percentage("is-what-percent", 1, 0)).toBeNull();
    expect(percentage("change", 0, 5)).toBeNull();
  });
});
