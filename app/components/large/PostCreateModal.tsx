"use client";

import React, { useState } from "react";
import { theme } from "@/app/config";
import Button from "@/app/components/small/Button";
import AuthorMetadata from "@/app/components/medium/AuthorMetadata";
import InputToolbar from "@/app/components/medium/InputToolbar";

export interface PostCreateModalProps {
  authorName?: string;
  avatarSrc?: string;
  controlledTitle?: string;
  controlledBody?: string;
}

export default function PostCreateModal({
  authorName = "Mira Sualifah",
  avatarSrc,
  controlledTitle,
  controlledBody,
}: PostCreateModalProps) {
  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");

  const displayTitle = controlledTitle !== undefined ? controlledTitle : title;
  const displayBody = controlledBody !== undefined ? controlledBody : body;

  return (
    <div
      style={{
        backgroundColor: theme.colors.background.card,
        borderRadius: theme.radius.md,
        padding: theme.spacing.lg,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* PostHeadCard */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <AuthorMetadata
          mode="create"
          authorName={authorName}
          avatarSrc={avatarSrc}
        />

        <Button variant="tertiary">Drafts</Button>
      </div>

      {/* Form Body */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: theme.spacing.xs,
          padding: `${theme.spacing.xxs} 0`,
          width: "100%",
        }}
      >
        {/* *Title Input */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          {displayTitle.length === 0 && (
            <span
              style={{
                position: "absolute",
                left: 0,
                pointerEvents: "none",
                fontFamily: theme.typography.fontFamily,
                fontSize: theme.typography.size.sm,
              }}
            >
              <span style={{ color: theme.colors.text.requiredAsterisk }}>*</span>
              <span style={{ color: theme.colors.text.placeholder }}>Title</span>
            </span>
          )}
          <input
            type="text"
            value={displayTitle}
            onChange={(e) => setTitle(e.target.value)}
            aria-label="Title"
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.size.sm,
              fontWeight: theme.typography.weight.regular,
              color: theme.colors.text.primary,
              padding: 0,
            }}
          />
        </div>

        {/* Body Textarea with Top Divider */}
        <div
          style={{
            borderTop: `1px solid ${theme.colors.border.divider}`,
            height: "115px",
            padding: `5px 0`,
            width: "100%",
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          <textarea
            value={displayBody}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What's happening around you?"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              outline: "none",
              resize: "none",
              overflow: "hidden",
              background: "transparent",
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.size.sm,
              color: theme.colors.text.primary,
              padding: 0,
            }}
          />
        </div>

        {/* Bottom Toolbar & Post Button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <InputToolbar />
          <Button variant="primary">Post</Button>
        </div>
      </div>
    </div>
  );
}
