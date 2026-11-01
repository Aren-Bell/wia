"use client";

import React, { useState } from "react";
import { theme } from "@/app/config";
import Button from "@/app/components/small/Button";
import InputToolbar from "@/app/components/medium/InputToolbar";

export interface InputCommentProps {
  defaultExpanded?: boolean;
  controlledExpanded?: boolean;
  controlledReplyText?: string;
  placeholder?: string;
  onSubmitReply?: (text: string) => void;
}

export default function InputComment({
  defaultExpanded = false,
  controlledExpanded,
  controlledReplyText,
  placeholder = "Write your reply...",
  onSubmitReply,
}: InputCommentProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [replyText, setReplyText] = useState("");

  const activeExpanded =
    controlledExpanded !== undefined ? controlledExpanded : isExpanded;
  const activeReplyText =
    controlledReplyText !== undefined ? controlledReplyText : replyText;

  // State 1: Sebelum dipencet (Collapsed)
  if (!activeExpanded) {
    return (
      <div
        onClick={() => setIsExpanded(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setIsExpanded(true);
        }}
        style={{
          backgroundColor: theme.colors.background.input,
          height: "48px",
          borderRadius: theme.radius.md,
          padding: theme.spacing.lg,
          display: "flex",
          alignItems: "center",
          width: "100%",
          cursor: "text",
          boxSizing: "border-box",
        }}
      >
        <span
          style={{
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.size.xs,
            fontWeight: theme.typography.weight.regular,
            color: theme.colors.text.body,
          }}
        >
          {placeholder}
        </span>
      </div>
    );
  }

  // State 2: Setelah dipencet (Expanded)
  return (
    <div
      style={{
        backgroundColor: theme.colors.background.input,
        minHeight: "100px",
        borderRadius: theme.radius.md,
        padding: `${theme.spacing.xs} ${theme.spacing.lg}`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        boxSizing: "border-box",
        gap: theme.spacing.xs,
      }}
    >
      <textarea
        value={activeReplyText}
        onChange={(e) => setReplyText(e.target.value)}
        placeholder={placeholder}
        rows={2}
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          outline: "none",
          resize: "none",
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.size.xs,
          color: theme.colors.text.primary,
          padding: 0,
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <InputToolbar />

        <div style={{ display: "flex", alignItems: "center", gap: theme.spacing.xs }}>
          <Button
            variant="secondary"
            onClick={() => {
              setReplyText("");
              setIsExpanded(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (!replyText.trim()) return;
              onSubmitReply?.(replyText);
              setReplyText("");
              setIsExpanded(false);
            }}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
}
