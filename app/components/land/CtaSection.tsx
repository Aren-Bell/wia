"use client";

import React, { useState } from "react";
import { theme } from "@/app/config";
import Button from "@/app/components/small/Button";
import Badge from "@/app/components/small/Badge";
import TagPill from "@/app/components/small/TagPill";

const SAMPLE_TOPICS = ["KebakaranHutan", "ToneDeaf", "Karhutla"];

export default function CtaSection() {
  const [agencyEmail, setAgencyEmail] = useState("");
  const [agencySubmitted, setAgencySubmitted] = useState(false);

  const handleAgencySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agencyEmail.trim()) return;
    setAgencySubmitted(true);
    setAgencyEmail("");
  };

  return (
    <section
      style={{
        width: "100%",
        maxWidth: theme.spacing.pageMaxWidth,
        margin: "0 auto",
        padding: `16px ${theme.spacing.pagePaddingX} 96px`,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: theme.spacing.showcaseMaxWidth,
          margin: "0 auto",
          borderTop: `1px solid ${theme.colors.border.divider}`,
          borderBottom: `1px solid ${theme.colors.border.divider}`,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          boxSizing: "border-box",
        }}
      >
        {/* Left Track: Warga / Pelapor */}
        <div
          style={{
            padding: "48px 48px 48px 0",
            borderRight: `1px solid ${theme.colors.border.divider}`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "28px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <span
              style={{
                fontFamily: theme.typography.fontFamily,
                fontSize: theme.typography.size.xs,
                fontWeight: theme.typography.weight.bold,
                color: theme.colors.brand.primary,
              }}
            >
              For Citizens
            </span>

            <h2
              style={{
                margin: 0,
                fontFamily: theme.typography.fontFamily,
                fontSize: "28px",
                fontWeight: theme.typography.weight.extraBold,
                color: theme.colors.text.primary,
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
              }}
            >
              Don&apos;t Let Local Problems Stay Buried.
            </h2>

            <p
              style={{
                margin: 0,
                fontFamily: theme.typography.fontFamily,
                fontSize: theme.typography.size.sm,
                fontWeight: theme.typography.weight.regular,
                color: theme.colors.text.body,
                lineHeight: theme.typography.lineHeight.relaxed,
              }}
            >
              Get notified as soon as Kavi opens in your province so you can
              report neighborhood issues and back fellow residents.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: theme.spacing.xs,
                flexWrap: "wrap",
              }}
            >
              {SAMPLE_TOPICS.map((tag) => (
                <TagPill key={tag} label={tag} />
              ))}
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => {
                document
                  .getElementById("waitlist-join")
                  ?.scrollIntoView({ behavior: "smooth" });
                document.getElementById("footer-waitlist-email")?.focus();
              }}
            >
              Join Citizen Waitlist
            </Button>
          </div>
        </div>

        {/* Right Track: Instansi Pemerintah / Responder Resmi */}
        <div
          style={{
            padding: "48px 0 48px 48px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "28px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span
                style={{
                  fontFamily: theme.typography.fontFamily,
                  fontSize: theme.typography.size.xs,
                  fontWeight: theme.typography.weight.bold,
                  color: theme.colors.badge.government,
                }}
              >
                For Regional Authorities
              </span>
              <Badge type="government" />
            </div>

            <h2
              style={{
                margin: 0,
                fontFamily: theme.typography.fontFamily,
                fontSize: "28px",
                fontWeight: theme.typography.weight.extraBold,
                color: theme.colors.text.primary,
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
              }}
            >
              Respond With an Official Verified Badge.
            </h2>

            <p
              style={{
                margin: 0,
                fontFamily: theme.typography.fontFamily,
                fontSize: theme.typography.size.sm,
                fontWeight: theme.typography.weight.regular,
                color: theme.colors.text.body,
                lineHeight: theme.typography.lineHeight.relaxed,
              }}
            >
              Register your provincial or municipal agency to receive clustered
              area reports and publish official thread resolutions.
            </p>
          </div>

          <form
            onSubmit={handleAgencySubmit}
            style={{
              display: "flex",
              alignItems: "stretch",
              width: "100%",
              maxWidth: "420px",
            }}
          >
            <label
              htmlFor="agency-verification-email"
              style={{
                position: "absolute",
                width: "1px",
                height: "1px",
                padding: 0,
                margin: "-1px",
                overflow: "hidden",
                clip: "rect(0, 0, 0, 0)",
                whiteSpace: "nowrap",
                border: 0,
              }}
            >
              Official Agency Email
            </label>
            <input
              id="agency-verification-email"
              type="email"
              required
              value={agencyEmail}
              onChange={(e) => {
                setAgencyEmail(e.target.value);
                if (agencySubmitted) setAgencySubmitted(false);
              }}
              placeholder={
                agencySubmitted
                  ? "Verification request received"
                  : "humas@pemda.go.id"
              }
              style={{
                flex: 1,
                minWidth: "180px",
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
              Request Badge
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
