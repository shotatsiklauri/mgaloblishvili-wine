import { ImageResponse } from "next/og";

export const alt = "Mgaloblishvili — Georgian wine estate";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#05090a",
          color: "#f4f4f4",
        }}
      >
        <div
          style={{
            width: 72,
            height: 1,
            backgroundColor: "#c9a96e",
            marginBottom: 48,
          }}
        />
        <div style={{ fontSize: 78, letterSpacing: 14, fontWeight: 600 }}>
          MGALOBLISHVILI
        </div>
        <div
          style={{
            fontSize: 26,
            letterSpacing: 6,
            color: "#c9a96e",
            marginTop: 28,
          }}
        >
          WINE ESTATE · PRODUCT OF GEORGIA
        </div>
      </div>
    ),
    { ...size },
  );
}
