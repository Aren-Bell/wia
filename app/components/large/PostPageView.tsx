"use client";

import React, { useState } from "react";
import { theme } from "@/app/config";
import CardView, { CardViewProps } from "@/app/components/large/CardView";
import InputComment from "@/app/components/medium/InputComment";
import CommentItem, { CommentItemProps } from "@/app/components/medium/CommentItem";

export interface PostPageViewProps {
  postProps?: CardViewProps;
  initialComments?: CommentItemProps[];
  controlledComments?: CommentItemProps[];
  controlledCommentExpanded?: boolean;
  controlledCommentText?: string;
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

export default function PostPageView({
  postProps,
  initialComments = DEFAULT_COMMENTS,
  controlledComments,
  controlledCommentExpanded,
  controlledCommentText,
}: PostPageViewProps) {
  const [comments, setComments] = useState<CommentItemProps[]>(initialComments);
  const displayComments =
    controlledComments !== undefined ? controlledComments : comments;

  const handleAddReply = (text: string) => {
    setComments((prev) => [
      {
        authorName: "Mira Sualifah",
        timeAgo: "Just now",
        content: text,
        initialScore: 1,
      },
      ...prev,
    ]);
  };

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
      {/* Main Post Card */}
      <CardView {...postProps} />

      {/* Comment Input Section */}
      <div
        style={{
          borderTop: `1px solid ${theme.colors.border.divider}`,
          borderBottom: `1px solid ${theme.colors.border.divider}`,
          padding: theme.spacing.lg,
          display: "flex",
          flexDirection: "column",
          gap: theme.spacing.lg,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <InputComment
          onSubmitReply={handleAddReply}
          controlledExpanded={controlledCommentExpanded}
          controlledReplyText={controlledCommentText}
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
        {displayComments.map((comment, idx) => (
          <CommentItem key={idx} {...comment} />
        ))}
      </div>
    </div>
  );
}
