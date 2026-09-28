import { describe, expect, it } from "vitest";
import { tableViewToCsv } from "./csv";

describe("tableViewToCsv", () => {
  it("writes headers, rounded numbers and footers", () => {
    const csv = tableViewToCsv({
      id: "t",
      label: "T",
      columns: [
        { key: "item", label: "Item" },
        { key: "amount", label: "Amount, USD", format: "currency" },
      ],
      rows: [{ item: "Interest", amount: 1234.5678 }],
      footer: { item: "Total", amount: 1234.5678 },
    });
    expect(csv).toBe('Item,"Amount, USD"\nInterest,1234.57\nTotal,1234.57');
  });

  it("neutralizes spreadsheet formula injection", () => {
    const csv = tableViewToCsv({ id: "t", label: "T", columns: [{ key: "a", label: "A" }], rows: [{ a: "=HYPERLINK(1)" }] });
    expect(csv.split("\n")[1]).toBe("'=HYPERLINK(1)");
  });
});
