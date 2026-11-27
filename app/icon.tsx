import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Símbolo "Q" da marca em branco sobre o Azul Profundo.
export default async function Icon() {
  const q = await readFile(join(process.cwd(), "public/brand/q-branco.png"));
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#121744", borderRadius: 14 }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse só aceita <img> */}
        <img src={`data:image/png;base64,${q.toString("base64")}`} width={44} height={45} alt="" />
      </div>
    ),
    size,
  );
}
