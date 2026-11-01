"use client";

import React, { useState } from "react";
import Link from "next/link";
import { theme } from "@/app/config";
import Button from "@/app/components/small/Button";

export interface FooterProps {
  onJoinWaitlist?: (email: string) => void;
}

function GithubFilledIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 1.5C6.201 1.5 1.5 6.201 1.5 12C1.5 16.6425 4.509 20.577 8.6835 21.9645C9.2085 22.062 9.4005 21.7365 9.4005 21.459C9.4005 21.21 9.3915 20.55 9.3855 19.674C6.4635 20.3085 5.847 18.2655 5.847 18.2655C5.3685 17.052 4.6785 16.7295 4.6785 16.7295C3.7245 16.077 4.7505 16.0905 4.7505 16.0905C5.805 16.1655 6.36 17.1735 6.36 17.1735C7.2975 18.78 8.82 18.3165 9.42 18.0465C9.5145 17.367 9.786 16.9035 10.0875 16.641C7.755 16.3755 5.3025 15.4755 5.3025 11.4525C5.3025 10.3065 5.712 9.369 6.3825 8.634C6.2745 8.3685 5.9145 7.302 6.4845 5.856C6.4845 5.856 7.365 5.574 9.3705 6.9315C10.2075 6.699 11.1045 6.582 11.997 6.5775C12.8895 6.582 13.7865 6.699 14.6235 6.9315C16.6275 5.574 17.5065 5.856 17.5065 5.856C18.078 7.302 17.718 8.3685 17.61 8.634C18.282 9.369 18.6885 10.3065 18.6885 11.4525C18.6885 15.486 16.2315 16.3725 13.8915 16.632C14.2695 16.956 14.6055 17.5995 14.6055 18.582C14.6055 19.989 14.592 21.1245 14.592 21.459C14.592 21.7395 14.781 22.0665 15.3135 21.963C19.4865 20.574 22.5 16.641 22.5 12C22.5 6.201 17.799 1.5 12 1.5Z"
        fill={theme.colors.brand.primary}
      />
    </svg>
  );
}

function TwitterXIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M18.244 2.25H21.552L14.325 10.51L22.827 21.75H16.17L10.956 14.933L4.99 21.75H1.68L9.41 12.915L1.254 2.25H8.08L12.793 8.481L18.244 2.25ZM17.083 19.77H18.916L7.084 4.126H5.117L17.083 19.77Z"
        fill={theme.colors.brand.primary}
      />
    </svg>
  );
}

function LinkedinFilledIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M19 3H5C3.895 3 3 3.895 3 5V19C3 20.105 3.895 21 5 21H19C20.105 21 21 20.105 21 19V5C21 3.895 20.105 3 19 3ZM9 17H6.477V10H9V17ZM7.694 8.717C6.923 8.717 6.408 8.203 6.408 7.517C6.408 6.831 6.922 6.317 7.779 6.317C8.55 6.317 9.065 6.831 9.065 7.517C9.065 8.203 8.551 8.717 7.694 8.717ZM18 17H15.558V13.174C15.558 12.116 14.907 11.872 14.663 11.872C14.419 11.872 13.605 12.035 13.605 13.174C13.605 13.337 13.605 17 13.605 17H11.082V10H13.605V10.977C13.93 10.407 14.581 10 15.802 10C17.023 10 18 10.977 18 13.174V17Z"
        fill={theme.colors.brand.primary}
      />
    </svg>
  );
}

function InstagramFilledIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.5 2H16.5C19.5376 2 22 4.46243 22 7.5V16.5C22 19.5376 19.5376 22 16.5 22H7.5C4.46243 22 2 19.5376 2 16.5V7.5C2 4.46243 4.46243 2 7.5 2ZM7.5 4C5.567 4 4 5.567 4 7.5V16.5C4 18.433 5.567 20 7.5 20H16.5C18.433 20 20 18.433 20 16.5V7.5C20 5.567 18.433 4 16.5 4H7.5ZM12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7ZM12 9C13.6569 9 15 10.3431 15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9ZM17.25 5.5C16.5596 5.5 16 6.05964 16 6.75C16 7.44036 16.5596 8 17.25 8C17.9404 8 18.5 7.44036 18.5 6.75C18.5 6.05964 17.9404 5.5 17.25 5.5Z"
        fill={theme.colors.brand.primary}
      />
    </svg>
  );
}

