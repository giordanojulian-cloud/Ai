import { describe, expect, it, vi } from "vitest";
import { setAnalyticsProvider, track } from "./index";
import { resolveProvider } from "./providers";

describe("analytics", () => {
  it("forwards events to the active provider", () => {
    const spy = vi.fn();
    setAnalyticsProvider({ name: "test", track: spy });
    track("calculator_completed", { slug: "mortgage" });
    expect(spy).toHaveBeenCalledWith("calculator_completed", { slug: "mortgage" });
  });

  it("never throws when a provider fails", () => {
    setAnalyticsProvider({
      name: "broken",
      track: () => {
        throw new Error("boom");
      },
    });
    expect(() => track("calculator_view", { slug: "roi" })).not.toThrow();
  });

  it("falls back to a no-op provider", () => {
    expect(resolveProvider(undefined).name).toBe("none");
    expect(resolveProvider("plausible").name).toBe("plausible");
  });
});
