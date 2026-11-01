import React from "react";
import { theme, getTagColor } from "@/app/config";

export interface TagPillProps {
  label: string;
  onClick?: (label: string) => void;
}

export default function TagPill({ label, onClick }: TagPillProps) {
  // Setiap nama tag yang sama otomatis mendapat warna yang sama
  const tagTextColor = getTagColor(label);

  return (
    <span
      onClick={() => onClick?.(label)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: `${theme.spacing.xxs} ${theme.spacing.xs}`,
        borderRadius: theme.radius.sm,
        border: `1px solid ${theme.colors.border.tag}`,
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.size.xs,
        fontWeight: theme.typography.weight.regular,
        color: tagTextColor,
        lineHeight: "normal",
        whiteSpace: "nowrap",
        cursor: onClick ? "pointer" : "default",
        userSelect: "none",
      }}
    >
      {label}
    </span>
  );
}
