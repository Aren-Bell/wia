"use client";

import React from "react";
import { theme } from "@/app/config";
import Button from "@/app/components/small/Button";
import AuthorMetadata from "@/app/components/medium/AuthorMetadata";

export type ClosedThreadType = "government" | "internal";

export interface ClosedThreadProps {
  /**
   * "government" -> Centang Hijau (Aparat Berwenang / Pemerintah Daerah)
   * "internal"   -> Centang Merah (Tim Internal Dev)
   */
  type: ClosedThreadType;
  resolverName?: string;
  resolverAvatarSrc?: string;
  onViewResponse?: () => void;
}

export default function ClosedThread({
  type,
  resolverName,
  resolverAvatarSrc,
  onViewResponse,
}: ClosedThreadProps) {
  const defaultName =
    type === "government"
      ? "Pemerintah Daerah Kalimantan Utara"
      : "Zaky The Flymost";

  return (
    <div
      style={{
        backgroundColor: theme.colors.background.input,
        minHeight: "48px",
        borderRadius: theme.radius.md,
        padding: `${theme.spacing.xs} ${theme.spacing.lg}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: theme.spacing.xs,
        width: "100%",
        boxSizing: "border-box",
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: theme.spacing.xxs,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.size.xs,
            fontWeight: theme.typography.weight.regular,
            color: theme.colors.text.body,
            whiteSpace: "nowrap",
          }}
        >
          This thread has been closed by
        </span>

        <AuthorMetadata
          mode="closed"
          authorName={resolverName || defaultName}
          avatarSrc={resolverAvatarSrc}
          resolverBadgeType={type}
        />
      </div>

      <Button variant="primary" onClick={onViewResponse}>
        View Response
      </Button>
    </div>
  );
}
