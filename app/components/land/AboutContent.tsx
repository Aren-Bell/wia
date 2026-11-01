"use client";

import React from "react";
import { Globe } from "lucide-react";
import { theme } from "@/app/config";
import Badge from "@/app/components/small/Badge";
import FormalPhoto from "@/app/components/small/FormalPhoto";

export interface CrewMember {
  id: string;
  name: string;
  role: string;
  handle: string;
  photoSrc?: string;
  accentColor: string;
  initials: string;
  links: {
    github?: string;
    x?: string;
    linkedin?: string;
    website?: string;
  };
}

export const CREW_MEMBERS: CrewMember[] = [
  {
    id: "zaky",
    name: "Zaky",
    role: "Head Developer",
    handle: "@zaky",
    accentColor: "#0f8b8d",
    initials: "ZK",
    links: {
      github: "https://github.com",
      x: "https://x.com",
      linkedin: "https://linkedin.com",
      website: "https://kavi.id",
    },
  },
  {
    id: "farika",
    name: "Farika Auliya",
    role: "Multimedia Designer",
    handle: "@farikaauliya",
    accentColor: "#dc2626",
    initials: "FA",
    links: {
      x: "https://x.com",
      linkedin: "https://linkedin.com",
      website: "https://kavi.id",
    },
  },
  {
    id: "adrian",
    name: "Adrian Bagas",
    role: "Growth Executive",
    handle: "@adrianbagas",
    accentColor: "#14ae5c",
    initials: "AB",
    links: {
      x: "https://x.com",
      linkedin: "https://linkedin.com",
    },
  },
];

function GithubSmallIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 1.5C6.201 1.5 1.5 6.201 1.5 12C1.5 16.6425 4.509 20.577 8.6835 21.9645C9.2085 22.062 9.4005 21.7365 9.4005 21.459C9.4005 21.21 9.3915 20.55 9.3855 19.674C6.4635 20.3085 5.847 18.2655 5.847 18.2655C5.3685 17.052 4.6785 16.7295 4.6785 16.7295C3.7245 16.077 4.7505 16.0905 4.7505 16.0905C5.805 16.1655 6.36 17.1735 6.36 17.1735C7.2975 18.78 8.82 18.3165 9.42 18.0465C9.5145 17.367 9.786 16.9035 10.0875 16.641C7.755 16.3755 5.3025 15.4755 5.3025 11.4525C5.3025 10.3065 5.712 9.369 6.3825 8.634C6.2745 8.3685 5.9145 7.302 6.4845 5.856C6.4845 5.856 7.365 5.574 9.3705 6.9315C10.2075 6.699 11.1045 6.582 11.997 6.5775C12.8895 6.582 13.7865 6.699 14.6235 6.9315C16.6275 5.574 17.5065 5.856 17.5065 5.856C18.078 7.302 17.718 8.3685 17.61 8.634C18.282 9.369 18.6885 10.3065 18.6885 11.4525C18.6885 15.486 16.2315 16.3725 13.8915 16.632C14.2695 16.956 14.6055 17.5995 14.6055 18.582C14.6055 19.989 14.592 21.1245 14.592 21.459C14.592 21.7395 14.781 22.0665 15.3135 21.963C19.4865 20.574 22.5 16.641 22.5 12C22.5 6.201 17.799 1.5 12 1.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function XSmallIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M18.244 2.25H21.552L14.325 10.51L22.827 21.75H16.17L10.956 14.933L4.99 21.75H1.68L9.41 12.915L1.254 2.25H8.08L12.793 8.481L18.244 2.25ZM17.083 19.77H18.916L7.084 4.126H5.117L17.083 19.77Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LinkedinSmallIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M19 3H5C3.895 3 3 3.895 3 5V19C3 20.105 3.895 21 5 21H19C20.105 21 21 20.105 21 19V5C21 3.895 20.105 3 19 3ZM9 17H6.477V10H9V17ZM7.694 8.717C6.923 8.717 6.408 8.203 6.408 7.517C6.408 6.831 6.922 6.317 7.779 6.317C8.55 6.317 9.065 6.831 9.065 7.517C9.065 8.203 8.551 8.717 7.694 8.717ZM18 17H15.558V13.174C15.558 12.116 14.907 11.872 14.663 11.872C14.419 11.872 13.605 12.035 13.605 13.174C13.605 13.337 13.605 17 13.605 17H11.082V10H13.605V10.977C13.93 10.407 14.581 10 15.802 10C17.023 10 18 10.977 18 13.174V17Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function AboutContent() {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: theme.spacing.pageMaxWidth,
        margin: "0 auto",
        padding: `56px ${theme.spacing.pagePaddingX} 96px`,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: theme.spacing.showcaseMaxWidth,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "88px",
        }}
      >
        {/* SECTION 1: ABOUT KAVI + MISSION / VISION */}
        <section
          aria-labelledby="about-kavi-heading"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "44px",
          }}
        >
          {/* Centered Header */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "12px",
              maxWidth: "560px",
            }}
          >
            <h1
              id="about-kavi-heading"
              style={{
                margin: 0,
                fontFamily: theme.typography.fontFamily,
                fontSize: "44px",
                fontWeight: theme.typography.weight.extraBold,
                color: theme.colors.text.primary,
                lineHeight: 1.15,
                letterSpacing: "-0.025em",
              }}
            >
              About Kavi
            </h1>
            <p
              style={{
                margin: 0,
                fontFamily: theme.typography.fontFamily,
                fontSize: theme.typography.size.md,
                fontWeight: theme.typography.weight.regular,
                color: theme.colors.text.body,
                lineHeight: theme.typography.lineHeight.relaxed,
              }}
            >
              Get to know a bit about the team and where we&apos;re headed.
            </p>
          </div>

          {/* 2-Column Split Box: Our Mission | Our Vision */}
          <div
            style={{
              width: "100%",
              border: `1px solid ${theme.colors.border.divider}`,
              borderRadius: theme.radius.md,
              backgroundColor: theme.colors.background.card,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
              overflow: "hidden",
              boxSizing: "border-box",
            }}
          >
            {/* Left Column: Our Mission */}
            <div
              style={{
                padding: "36px 32px 32px",
                borderRight: `1px solid ${theme.colors.border.divider}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "28px",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: "8px",
                  maxWidth: "380px",
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontFamily: theme.typography.fontFamily,
                    fontSize: "20px",
                    fontWeight: theme.typography.weight.bold,
                    color: theme.colors.text.primary,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Our Mission
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
                  To give every citizen a clear, friction-free way to report
                  local issues and track public resolution.
                </p>
              </div>

              {/* Mission Visual: Single Direct Civic Route */}
              <div
                style={{
                  width: "100%",
                  height: "230px",
                  borderRadius: theme.radius.md,
                  border: `1px solid ${theme.colors.border.divider}`,
                  backgroundColor: "#f3f4f4",
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  viewBox="0 0 460 230"
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                  }}
                >
                  <defs>
                    <pattern
                      id="mission-dots"
                      width="18"
                      height="18"
                      patternUnits="userSpaceOnUse"
                    >
                      <circle cx="2" cy="2" r="1" fill="#d4d4d4" />
                    </pattern>
                  </defs>

                  <rect width="460" height="230" fill="url(#mission-dots)" />

                  {/* Faint glow path */}
                  <path
                    d="M 74 62 L 154 134 L 286 134 L 368 182"
                    fill="none"
                    stroke="rgba(15, 139, 141, 0.16)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Main civic route line */}
                  <path
                    d="M 74 62 L 154 134 L 286 134 L 368 182"
                    fill="none"
                    stroke={theme.colors.brand.primary}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Station 1: Report */}
                  <line
                    x1="74"
                    y1="62"
                    x2="102"
                    y2="36"
                    stroke="#a9a9a9"
                    strokeWidth="1"
                  />
                  <text
                    x="107"
                    y="34"
                    fill={theme.colors.text.secondary}
                    fontSize="10"
                    fontWeight="700"
                    fontFamily={theme.typography.fontFamily}
                  >
                    1. Citizen Report
                  </text>
                  <circle
                    cx="74"
                    cy="62"
                    r="6"
                    fill={theme.colors.background.card}
                    stroke={theme.colors.brand.primary}
                    strokeWidth="2.5"
                  />

                  {/* Station 2: Community Thread (featured hub) */}
                  <line
                    x1="154"
                    y1="134"
                    x2="182"
                    y2="104"
                    stroke="#a9a9a9"
                    strokeWidth="1"
                  />
                  <text
                    x="187"
                    y="102"
                    fill={theme.colors.text.primary}
                    fontSize="10"
                    fontWeight="700"
                    fontFamily={theme.typography.fontFamily}
                  >
                    2. Public Thread
                  </text>
                  <circle
                    cx="154"
                    cy="134"
                    r="11"
                    fill={theme.colors.background.card}
                    stroke={theme.colors.brand.primary}
                    strokeWidth="2.5"
                  />
                  <circle
                    cx="154"
                    cy="134"
                    r="4.5"
                    fill={theme.colors.brand.primary}
                  />

                  {/* Station 3: Agency Dispatch */}
                  <line
                    x1="286"
                    y1="134"
                    x2="314"
                    y2="104"
                    stroke="#a9a9a9"
                    strokeWidth="1"
                  />
                  <text
                    x="319"
                    y="102"
                    fill={theme.colors.text.secondary}
                    fontSize="10"
                    fontWeight="700"
                    fontFamily={theme.typography.fontFamily}
                  >
                    3. Agency Action
                  </text>
                  <circle
                    cx="286"
                    cy="134"
                    r="6"
                    fill={theme.colors.background.card}
                    stroke={theme.colors.brand.primary}
                    strokeWidth="2.5"
                  />

                  {/* Station 4: Solved */}
                  <line
                    x1="368"
                    y1="182"
                    x2="394"
                    y2="154"
                    stroke="#14ae5c"
                    strokeWidth="1"
                  />
                  <text
                    x="398"
                    y="152"
                    fill={theme.colors.badge.government}
                    fontSize="10"
                    fontWeight="700"
                    fontFamily={theme.typography.fontFamily}
                  >
                    4. Solved
                  </text>
                  <circle
                    cx="368"
                    cy="182"
                    r="7"
                    fill={theme.colors.badge.government}
                    stroke={theme.colors.background.card}
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>

            {/* Right Column: Our Vision */}
            <div
              style={{
                padding: "36px 32px 32px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "28px",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: "8px",
                  maxWidth: "380px",
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontFamily: theme.typography.fontFamily,
                    fontSize: "20px",
                    fontWeight: theme.typography.weight.bold,
                    color: theme.colors.text.primary,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Our Vision
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
                  To connect citizens, communities, and regional agencies across
                  Indonesia on one transparent civic network.
                </p>
              </div>

              {/* Vision Visual: Multi-Region Interconnected Transit Network */}
              <div
                style={{
                  width: "100%",
                  height: "230px",
                  borderRadius: theme.radius.md,
                  border: `1px solid ${theme.colors.border.divider}`,
                  backgroundColor: "#f3f4f4",
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  viewBox="0 0 460 230"
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                  }}
                >
                  <defs>
                    <pattern
                      id="vision-dots"
                      width="18"
                      height="18"
                      patternUnits="userSpaceOnUse"
                    >
                      <circle cx="2" cy="2" r="1" fill="#d4d4d4" />
                    </pattern>
                  </defs>

                  <rect width="460" height="230" fill="url(#vision-dots)" />

                  {/* Secondary regional feeder lines (grey) */}
                  <path
                    d="M 20 86 L 98 86 L 146 134 L 146 210"
                    fill="none"
                    stroke="#b6b6b6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 98 20 L 98 86 L 178 86 L 222 42 L 430 42"
                    fill="none"
                    stroke="#9ca3af"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 248 210 L 290 168 L 440 168"
                    fill="none"
                    stroke="#b6b6b6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Primary Teal Trunk Line (Citizen Reports) */}
                  <path
                    d="M 24 44 L 84 44 L 138 98 L 256 98 L 312 154 L 436 154"
                    fill="none"
                    stroke={theme.colors.brand.primary}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Green Verified Resolution Line (Government Responders) */}
                  <path
                    d="M 46 184 L 116 184 L 166 134 L 288 134 L 348 74 L 428 74"
                    fill="none"
                    stroke={theme.colors.badge.government}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Red Priority Escalation Line (Urgent Regional Alerts) */}
                  <path
                    d="M 192 22 L 236 66 L 348 66 L 388 106 L 388 204"
                    fill="none"
                    stroke={theme.colors.badge.internal}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Interchange Nodes */}
                  {[
                    { x: 84, y: 44, color: theme.colors.brand.primary, label: "Sumbar" },
                    { x: 98, y: 86, color: "#737373" },
                    { x: 138, y: 98, color: theme.colors.brand.primary, label: "Jabar" },
                    { x: 166, y: 134, color: theme.colors.badge.government },
                    { x: 236, y: 66, color: theme.colors.badge.internal, label: "Kaltara" },
                    { x: 256, y: 98, color: theme.colors.brand.primary },
                    { x: 288, y: 134, color: theme.colors.badge.government, label: "Jatim" },
                    { x: 348, y: 74, color: theme.colors.badge.government, label: "Sulsel" },
                    { x: 388, y: 106, color: theme.colors.badge.internal },
                    { x: 312, y: 154, color: theme.colors.brand.primary },
                    { x: 388, y: 154, color: theme.colors.brand.primary, label: "Papua" },
                  ].map((node, idx) => (
                    <g key={idx}>
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="5.5"
                        fill={theme.colors.background.card}
                        stroke={node.color}
                        strokeWidth="2.5"
                      />
                      {node.label && (
                        <text
                          x={node.x + 8}
                          y={node.y - 8}
                          fill={theme.colors.text.secondary}
                          fontSize="9.5"
                          fontWeight="700"
                          fontFamily={theme.typography.fontFamily}
                        >
                          {node.label}
                        </text>
                      )}
                    </g>
                  ))}
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: MEET OUR CREW */}
        <section
          aria-labelledby="meet-crew-heading"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "48px",
          }}
        >
          {/* Centered Header */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "12px",
              maxWidth: "580px",
            }}
          >
            <h2
              id="meet-crew-heading"
              style={{
                margin: 0,
                fontFamily: theme.typography.fontFamily,
                fontSize: "32px",
                fontWeight: theme.typography.weight.extraBold,
                color: theme.colors.text.primary,
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
              }}
            >
              Meet Our Crew
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
              Kavi is built by a focused team of engineers, designers, and civic
              researchers dedicated to making public reporting transparent across
              Indonesia.
            </p>
          </div>

          {/* 3-Column Crew Grid (Railway Style) */}
          <div
            style={{
              width: "100%",
              maxWidth: "880px",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              justifyItems: "center",
              columnGap: "36px",
              rowGap: "32px",
              boxSizing: "border-box",
            }}
          >
            {CREW_MEMBERS.map((member) => (
              <div
                key={member.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <FormalPhoto
                  src={member.photoSrc}
                  alt={member.name}
                  size="md"
                  initials={member.initials}
                  accentColor={member.accentColor}
                />

                {/* Member Details */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: theme.typography.fontFamily,
                        fontSize: theme.typography.size.md,
                        fontWeight: theme.typography.weight.bold,
                        color: theme.colors.text.primary,
                        lineHeight: 1.2,
                      }}
                    >
                      {member.name}
                    </span>
                    <Badge type="internal" />
                  </div>

                  <span
                    style={{
                      fontFamily: theme.typography.fontFamily,
                      fontSize: theme.typography.size.xs,
                      fontWeight: theme.typography.weight.regular,
                      color: theme.colors.text.muted,
                      lineHeight: 1.3,
                    }}
                  >
                    {member.role}
                  </span>

                  {/* Social Links Row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginTop: "4px",
                      color: theme.colors.icon.muted,
                    }}
                  >
                    {member.links.github && (
                      <a
                        href={member.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} GitHub`}
                        style={{
                          color: theme.colors.icon.muted,
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        <GithubSmallIcon />
                      </a>
                    )}
                    {member.links.x && (
                      <a
                        href={member.links.x}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} X`}
                        style={{
                          color: theme.colors.icon.muted,
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        <XSmallIcon />
                      </a>
                    )}
                    {member.links.linkedin && (
                      <a
                        href={member.links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} LinkedIn`}
                        style={{
                          color: theme.colors.icon.muted,
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        <LinkedinSmallIcon />
                      </a>
                    )}
                    {member.links.website && (
                      <a
                        href={member.links.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${member.name} Website`}
                        style={{
                          color: theme.colors.icon.muted,
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        <Globe size={13} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