export default function Footer({ onJoinWaitlist }: FooterProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    onJoinWaitlist?.(email.trim());
    setSubmitted(true);
    setEmail("");
  };

  return (
    <footer
      style={{
        width: "100%",
        backgroundColor: theme.colors.background.card,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
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
        {/* Top Row */}
        <div
          style={{
            width: "100%",
            maxWidth: theme.spacing.showcaseMaxWidth,
            margin: "0 auto",
            padding: "32px 0",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "40px",
            boxSizing: "border-box",
          }}
        >
        {/* Brand Column */}
        <div
          id="footer-about"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "10px",
            maxWidth: "350px",
          }}
        >
          <span
            style={{
              fontFamily: theme.typography.logoFontFamily,
              fontSize: theme.typography.size.logo,
              color: theme.colors.brand.primary,
              lineHeight: 1,
            }}
          >
            Kavi
          </span>

          <p
            style={{
              margin: 0,
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.size.sm,
              fontWeight: theme.typography.weight.regular,
              color: theme.colors.text.body,
              lineHeight: "normal",
            }}
          >
            Kavi is a platform for addressing the issues faced by Indonesian
            citizens. Through Kavi, we hope to help Indonesians achieve their
            rights and live a decent and peaceful life.
          </p>
        </div>

        {/* Right Columns + Exclusive Access */}
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            gap: "64px",
            flexWrap: "wrap",
          }}
        >
          {/* Column 1: Kavi */}
          <div
            id="footer-services"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "16px",
            }}
          >
            <span
              style={{
                fontFamily: theme.typography.fontFamily,
                fontSize: theme.typography.size.md,
                fontWeight: theme.typography.weight.bold,
                color: theme.colors.text.primary,
              }}
            >
              Kavi
            </span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                fontFamily: theme.typography.fontFamily,
                fontSize: theme.typography.size.sm,
                color: theme.colors.text.muted,
              }}
            >
              <span>Services</span>
              <Link
                href="/about"
                style={{
                  color: theme.colors.text.muted,
                  textDecoration: "none",
                }}
              >
                About Us
              </Link>
              <span>Support</span>
            </div>
          </div>

          {/* Column 2: Resources */}
          <div
            id="footer-resources"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "16px",
            }}
          >
            <span
              style={{
                fontFamily: theme.typography.fontFamily,
                fontSize: theme.typography.size.md,
                fontWeight: theme.typography.weight.bold,
                color: theme.colors.text.primary,
              }}
            >
              Resources
            </span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                fontFamily: theme.typography.fontFamily,
                fontSize: theme.typography.size.sm,
                color: theme.colors.text.muted,
              }}
            >
              <span>Tutorial</span>
              <span>Documentation</span>
              <span>Blog</span>
              <span>Changelog</span>
            </div>
          </div>

          {/* Column 3: Contact */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "16px",
            }}
          >
            <span
              style={{
                fontFamily: theme.typography.fontFamily,
                fontSize: theme.typography.size.md,
                fontWeight: theme.typography.weight.bold,
                color: theme.colors.text.primary,
              }}
            >
              Contact
            </span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                fontFamily: theme.typography.fontFamily,
                fontSize: theme.typography.size.sm,
                color: theme.colors.text.muted,
              }}
            >
              <span>+021 2134567 89</span>
              <span>+1 2345 678 910</span>
              <a
                href="mailto:support@kavi.com"
                style={{
                  color: theme.colors.text.muted,
                  textDecoration: "none",
                }}
              >
                support@kavi.com
              </a>
            </div>
          </div>

          {/* Column 4: Get Exclusive Access on Kavi */}
          <div
            id="waitlist-join"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "16px",
              }}
            >
              <label
                htmlFor="footer-waitlist-email"
                style={{
                  fontFamily: theme.typography.fontFamily,
                  fontSize: theme.typography.size.md,
                  fontWeight: theme.typography.weight.bold,
                  color: theme.colors.text.primary,
                  whiteSpace: "nowrap",
                }}
              >
                Get Exclusive Access on Kavi
              </label>

              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  alignItems: "stretch",
                  width: "100%",
                }}
              >
                <input
                  id="footer-waitlist-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (submitted) setSubmitted(false);
                  }}
                  placeholder={
                    submitted ? "Thank you for joining!" : "Your Email Address"
                  }
                  style={{
                    flex: 1,
                    minWidth: "170px",
                    padding: `${theme.spacing.xs} ${theme.spacing.lg}`,
                    border: `1px solid ${theme.colors.brand.primary}`,
                    borderRight: "none",
                    borderRadius: `${theme.radius.button} 0 0 ${theme.radius.button}`,
                    outline: "none",
                    fontFamily: theme.typography.fontFamily,
                    fontSize: theme.typography.size.xs,
                    color: theme.colors.text.primary,
                    backgroundColor: theme.colors.background.card,
                  }}
                />
                <Button
                  type="submit"
                  variant="primary"
                  style={{
                    borderRadius: `0 ${theme.radius.button} ${theme.radius.button} 0`,
                    border: `1px solid ${theme.colors.brand.primary}`,
                    padding: `${theme.spacing.xs} 16px`,
                  }}
                >
                  Join
                </Button>
              </form>
            </div>

            {/* Social Icons */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <GithubFilledIcon />
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                <TwitterXIcon />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <LinkedinFilledIcon />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <InstagramFilledIcon />
              </a>
            </div>
          </div>
        </div>
      </div>

        {/* Divider Line (rata kiri-kanan dengan konten atas & bawah) */}
        <div
          style={{
            width: "100%",
            maxWidth: theme.spacing.showcaseMaxWidth,
            margin: "0 auto",
            height: "1px",
            backgroundColor: theme.colors.border.footerDivider,
          }}
        />

        {/* Bottom Legal Row */}
        <div
          style={{
            width: "100%",
            maxWidth: theme.spacing.showcaseMaxWidth,
            margin: "0 auto",
            padding: "32px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
            boxSizing: "border-box",
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.size.sm,
            fontWeight: theme.typography.weight.regular,
            color: theme.colors.text.muted,
          }}
        >
          <span>© 2026 Kavi. All Rights Reserved.</span>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span>Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
