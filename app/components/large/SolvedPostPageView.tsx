"use client";

import React from "react";
import { theme } from "@/app/config";
import CardView, { CardViewProps } from "@/app/components/large/CardView";
import ClosedThread, { ClosedThreadType } from "@/app/components/medium/ClosedThread";
import CommentItem, { CommentItemProps } from "@/app/components/medium/CommentItem";

export interface SolvedPostPageViewProps {
  /**
   * "government" -> Centang Hijau (Aparat Berwenang)
   * "internal"   -> Centang Merah (Tim Internal Dev)
   */
  closedByType?: ClosedThreadType;
  resolverName?: string;
  postProps?: CardViewProps;
  comments?: CommentItemProps[];
  onViewResponse?: () => void;
}

const DEFAULT_COMMENTS: CommentItemProps[] = [
  {
    authorName: "Mira Sualifah",
    timeAgo: "12d ago",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    initialScore: 995,
  },
];

export default function SolvedPostPageView({
  closedByType = "government",
  resolverName,
  postProps,
  comments = DEFAULT_COMMENTS,
  onViewResponse,
}: SolvedPostPageViewProps) {
  return (
    <div
      style={{
        backgroundColor: theme.colors.background.card,
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing.sm,
        alignItems: "center",
        width: "100%",
      }}
    >
      {/* Main Post Card with Solved Badge */}
      <CardView {...postProps} isSolved />

      {/* Closed Thread Banner Section (Replaces CommentInput) */}
      <div
        style={{
          borderTop: `1px solid ${theme.colors.border.divider}`,
          borderBottom: `1px solid ${theme.colors.border.divider}`,
          padding: theme.spacing.lg,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <ClosedThread
          type={closedByType}
          resolverName={resolverName}
          onViewResponse={onViewResponse}
        />
      </div>

      {/* Comment Reply List */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: theme.spacing.lg,
          padding: `0 ${theme.spacing.lg} ${theme.spacing.lg}`,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {comments.map((comment, idx) => (
          <CommentItem key={idx} {...comment} />
        ))}
      </div>
    </div>
  );
}
