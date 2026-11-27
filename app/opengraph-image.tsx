import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Qualilan: infraestrutura de rede, segurança eletrônica e conectividade";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Imagem que aparece quando o link do site é compartilhado (WhatsApp, LinkedIn).
export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), "public/brand/logo-branco.png"));
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 90, background: "#121744", color: "white" }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse só aceita <img> */}
        <img src={`data:image/png;base64,${logo.toString("base64")}`} width={460} height={159} alt="" />
        <div style={{ marginTop: 50, fontSize: 54, fontWeight: 700, lineHeight: 1.15, maxWidth: 950 }}>
          Infraestrutura de rede, segurança eletrônica e conectividade com pronta entrega.
        </div>
        <div style={{ marginTop: 36, width: 120, height: 6, background: "#FF9900" }} />
      </div>
    ),
    size,
  );
}
