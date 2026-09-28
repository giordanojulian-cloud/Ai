import type { ContentBlock } from "@/calculators/types";

/** Renders structured plain-text content. No HTML injection is possible by design. */
export function ContentBlocks({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div className="prose-content">
      {blocks.map((block, index) => {
        if (typeof block === "string") return <p key={index}>{block}</p>;
        if ("list" in block)
          return (
            <ul key={index}>
              {block.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        return (
          <ol key={index}>
            {block.steps.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        );
      })}
    </div>
  );
}
