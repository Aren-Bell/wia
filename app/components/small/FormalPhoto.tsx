import React from "react";
import { theme } from "@/app/config";

export type FormalPhotoSize = "sm" | "md" | "lg";

export interface FormalPhotoProps {
  src?: string;
  alt?: string;
  size?: FormalPhotoSize;
  initials?: string;
  accentColor?: string;
}

export default function FormalPhoto({
  src,
  alt = "Crew member photo",
  size = "md",
  initials,
  accentColor = theme.colors.brand.primary,
}: FormalPhotoProps) {
  const pixelSize = theme.sizes.formalPhoto[size];

  return (
    <div
      style={{
        width: `${pixelSize}px`,
        height: `${pixelSize}px`,
        borderRadius: theme.radius.sm,
        border: `1px solid ${theme.colors.border.divider}`,
        backgroundColor: theme.colors.background.avatarPlaceholder,
        overflow: "hidden",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
      }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : initials ? (
        <svg
          viewBox="0 0 64 64"
          style={{ width: "100%", height: "100%", display: "block" }}
          aria-hidden="true"
        >
          <rect width="64" height="64" fill={theme.colors.background.input} />
          <circle cx="52" cy="12" r="24" fill={accentColor} opacity="0.12" />
          <circle cx="12" cy="56" r="20" fill={accentColor} opacity="0.18" />
          <text
            x="32"
            y="37"
            textAnchor="middle"
            fill={theme.colors.text.primary}
            fontSize="18"
            fontWeight="800"
            fontFamily={theme.typography.fontFamily}
          >
            {initials}
          </text>
        </svg>
      ) : null}
    </div>
  );
}
