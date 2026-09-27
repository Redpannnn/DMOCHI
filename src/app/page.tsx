import { readFileSync } from "fs";
import path from "path";

export const dynamic = "force-static";

function getHtml(): string {
  try {
    const filePath = path.join(process.cwd(), "content", "dmochi.html");
    return readFileSync(filePath, "utf-8");
  } catch (err) {
    console.error("Failed to read dmochi.html:", err);
    return "<!DOCTYPE html><html><body><h1>Failed to load Dompet Mochi</h1></body></html>";
  }
}

export default function Home() {
  const html = getHtml();

  return (
    <main
      style={{
        position: "fixed",
        inset: 0,
        margin: 0,
        padding: 0,
        overflow: "hidden",
        background: "#FFFDF8",
      }}
    >
      <iframe
        srcDoc={html}
        title="Dompet Mochi"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          margin: 0,
          padding: 0,
          display: "block",
        }}
      />
    </main>
  );
}
