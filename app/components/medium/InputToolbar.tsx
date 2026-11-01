"use client";

import React from "react";
import { Image as ImageIcon, MapPin, Smile, Tag } from "lucide-react";
import { theme } from "@/app/config";
import Button from "@/app/components/small/Button";

export interface InputToolbarProps {
  onImageClick?: () => void;
  onLocationClick?: () => void;
  onEmojiClick?: () => void;
  onTagClick?: () => void;
}

export default function InputToolbar({
  onImageClick,
  onLocationClick,
  onEmojiClick,
  onTagClick,
}: InputToolbarProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: theme.spacing.xs,
        borderRadius: theme.radius.md,
      }}
    >
      <Button
        variant="icon"
        iconSize={theme.sizes.icon.lg}
        aria-label="Attach image"
        onClick={onImageClick}
      >
        <ImageIcon size={20} color={theme.colors.icon.muted} />
      </Button>

      <Button
        variant="icon"
        iconSize={theme.sizes.icon.lg}
        aria-label="Add location"
        onClick={onLocationClick}
      >
        <MapPin size={20} color={theme.colors.icon.muted} />
      </Button>

      <Button
        variant="icon"
        iconSize={theme.sizes.icon.lg}
        aria-label="Add emoji"
        onClick={onEmojiClick}
      >
        <Smile size={20} color={theme.colors.icon.muted} />
      </Button>

      <Button
        variant="icon"
        iconSize={theme.sizes.icon.lg}
        aria-label="Add tag"
        onClick={onTagClick}
      >
        <Tag size={20} color={theme.colors.icon.muted} />
      </Button>
    </div>
  );
}
