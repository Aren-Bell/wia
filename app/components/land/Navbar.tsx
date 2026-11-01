"use client";

import React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { theme } from "@/app/config";
import Button from "@/app/components/small/Button";

export interface NavbarProps {
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
}

export default function Navbar({ onLoginClick, onSignUpClick }: NavbarProps) {
  return (
    <header
      style={{
        width: "100%",
        height: "56px",
        backgroundColor: theme.colors.background.navbar,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: theme.spacing.pageMaxWidth,
          padding: `0 ${theme.spacing.pagePaddingX}`,
          boxSizing: "border-box",
        }}
      >
        <nav
          aria-label="Main Navigation"
          style={{
            width: "100%",
            maxWidth: theme.spacing.showcaseMaxWidth,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxSizing: "border-box",
            gap: "24px",
          }}
        >
        {/* Left: Brand Logo */}
        <Link
          href="/"
          aria-label="Kavi Home"
          style={{
            fontFamily: theme.typography.logoFontFamily,
            fontSize: "26px",
            color: theme.colors.brand.primary,
            textDecoration: "none",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          Kavi
        </Link>

        {/* Center: Navigation Links (Railway style) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "32px",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/about"
            style={{
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.size.sm,
              fontWeight: theme.typography.weight.regular,
              color: theme.colors.text.body,
              textDecoration: "none",
            }}
          >
            About Us
          </Link>

          <Link
            href="/#footer-product"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.size.sm,
              fontWeight: theme.typography.weight.regular,
              color: theme.colors.text.body,
              textDecoration: "none",
            }}
          >
            <span>Product</span>
            <ChevronDown size={15} color={theme.colors.text.body} />
          </Link>

          <a
            href="#footer-services"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.size.sm,
              fontWeight: theme.typography.weight.regular,
              color: theme.colors.text.body,
              textDecoration: "none",
            }}
          >
            <span>Services</span>
            <ChevronDown size={15} color={theme.colors.text.body} />
          </a>

          <a
            href="#footer-resources"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.size.sm,
              fontWeight: theme.typography.weight.regular,
              color: theme.colors.text.body,
              textDecoration: "none",
            }}
          >
            <span>Resources</span>
            <ChevronDown size={15} color={theme.colors.text.body} />
          </a>
        </div>

        {/* Right: Coming Soon Actions (tetap pakai variant secondary & primary) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: theme.spacing.sm,
            flexShrink: 0,
          }}
        >
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              onLoginClick?.();
              document
                .getElementById("footer-services")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            For Government
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onSignUpClick?.();
              document
                .getElementById("waitlist-join")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Join Waitlist
          </Button>
        </div>
        </nav>
      </div>
    </header>
  );
}
