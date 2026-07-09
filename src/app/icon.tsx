import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0B",
          borderRadius: 14,
        }}
      >
        <svg width="44" height="44" viewBox="0 0 120 120" fill="none">
          <path
            d="M20 100 L20 18 L98 100 L98 84 L34 18"
            stroke="#C9A227"
            strokeWidth="12"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
          <path d="M98 18 L98 100" stroke="#C9A227" strokeWidth="12" strokeLinecap="square" />
          <path d="M64 100 L64 62" stroke="#C9A227" strokeWidth="12" strokeLinecap="square" />
          <path d="M81 100 L81 46" stroke="#C9A227" strokeWidth="12" strokeLinecap="square" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
