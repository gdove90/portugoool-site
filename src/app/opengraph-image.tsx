import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";
export const runtime = "nodejs";
export const alt = "GOAL Athletics. Move with Purpose.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  const logo = readFileSync(join(process.cwd(), "public/brand/goal-athletics-horizontal-lockup-white.svg"));
  return new ImageResponse(<div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#0b0b0b",color:"white"}}><img src={`data:image/svg+xml;base64,${logo.toString("base64")}`} alt="GOAL Athletics" width={920} height={200}/><div style={{display:"flex",fontSize:26,letterSpacing:6,marginTop:60}}>MOVE WITH PURPOSE.</div></div>,size);
}
