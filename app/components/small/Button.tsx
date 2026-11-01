"use client";

import React from "react";
import { theme } from "@/app/config";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "icon";
export type ButtonSize = "sm" | "md";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  active?: boolean;
  iconSize?: number;
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "sm",
  active = false,
  iconSize,
  style,
  children,
  ...props
}: ButtonProps) {
  const isMd = size === "md";
  const textSize = isMd ? theme.typography.size.sm : theme.typography.size.xs;
  const buttonPadding = isMd
    ? `10px 24px`
    : `${theme.spacing.xs} ${theme.spacing.lg}`;

  const baseStyle: React.CSSProperties = {
    fontFamily: theme.typography.fontFamily,
    cursor: props.disabled ? "not-allowed" : "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    background: "transparent",
    boxSizing: "border-box",
    transition: "opacity 0.15s ease, background-color 0.15s ease, color 0.15s ease",
    whiteSpace: "nowrap",
    flexShrink: 0,
  };

  const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
    // Tombol Utama: Post, Cancel, View Response, Sign Up (Teal #0f8b8d)
    primary: {
      backgroundColor: theme.colors.brand.primary,
      color: theme.colors.text.inverse,
      border: `1px solid ${theme.colors.brand.primary}`,
      fontSize: textSize,
      fontWeight: isMd ? theme.typography.weight.medium : theme.typography.weight.regular,
      borderRadius: theme.radius.button,
      padding: buttonPadding,
      lineHeight: "normal",
    },
    // Tombol Sekunder: Outline dengan teks warna brand (seperti tombol Login)
    secondary: {
      backgroundColor: "transparent",
      color: theme.colors.brand.primary,
      border: `1px solid ${theme.colors.border.navbarPill}`,
      fontSize: textSize,
      fontWeight: isMd ? theme.typography.weight.medium : theme.typography.weight.regular,
      borderRadius: theme.radius.button,
      padding: buttonPadding,
      lineHeight: "normal",
    },
    // Tombol Tertiary: Text-only seperti "Drafts"
    tertiary: {
      backgroundColor: "transparent",
      color: theme.colors.text.muted,
      fontSize: theme.typography.size.xs,
      fontWeight: theme.typography.weight.bold,
      padding: `${theme.spacing.xxs} ${theme.spacing.xs}`,
      lineHeight: "normal",
    },
    // Tombol Ikon: dipakai di ActionsButton, InputToolbar, MoreActions
    icon: {
      width: iconSize ? `${iconSize}px` : `${theme.sizes.icon.lg}px`,
      height: iconSize ? `${iconSize}px` : `${theme.sizes.icon.lg}px`,
      padding: 0,
      borderRadius: theme.radius.sm,
      color: active ? theme.colors.brand.primary : theme.colors.icon.default,
    },
  };

  return (
    <button
      type="button"
      style={{
        ...baseStyle,
        ...variantStyles[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
