import React from "react";
import { theme } from "@/app/config";

export type AvatarSize = "xs" | "sm" | "md" | "lg";

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: AvatarSize;
}

export default function Avatar({ src, alt = "User avatar", size = "lg" }: AvatarProps) {
  const pixelSize = theme.sizes.avatar[size];

  return (
    <div
      style={{
        width: `${pixelSize}px`,
        height: `${pixelSize}px`,
        borderRadius: theme.radius.full,
        backgroundColor: theme.colors.background.avatarPlaceholder,
        overflow: "hidden",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : null}
    </div>
  );
}
