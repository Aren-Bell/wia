"use client";

import React from "react";
import { MapPin, ChevronDown, EllipsisVertical } from "lucide-react";
import { theme } from "@/app/config";
import Avatar from "@/app/components/small/Avatar";
import Badge from "@/app/components/small/Badge";
import Button from "@/app/components/small/Button";

export type AuthorMetadataMode = "post" | "comment" | "create" | "closed";

export interface AuthorMetadataProps {
  mode?: AuthorMetadataMode;
  authorName: string;
  avatarSrc?: string;
  topic?: string;
  timeAgo?: string;
  location?: string;
  isSolved?: boolean;
  resolverBadgeType?: "government" | "internal";
  selectedTopic?: string;
}

function DotSeparator({ size = 5 }: { size?: number }) {
  return (
    <span
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: theme.radius.full,
        backgroundColor: "#d9d9d9",
        display: "inline-block",
        flexShrink: 0,
      }}
    />
  );
}

export default function AuthorMetadata({
  mode = "post",
  authorName,
  avatarSrc,
  topic,
  timeAgo,
  location,
  isSolved = false,
  resolverBadgeType = "government",
  selectedTopic,
}: AuthorMetadataProps) {
  // 1. Mode: Closed Thread Resolver (20px avatar + bold name 12px + verified badge)
  if (mode === "closed") {
    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: theme.spacing.xxs,
        }}
      >
        <Avatar src={avatarSrc} alt={authorName} size="xs" />
        <span
          style={{
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.size.xs,
            fontWeight: theme.typography.weight.bold,
            color: theme.colors.text.primary,
            whiteSpace: "nowrap",
          }}
        >
          {authorName}
        </span>
        <Badge type={resolverBadgeType} />
      </div>
    );
  }

  // 2. Mode: Create Post Header (24px avatar + name + dot + *Select Topic)
  if (mode === "create") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: theme.spacing.xs,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: theme.spacing.xs,
          }}
        >
          <Avatar src={avatarSrc} alt={authorName} size="sm" />
          <span
            style={{
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.size.md,
              fontWeight: theme.typography.weight.extraBold,
              color: theme.colors.text.primary,
              whiteSpace: "nowrap",
            }}
          >
            {authorName}
          </span>
        </div>

        <DotSeparator size={5} />

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: theme.spacing.xxs,
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.size.sm,
          }}
        >
          <span style={{ color: theme.colors.text.requiredAsterisk }}>*</span>
          <span style={{ color: theme.colors.text.muted }}>
            {selectedTopic || "Select Topic"}
          </span>
          <ChevronDown size={14} color={theme.colors.text.muted} />
        </div>
      </div>
    );
  }

  // 3. Mode: Comment Header (32px avatar + name + dot + timeAgo + icon titik tiga)
  if (mode === "comment") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: theme.spacing.xs,
          width: "100%",
        }}
      >
        <Avatar src={avatarSrc} alt={authorName} size="md" />
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "space-between",
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: theme.spacing.xxs,
            }}
          >
            <span
              style={{
                fontFamily: theme.typography.fontFamily,
                fontSize: theme.typography.size.md,
                fontWeight: theme.typography.weight.extraBold,
                color: theme.colors.text.primary,
                whiteSpace: "nowrap",
              }}
            >
              {authorName}
            </span>
            {timeAgo && (
              <>
                <DotSeparator size={6} />
                <span
                  style={{
                    fontFamily: theme.typography.fontFamily,
                    fontSize: theme.typography.size.sm,
                    fontWeight: theme.typography.weight.regular,
                    color: theme.colors.text.timestamp,
                    whiteSpace: "nowrap",
                  }}
                >
                  {timeAgo}
                </span>
              </>
            )}
          </div>
          <Button variant="icon" iconSize={theme.sizes.icon.lg} aria-label="More">
            <EllipsisVertical size={20} color={theme.colors.text.primary} />
          </Button>
        </div>
      </div>
    );
  }

  // 4. Mode: Post Card Header (40px avatar + name + "in Topic" + dot + timeAgo + location + Solved + icon titik tiga)
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: `${theme.spacing.xs} ${theme.spacing.lg}`,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: theme.spacing.xs,
        }}
      >
        <Avatar src={avatarSrc} alt={authorName} size="lg" />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
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
                fontSize: theme.typography.size.md,
                fontWeight: theme.typography.weight.extraBold,
                color: theme.colors.text.primary,
                whiteSpace: "nowrap",
              }}
            >
              {authorName}
            </span>

            {topic && (
              <span
                style={{
                  fontFamily: theme.typography.fontFamily,
                  fontSize: theme.typography.size.md,
                  color: theme.colors.text.primary,
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ fontWeight: theme.typography.weight.regular }}>
                  {"in "}
                </span>
                <span style={{ fontWeight: theme.typography.weight.bold }}>
                  {topic}
                </span>
              </span>
            )}

            {timeAgo && (
              <>
                <DotSeparator size={6} />
                <span
                  style={{
                    fontFamily: theme.typography.fontFamily,
                    fontSize: theme.typography.size.sm,
                    fontWeight: theme.typography.weight.regular,
                    color: theme.colors.text.timestamp,
                    whiteSpace: "nowrap",
                  }}
                >
                  {timeAgo}
                </span>
              </>
            )}
          </div>

          {location && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing.xxs,
              }}
            >
              <MapPin
                size={13}
                color={theme.colors.text.secondary}
              />
              <span
                style={{
                  fontFamily: theme.typography.fontFamily,
                  fontSize: theme.typography.size.sm,
                  fontWeight: theme.typography.weight.regular,
                  color: theme.colors.text.secondary,
                  whiteSpace: "nowrap",
                }}
              >
                {location}
              </span>
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: theme.spacing.xxs,
        }}
      >
        {isSolved && <Badge type="solved-pill" />}
        <Button variant="icon" iconSize={theme.sizes.icon.lg} aria-label="More">
          <EllipsisVertical size={20} strokeWidth={2} color={theme.colors.text.primary} />
        </Button>
      </div>
    </div>
  );
}
