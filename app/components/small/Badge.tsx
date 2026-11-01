import React from "react";
import { CheckCheck } from "lucide-react";
import { theme } from "@/app/config";

export type BadgeType = "government" | "internal" | "solved-pill";

export interface BadgeProps {
  type: BadgeType;
}

/**
 * SVG Scalloped Verified Starburst (codicon:verified-filled)
 * Digunakan untuk centang hijau (Government/Aparat) & centang merah (Internal Dev)
 */
function VerifiedStarburstIcon({ color }: { color: string }) {
  return (
    <svg
      width={theme.sizes.icon.sm}
      height={theme.sizes.icon.sm}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, display: "block" }}
    >
      <path
        d="M8 1L9.85 2.42L12.16 2.16L12.92 4.37L15 5.45L14.36 7.7L15.36 9.81L13.56 11.33L13.25 13.65L10.92 13.91L9.4 15.71L7.29 14.71L5.04 15.35L3.96 13.27L1.75 12.51L2.01 10.2L0.59 8.35L2.39 6.83L2.13 4.52L4.34 3.76L5.42 1.68L7.67 2.32L8 1Z"
        fill={color}
      />
      <path
        d="M6.85 10.65L4.5 8.3L5.35 7.45L6.85 8.95L10.65 5.15L11.5 6L6.85 10.65Z"
        fill={theme.colors.text.inverse}
      />
    </svg>
  );
}

export default function Badge({ type }: BadgeProps) {
  if (type === "solved-pill") {
    return (
      <div
        title="Solved"
        style={{
          width: `${theme.sizes.icon.md}px`,
          height: `${theme.sizes.icon.md}px`,
          borderRadius: theme.radius.full,
          backgroundColor: theme.colors.badge.governmentPillBg,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <CheckCheck
          size={14}
          style={{ color: theme.colors.badge.government }}
        />
      </div>
    );
  }

  const badgeColor =
    type === "government"
      ? theme.colors.badge.government
      : theme.colors.badge.internal;

  return <VerifiedStarburstIcon color={badgeColor} />;
}
