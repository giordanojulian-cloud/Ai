// @vitest-environment jsdom
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import mortgage from "@/calculators/definitions/mortgage/definition";
import tip from "@/calculators/definitions/tip/definition";
import { CalculatorEngine } from "./calculator-engine";

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));

const features = { save: false, ai: false };

beforeEach(() => {
  window.history.replaceState(null, "", "/calculator/test");
});

describe("CalculatorEngine", () => {
  it("renders labeled inputs and the default result", () => {
    render(<CalculatorEngine definition={mortgage} name="Mortgage Calculator" features={features} />);
    expect(screen.getByLabelText("Home price")).toHaveValue("400,000");
    expect(screen.getByTestId("primary-result")).toHaveTextContent("$2,539.28");
  });

  it("recalculates as the user types, replacing selected text", async () => {
    const user = userEvent.setup();
    render(<CalculatorEngine definition={tip} name="Tip Calculator" features={features} />);
    const people = screen.getByLabelText("Split between");
    await user.tripleClick(people);
    await user.keyboard("1");
    expect(people).toHaveValue("1");
    expect(screen.getByTestId("primary-result")).toHaveTextContent("$107.53");
  });

  it("associates validation errors with the input", async () => {
    render(<CalculatorEngine definition={mortgage} name="Mortgage Calculator" features={features} />);
    const rate = screen.getByLabelText("Interest rate");
    fireEvent.change(rate, { target: { value: "99" } });
    expect(rate).toHaveAttribute("aria-invalid", "true");
    const errorId = rate.getAttribute("aria-describedby")!;
    expect(document.getElementById(errorId)).toHaveTextContent(/between/);
    expect(screen.getByText("Fix the highlighted inputs to update your results.")).toBeInTheDocument();
  });

  it("flags unparseable input", () => {
    render(<CalculatorEngine definition={mortgage} name="Mortgage Calculator" features={features} />);
    const price = screen.getByLabelText("Home price");
    fireEvent.change(price, { target: { value: "abc" } });
    expect(price).toHaveAttribute("aria-invalid", "true");
  });

  it("converts the down payment when switching between % and $", async () => {
    const user = userEvent.setup();
    render(<CalculatorEngine definition={mortgage} name="Mortgage Calculator" features={features} />);
    const group = screen.getByRole("group", { name: "Down payment unit" });
    await user.click(within(group).getByRole("button", { name: /Dollar amount/ }));
    expect(screen.getByLabelText("Down payment")).toHaveValue("80,000");
    expect(screen.getByTestId("primary-result")).toHaveTextContent("$2,539.28");
  });

  it("applies values from a shared link", () => {
    window.history.replaceState(null, "", "/calculator/tip?subtotal=100&tax=0&tip=20&people=4&round=0");
    render(<CalculatorEngine definition={tip} name="Tip Calculator" features={features} />);
    expect(screen.getByTestId("primary-result")).toHaveTextContent("$30.00");
  });

  it("hides save and AI actions unless enabled", () => {
    render(<CalculatorEngine definition={tip} name="Tip Calculator" features={features} />);
    expect(screen.queryByRole("button", { name: /Save/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Explain my result/ })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Copy link/ })).toBeInTheDocument();
  });
});
