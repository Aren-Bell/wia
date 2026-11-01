"use client";

import React from "react";
import { theme } from "@/app/config";
import AuthorMetadata from "@/app/components/medium/AuthorMetadata";
import ActionsButton from "@/app/components/medium/ActionsButton";

export interface CommentItemProps {
  authorName?: string;
  avatarSrc?: string;
  timeAgo?: string;
  content?: string;
  initialScore?: number;
}

export default function CommentItem({
  authorName = "Mira Sualifah",
  avatarSrc,
  timeAgo = "12d ago",
  content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
  initialScore = 995,
}: CommentItemProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "100%",
      }}
    >
      <AuthorMetadata
        mode="comment"
        authorName={authorName}
        avatarSrc={avatarSrc}
        timeAgo={timeAgo}
      />

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        {/* Spacer kiri 40px sejajar avatar sesuai desain Figma */}
        <div
          style={{
            width: theme.spacing.commentIndent,
            flexShrink: 0,
            alignSelf: "stretch",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            flex: 1,
            minWidth: 0,
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.size.sm,
              fontWeight: theme.typography.weight.regular,
              lineHeight: theme.typography.lineHeight.normal,
              color: theme.colors.text.body,
              wordBreak: "break-word",
              width: "100%",
            }}
          >
            {content}
          </p>

          <ActionsButton initialScore={initialScore} compactPadding />
        </div>
      </div>
    </div>
  );
}
