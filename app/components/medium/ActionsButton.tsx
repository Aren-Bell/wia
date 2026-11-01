"use client";

import React, { useState } from "react";
import { Play, MessageSquareText, Repeat, Send } from "lucide-react";
import { theme } from "@/app/config";
import Button from "@/app/components/small/Button";

export type VoteStatus = "up" | "down" | null;

export interface ActionsButtonProps {
  initialScore?: number;
  initialVote?: VoteStatus;
  onVote?: (vote: VoteStatus, newScore: number) => void;
  onCommentClick?: () => void;
  onRepost?: (isReposted: boolean) => void;
  onShare?: () => void;
  compactPadding?: boolean;
}

export default function ActionsButton({
  initialScore = 995,
  initialVote = null,
  onVote,
  onCommentClick,
  onRepost,
  onShare,
  compactPadding = false,
}: ActionsButtonProps) {
  const [vote, setVote] = useState<VoteStatus>(initialVote);
  const [score, setScore] = useState<number>(initialScore);
  const [isReposted, setIsReposted] = useState<boolean>(false);

  const handleUpvote = () => {
    let nextVote: VoteStatus = "up";
    let delta = 1;

    if (vote === "up") {
      nextVote = null;
      delta = -1;
    } else if (vote === "down") {
      nextVote = "up";
      delta = 2;
    }

    const updatedScore = score + delta;
    setVote(nextVote);
    setScore(updatedScore);
    onVote?.(nextVote, updatedScore);
  };

  const handleDownvote = () => {
    let nextVote: VoteStatus = "down";
    let delta = -1;

    if (vote === "down") {
      nextVote = null;
      delta = 1;
    } else if (vote === "up") {
      nextVote = "down";
      delta = -2;
    }

    const updatedScore = score + delta;
    setVote(nextVote);
    setScore(updatedScore);
    onVote?.(nextVote, updatedScore);
  };

  const handleRepost = () => {
    const next = !isReposted;
    setIsReposted(next);
    onRepost?.(next);
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
      return;
    }
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: theme.spacing.xs,
        width: "100%",
        padding: compactPadding
          ? `${theme.spacing.xs} 0`
          : `${theme.spacing.xs} ${theme.spacing.lg}`,
      }}
    >
      {/* Voting Group */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: theme.spacing.xs,
          height: `${theme.sizes.icon.action}px`,
          borderRadius: theme.radius.md,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: theme.spacing.xxs,
          }}
        >
          <Button
            variant="icon"
            iconSize={theme.sizes.icon.md}
            aria-label="Upvote"
            onClick={handleUpvote}
          >
            <Play
              size={18}
              style={{
                transform: "rotate(-90deg)",
                color:
                  vote === "up"
                    ? theme.colors.icon.activeUpvote
                    : theme.colors.icon.muted,
                fill: vote === "up" ? theme.colors.icon.activeUpvote : "none",
              }}
            />
          </Button>
          <span
            style={{
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.size.xs,
              fontWeight: theme.typography.weight.regular,
              color:
                vote === "up"
                  ? theme.colors.icon.activeUpvote
                  : vote === "down"
                  ? theme.colors.icon.activeDownvote
                  : theme.colors.text.muted,
              whiteSpace: "nowrap",
              userSelect: "none",
            }}
          >
            {score}
          </span>
        </div>

        <Button
          variant="icon"
          iconSize={theme.sizes.icon.md}
          aria-label="Downvote"
          onClick={handleDownvote}
        >
          <Play
            size={18}
            style={{
              transform: "rotate(90deg)",
              color:
                vote === "down"
                  ? theme.colors.icon.activeDownvote
                  : theme.colors.icon.muted,
              fill: vote === "down" ? theme.colors.icon.activeDownvote : "none",
            }}
          />
        </Button>
      </div>

      {/* Comment */}
      <Button
        variant="icon"
        iconSize={theme.sizes.icon.action}
        aria-label="Comment"
        onClick={onCommentClick}
      >
        <MessageSquareText
          size={19}
          color={theme.colors.icon.muted}
        />
      </Button>

      {/* Repost */}
      <Button
        variant="icon"
        iconSize={theme.sizes.icon.action}
        aria-label="Repost"
        onClick={handleRepost}
      >
        <Repeat
          size={19}
          color={
            isReposted
              ? theme.colors.icon.activeRepost
              : theme.colors.icon.muted
          }
        />
      </Button>

      {/* Share */}
      <Button
        variant="icon"
        iconSize={theme.sizes.icon.action}
        aria-label="Share"
        onClick={handleShare}
      >
        <Send size={18} color={theme.colors.icon.muted} />
      </Button>
    </div>
  );
}
