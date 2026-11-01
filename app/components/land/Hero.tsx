"use client";

import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Play, MousePointer } from "lucide-react";
import { theme } from "@/app/config";
import CardView from "@/app/components/large/CardView";
import PostCreateModal from "@/app/components/large/PostCreateModal";
import PostPageView from "@/app/components/large/PostPageView";
import SolvedPostPageView from "@/app/components/large/SolvedPostPageView";
import { CommentItemProps } from "@/app/components/medium/CommentItem";

const STAGES = [
  { id: "create", label: "Write a Citizen Report" },
  { id: "card", label: "Gather Public Exposure" },
  { id: "discussion", label: "Discuss With Neighbors" },
  { id: "solved", label: "Verified Official Closure" },
] as const;

const REPORT_TITLE =
  "Tolong dong pemerintah terkait, saya dan keluarga udah 1 minggu sesak nafas gara gara kebakaran.";

const REPORT_PARAGRAPHS = [
  "lakuin sesuatu dong!!",
  "kasian anak-anak aku yang masih pada kecil, seharusnya bisa bernafas dengan lega malah sengsara, padahal ini wilayah yang banyak pohon. Saking segitunya kah kalian sama uang sampe ngelupain tanggung jawab kalian terhadap masyarakat?",
  "Tetapkan bencana nasional dan mulai peduli kepada rakyatmu!",
];

const REPORT_BODY_TEXT = REPORT_PARAGRAPHS.join("\n");

const AUTO_REPLY_TEXT =
  "Bener banget kak, di daerah kami asapnya juga makin pekat sejak kemarin sore. Semoga pemda cepat turun tangan kirim bantuan medis dan masker.";

const BASE_COMMENTS: CommentItemProps[] = [
  {
    authorName: "Mira Sualifah",
    timeAgo: "12d ago",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    initialScore: 995,
  },
];

const POSTED_COMMENTS: CommentItemProps[] = [
  {
    authorName: "Rizky Pratama",
    timeAgo: "Just now",
    content: AUTO_REPLY_TEXT,
    initialScore: 1,
  },
  ...BASE_COMMENTS,
];

const CANVAS_HEIGHT = 500;
const CANVAS_PADDING = 48;

const WORLD_DX = 860;
const WORLD_DY = 620;

const NODE_POSITIONS: ReadonlyArray<{ x: number; y: number }> = [
  { x: 0, y: 0 },
  { x: WORLD_DX, y: 0 },
  { x: WORLD_DX, y: WORLD_DY },
  { x: 0, y: WORLD_DY },
];

interface NodeMetric {
  scale: number;
  scaledW: number;
  scaledH: number;
}

const DEFAULT_METRICS: NodeMetric[] = [
  { scale: 1, scaledW: 460, scaledH: 340 },
  { scale: 0.88, scaledW: 598, scaledH: 320 },
  { scale: 0.72, scaledW: 490, scaledH: 450 },
  { scale: 0.72, scaledW: 490, scaledH: 455 },
];

function buildSteppedHorizontalPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  radius = 10
): string {
  const midX = (x1 + x2) / 2;
  const dirX = x2 >= x1 ? 1 : -1;
  const dirY = y2 >= y1 ? 1 : -1;
  const r = Math.min(
    radius,
    Math.abs(midX - x1) / 2,
    Math.abs(y2 - y1) / 2
  );

  if (r < 1) {
    return `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`;
  }

  return [
    `M ${x1} ${y1}`,
    `H ${midX - dirX * r}`,
    `Q ${midX} ${y1} ${midX} ${y1 + dirY * r}`,
    `V ${y2 - dirY * r}`,
    `Q ${midX} ${y2} ${midX + dirX * r} ${y2}`,
    `H ${x2}`,
  ].join(" ");
}

export default function Hero() {
  const [mode, setMode] = useState<"autoplay" | "interactive">("autoplay");
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [prevIndex, setPrevIndex] = useState<number>(0);
  const [hasMoved, setHasMoved] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<NodeMetric[]>(DEFAULT_METRICS);

  // State khusus animasi typewriter & dip-to-white saat mode === "autoplay"
  const [typedTitle, setTypedTitle] = useState<string>("");
  const [typedBody, setTypedBody] = useState<string>("");
  const [autoCommentExpanded, setAutoCommentExpanded] = useState<boolean>(false);
  const [typedReply, setTypedReply] = useState<string>("");
  const [replySubmitted, setReplySubmitted] = useState<boolean>(false);
  const [dipToWhite, setDipToWhite] = useState<boolean>(false);

  const stageViewportRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Array<HTMLDivElement | null>>([null, null, null, null]);

  const selectStage = (nextIndex: number) => {
    setDipToWhite(false);
    setActiveIndex((curr) => {
      if (curr === nextIndex) return curr;
      setPrevIndex(curr);
      setHasMoved(true);
      return nextIndex;
    });
  };

  // Skema Autoplay per Subtab (Typewriter -> Pan -> Dip-to-White -> Loop)
  useEffect(() => {
    if (mode !== "autoplay") return;

    const timers: Array<ReturnType<typeof setTimeout>> = [];
    let intervalId: ReturnType<typeof setInterval> | null = null;

    if (activeIndex === 0) {
      // Subtab 1: Pastikan dip-to-white langsung bersih, lalu Typewriter Title & Body
      setDipToWhite(false);
      setTypedTitle("");
      setTypedBody("");
      setAutoCommentExpanded(false);
      setTypedReply("");
      setReplySubmitted(false);

      let charStep = 0;
      const totalTitle = REPORT_TITLE.length;
      const totalBody = REPORT_BODY_TEXT.length;

      const startDelay = setTimeout(() => {
        intervalId = setInterval(() => {
          charStep += 3;
          if (charStep <= totalTitle) {
            setTypedTitle(REPORT_TITLE.slice(0, charStep));
          } else {
            setTypedTitle(REPORT_TITLE);
            const bodyChars = (charStep - totalTitle) * 2;
            if (bodyChars <= totalBody) {
              setTypedBody(REPORT_BODY_TEXT.slice(0, bodyChars));
            } else {
              setTypedBody(REPORT_BODY_TEXT);
              if (intervalId) clearInterval(intervalId);

              // Selesai ketik -> jeda sebentar lalu geser ke Subtab 2
              const nextTimer = setTimeout(() => {
                setPrevIndex(0);
                setHasMoved(true);
                setActiveIndex(1);
              }, 750);
              timers.push(nextTimer);
            }
          }
        }, 32);
      }, 550);

      timers.push(startDelay);
    } else if (activeIndex === 1) {
      // Subtab 2: CardView tampil hasil ketikan tadi
      setDipToWhite(false);
      setTypedTitle(REPORT_TITLE);
      setTypedBody(REPORT_BODY_TEXT);

      const nextTimer = setTimeout(() => {
        setPrevIndex(1);
        setHasMoved(true);
        setActiveIndex(2);
      }, 3000);
      timers.push(nextTimer);
    } else if (activeIndex === 2) {
      // Subtab 3: Buka InputComment -> Typewriter balasan warga -> Submit masuk ke list
      setDipToWhite(false);
      setAutoCommentExpanded(false);
      setTypedReply("");
      setReplySubmitted(false);

      const expandTimer = setTimeout(() => {
        setAutoCommentExpanded(true);
        let replyIdx = 0;

        intervalId = setInterval(() => {
          replyIdx += 3;
          if (replyIdx <= AUTO_REPLY_TEXT.length) {
            setTypedReply(AUTO_REPLY_TEXT.slice(0, replyIdx));
          } else {
            setTypedReply(AUTO_REPLY_TEXT);
            if (intervalId) clearInterval(intervalId);

            // Submit komentar
            const submitTimer = setTimeout(() => {
              setAutoCommentExpanded(false);
              setTypedReply("");
              setReplySubmitted(true);

              // Lanjut ke Subtab 4
              const toSolvedTimer = setTimeout(() => {
                setPrevIndex(2);
                setHasMoved(true);
                setActiveIndex(3);
              }, 1200);
              timers.push(toSolvedTimer);
            }, 450);
            timers.push(submitTimer);
          }
        }, 28);
      }, 1350);

      timers.push(expandTimer);
    } else if (activeIndex === 3) {
      // Subtab 4: SolvedPostPageView tampil -> Dip-to-white dengan quote -> Reset ke Subtab 1
      const dipInTimer = setTimeout(() => {
        setDipToWhite(true);
      }, 3600);
      timers.push(dipInTimer);

      const loopBackTimer = setTimeout(() => {
        setHasMoved(false);
        setPrevIndex(0);
        setActiveIndex(0);
      }, 5600);
      timers.push(loopBackTimer);
    }

    return () => {
      timers.forEach(clearTimeout);
      if (intervalId) clearInterval(intervalId);
    };
  }, [activeIndex, mode]);

  useLayoutEffect(() => {
    const viewportEl = stageViewportRef.current;
    if (!viewportEl) return;

    const updateAllMetrics = () => {
      const availW = viewportEl.clientWidth - CANVAS_PADDING;
      const availH = viewportEl.clientHeight - CANVAS_PADDING;
      if (availW <= 0 || availH <= 0) return;

      const nextMetrics = nodeRefs.current.map((el, idx) => {
        if (!el) return DEFAULT_METRICS[idx];
        const naturalW = el.offsetWidth;
        const naturalH = el.offsetHeight;
        if (!naturalW || !naturalH) return DEFAULT_METRICS[idx];

        const s = Math.min(1, availW / naturalW, availH / naturalH);
        return {
          scale: s,
          scaledW: naturalW * s,
          scaledH: naturalH * s,
        };
      });

      setMetrics(nextMetrics);
    };

    updateAllMetrics();

    const observer = new ResizeObserver(updateAllMetrics);
    observer.observe(viewportEl);
    nodeRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const activePos = NODE_POSITIONS[activeIndex];

  const m0 = metrics[0];
  const m1 = metrics[1];
  const m2 = metrics[2];
  const m3 = metrics[3];

  const line01 = buildSteppedHorizontalPath(
    NODE_POSITIONS[0].x + m0.scaledW / 2,
    NODE_POSITIONS[0].y + 28,
    NODE_POSITIONS[1].x - m1.scaledW / 2,
    NODE_POSITIONS[1].y - 28,
    10
  );

  const line12X = NODE_POSITIONS[1].x - 90;
  const line12 = `M ${line12X} ${NODE_POSITIONS[1].y + m1.scaledH / 2} V ${
    NODE_POSITIONS[2].y - m2.scaledH / 2
  }`;

  const line23 = buildSteppedHorizontalPath(
    NODE_POSITIONS[2].x - m2.scaledW / 2,
    NODE_POSITIONS[2].y + 28,
    NODE_POSITIONS[3].x + m3.scaledW / 2,
    NODE_POSITIONS[3].y - 28,
    10
  );

  const isAutoplay = mode === "autoplay";

  // Delay bertahap kalau user loncat beberapa subtab sekaligus
  const getConnectorDelay = (idx: number) => {
    if (!hasMoved) return 0;
    if (activeIndex > prevIndex && idx >= prevIndex && idx < activeIndex) {
      return (idx - prevIndex) * 0.45;
    }
    if (activeIndex < prevIndex && idx >= activeIndex && idx < prevIndex) {
      return (prevIndex - 1 - idx) * 0.3;
    }
    return 0;
  };

  const connectors = [
    { id: "01", d: line01, isLit: activeIndex >= 1, delay: getConnectorDelay(0) },
    { id: "12", d: line12, isLit: activeIndex >= 2, delay: getConnectorDelay(1) },
    { id: "23", d: line23, isLit: activeIndex >= 3, delay: getConnectorDelay(2) },
  ];

  return (
    <section
      style={{
        width: "100%",
        maxWidth: theme.spacing.pageMaxWidth,
        margin: "0 auto",
        padding: `8px ${theme.spacing.heroOuterPaddingX} 72px`,
        boxSizing: "border-box",
      }}
    >
      {/* Railway-Style Framed Backdrop Using /chalkboard.jpg */}
      <div
        style={{
          position: "relative",
          width: "100%",
          borderRadius: theme.radius.md,
          overflow: "hidden",
          backgroundImage: `linear-gradient(180deg, rgba(12, 26, 20, 0.56) 0%, rgba(12, 26, 20, 0.38) 62%, rgba(12, 26, 20, 0.16) 100%), url("/chalkboard.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
          border: `1px solid ${theme.colors.border.divider}`,
          padding: "116px 56px 84px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "96px",
        }}
      >
        {/* Top Hero Copy + 2 Action Buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "20px",
            maxWidth: "680px",
            margin: "0 auto",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontFamily: theme.typography.fontFamily,
              fontSize: "48px",
              fontWeight: theme.typography.weight.extraBold,
              color: theme.colors.text.inverse,
              lineHeight: 1.12,
              letterSpacing: "-0.02em",
            }}
          >
            Speak Up About Local Issues
          </h1>

          <p
            style={{
              margin: 0,
              fontFamily: theme.typography.fontFamily,
              fontSize: "18px",
              fontWeight: theme.typography.weight.regular,
              color: "rgba(249, 249, 249, 0.88)",
              lineHeight: 1.5,
            }}
          >
            An open public space where Indonesian citizens report daily problems,
            support each other, and get verified responses from authorities.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginTop: "12px",
            }}
          >
            <button
              type="button"
              onClick={() => selectStage(1)}
              style={{
                height: "42px",
                padding: "0 22px",
                borderRadius: theme.radius.button,
                backgroundColor: "rgba(18, 35, 27, 0.65)",
                border: "1px solid rgba(249, 249, 249, 0.32)",
                color: theme.colors.text.inverse,
                fontFamily: theme.typography.fontFamily,
                fontSize: theme.typography.size.sm,
                fontWeight: theme.typography.weight.bold,
                cursor: "pointer",
              }}
            >
              Explore Reports
            </button>

            <button
              type="button"
              onClick={() => selectStage(0)}
              style={{
                height: "42px",
                padding: "0 22px",
                borderRadius: theme.radius.button,
                backgroundColor: theme.colors.brand.primary,
                border: `1px solid ${theme.colors.brand.primary}`,
                color: theme.colors.text.inverse,
                fontFamily: theme.typography.fontFamily,
                fontSize: theme.typography.size.sm,
                fontWeight: theme.typography.weight.bold,
                cursor: "pointer",
              }}
            >
              Report an Issue
            </button>
          </div>
        </div>

        {/* Interactive Window */}
        <div
          style={{
            width: "100%",
            maxWidth: theme.spacing.showcaseMaxWidth,
            margin: "0 auto",
          }}
        >
          {/* Interactive Window (Top Bar + Full-Width 2D Canvas) */}
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              border: "1px solid rgba(249, 249, 249, 0.22)",
              borderRadius: theme.radius.md,
              backgroundColor: theme.colors.background.card,
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.28)",
              overflow: "hidden",
            }}
          >
            {/* Window Top Bar: Left 3 macOS Dots + Right Subtabs & Play/Pointer Toggle */}
            <div
              style={{
                height: "48px",
                padding: "0 20px",
                backgroundColor: theme.colors.background.card,
                borderBottom: `1px solid ${theme.colors.border.divider}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
                boxSizing: "border-box",
                zIndex: 2,
              }}
            >
              {/* Left: 3 Dots ala macOS */}
              <div
                aria-hidden="true"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    width: "11px",
                    height: "11px",
                    borderRadius: "50%",
                    backgroundColor: "#ff5f56",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    width: "11px",
                    height: "11px",
                    borderRadius: "50%",
                    backgroundColor: "#ffbd2e",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    width: "11px",
                    height: "11px",
                    borderRadius: "50%",
                    backgroundColor: "#27c93f",
                    display: "inline-block",
                  }}
                />
              </div>

              {/* Right: Horizontal Subtab Buttons + Play/Pointer Toggle Icons */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                  gap: "12px",
                }}
              >
                <div
                  role="tablist"
                  aria-label="Report stages"
                  style={{
                    display: "flex",
                    alignItems: "stretch",
                    height: "100%",
                    gap: "4px",
                  }}
                >
                  {STAGES.map((stage, idx) => {
                    const isActive = activeIndex === idx;

                    return (
                      <button
                        key={stage.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => selectStage(idx)}
                        style={{
                          height: "100%",
                          padding: "0 14px",
                          backgroundColor: "transparent",
                          border: "none",
                          borderBottom: isActive
                            ? `2px solid ${theme.colors.brand.primary}`
                            : "2px solid transparent",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          fontFamily: theme.typography.fontFamily,
                          fontSize: theme.typography.size.xs,
                          fontWeight: isActive
                            ? theme.typography.weight.bold
                            : theme.typography.weight.regular,
                          color: isActive
                            ? theme.colors.text.primary
                            : theme.colors.text.muted,
                          transition:
                            "color 0.15s ease, border-color 0.15s ease",
                          whiteSpace: "nowrap",
                          boxSizing: "border-box",
                        }}
                      >
                        {stage.label}
                      </button>
                    );
                  })}
                </div>

                {/* Vertical Divider */}
                <span
                  aria-hidden="true"
                  style={{
                    width: "1px",
                    height: "20px",
                    backgroundColor: theme.colors.border.divider,
                    flexShrink: 0,
                  }}
                />

                {/* Play & Pointer Mode Toggle */}
                <div
                  role="group"
                  aria-label="Canvas mode"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <button
                    type="button"
                    title="Autoplay mode"
                    aria-label="Autoplay mode"
                    aria-pressed={isAutoplay}
                    onClick={() => setMode("autoplay")}
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: theme.radius.button,
                      border: "none",
                      backgroundColor: isAutoplay
                        ? theme.colors.brand.primaryLight
                        : "transparent",
                      color: isAutoplay
                        ? theme.colors.brand.primary
                        : theme.colors.icon.muted,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "background-color 0.15s ease, color 0.15s ease",
                    }}
                  >
                    <Play size={15} />
                  </button>

                  <button
                    type="button"
                    title="Interactive mode"
                    aria-label="Interactive mode"
                    aria-pressed={!isAutoplay}
                    onClick={() => {
                      setDipToWhite(false);
                      setMode("interactive");
                    }}
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: theme.radius.button,
                      border: "none",
                      backgroundColor: !isAutoplay
                        ? theme.colors.brand.primaryLight
                        : "transparent",
                      color: !isAutoplay
                        ? theme.colors.brand.primary
                        : theme.colors.icon.muted,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "background-color 0.15s ease, color 0.15s ease",
                    }}
                  >
                    <MousePointer size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom: Full-Width 2D Panning World Canvas */}
            <div
              ref={stageViewportRef}
              role="tabpanel"
              style={{
                width: "100%",
                height: `${CANVAS_HEIGHT}px`,
                backgroundColor: "#f3f3f3",
                backgroundImage:
                  "radial-gradient(#d6d6d6 1px, transparent 1px)",
                backgroundSize: "20px 20px",
                overflow: "hidden",
                position: "relative",
                boxSizing: "border-box",
              }}
            >
              {/* Camera World Layer (diperlambat supaya proses loading garis putus-putus terlihat jelas) */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: 0,
                  height: 0,
                  transform: `translate3d(${-activePos.x}px, ${-activePos.y}px, 0)`,
                  transition: hasMoved
                    ? "transform 1.5s cubic-bezier(0.25, 1, 0.5, 1)"
                    : "none",
                }}
              >
                <svg
                  aria-hidden="true"
                  width="2600"
                  height="1800"
                  viewBox="-600 -500 2600 1800"
                  fill="none"
                  style={{
                    position: "absolute",
                    left: "-600px",
                    top: "-500px",
                    pointerEvents: "none",
                    overflow: "visible",
                  }}
                >
                  <style>{`
                    @keyframes kaviLeadArrow-01 {
                      0% { opacity: 0; }
                      4% { opacity: 1; }
                      92% { opacity: 1; }
                      100% { opacity: 0; }
                    }
                    @keyframes kaviLeadArrow-12 {
                      0% { opacity: 0; }
                      4% { opacity: 1; }
                      92% { opacity: 1; }
                      100% { opacity: 0; }
                    }
                    @keyframes kaviLeadArrow-23 {
                      0% { opacity: 0; }
                      4% { opacity: 1; }
                      92% { opacity: 1; }
                      100% { opacity: 0; }
                    }
                  `}</style>
                  <defs>
                    {connectors.map((c) => (
                      <mask
                        key={c.id}
                        id={`kavi-conn-mask-${c.id}`}
                        maskUnits="userSpaceOnUse"
                        x="-600"
                        y="-500"
                        width="2600"
                        height="1800"
                      >
                        <path
                          d={c.d}
                          pathLength={1}
                          stroke="#ffffff"
                          strokeWidth="12"
                          strokeLinecap="butt"
                          fill="none"
                          style={{
                            strokeDasharray: 1,
                            strokeDashoffset: c.isLit ? 0 : 1,
                            transition: hasMoved
                              ? `stroke-dashoffset 1.35s ease-in-out ${c.delay}s`
                              : "none",
                          }}
                        />
                      </mask>
                    ))}
                  </defs>

                  {connectors.map((c) => (
                    <g key={c.id}>
                      {/* Base Dashed Track: Abu-abu senada border kartu (#c3c3c3) */}
                      <path
                        d={c.d}
                        stroke={theme.colors.border.divider}
                        strokeWidth="1.5"
                        strokeDasharray="6 6"
                        strokeLinecap="round"
                      />

                      {/* Active Transitive Loading Track: Menyala 1 per 1 berurutan ke warna brand (#0f8b8d) */}
                      <path
                        d={c.d}
                        stroke={theme.colors.brand.primary}
                        strokeWidth="1.5"
                        strokeDasharray="6 6"
                        strokeLinecap="round"
                        mask={`url(#kavi-conn-mask-${c.id})`}
                      />

                      {/* Leading Edge Arrow (>): Segmen paling depan berubah jadi > selama berjalan, lalu balik jadi garis biasa */}
                      <g
                        style={{
                          offsetPath: `path("${c.d}")`,
                          offsetDistance: c.isLit ? "100%" : "0%",
                          offsetRotate: "auto",
                          opacity: c.isLit && hasMoved ? 0 : 0,
                          animation:
                            c.isLit && hasMoved
                              ? `kaviLeadArrow-${c.id} 1.35s ease-in-out ${c.delay}s forwards`
                              : "none",
                          transition: hasMoved
                            ? `offset-distance 1.35s ease-in-out ${c.delay}s`
                            : "none",
                        }}
                      >
                        {/* Tutup segmen garis tepat di posisi arrow supaya garis itu berubah bentuk jadi > */}
                        <circle cx="-2" cy="0" r="6" fill="#f3f3f3" />
                        <path
                          d="M -5 -4 L 1 0 L -5 4"
                          stroke={theme.colors.brand.primary}
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                      </g>
                    </g>
                  ))}
                </svg>

                {STAGES.map((stage, idx) => {
                  const pos = NODE_POSITIONS[idx];
                  const m = metrics[idx] ?? DEFAULT_METRICS[idx];
                  const isActive = activeIndex === idx;
                  const isInitialFirst = !hasMoved && idx === 0;

                  return (
                    <div
                      key={stage.id}
                      style={{
                        position: "absolute",
                        left: `${pos.x}px`,
                        top: `${pos.y}px`,
                        transform: "translate(-50%, -50%)",
                        opacity: isActive ? 1 : 0,
                        transition: isInitialFirst
                          ? "none"
                          : isActive
                          ? "opacity 0.9s ease-out 0.35s"
                          : "opacity 0.9s ease-in",
                        pointerEvents: isActive ? "auto" : "none",
                      }}
                    >
                      <div
                        ref={(el) => {
                          nodeRefs.current[idx] = el;
                        }}
                        style={{
                          width: idx === 0 ? "460px" : "680px",
                          borderRadius: theme.radius.md,
                          overflow: "hidden",
                          border: `1px solid ${theme.colors.border.divider}`,
                          backgroundColor: theme.colors.background.card,
                          transform: `scale(${m.scale})`,
                          transformOrigin: "center center",
                          transition: "transform 0.2s ease",
                        }}
                      >
                        {idx === 0 && (
                          <PostCreateModal
                            controlledTitle={isAutoplay ? typedTitle : undefined}
                            controlledBody={isAutoplay ? typedBody : undefined}
                          />
                        )}
                        {idx === 1 && (
                          <CardView
                            title={REPORT_TITLE}
                            paragraphs={REPORT_PARAGRAPHS}
                          />
                        )}
                        {idx === 2 && (
                          <PostPageView
                            postProps={{
                              title: REPORT_TITLE,
                              paragraphs: REPORT_PARAGRAPHS,
                            }}
                            controlledCommentExpanded={
                              isAutoplay ? autoCommentExpanded : undefined
                            }
                            controlledCommentText={
                              isAutoplay ? typedReply : undefined
                            }
                            controlledComments={
                              isAutoplay
                                ? replySubmitted
                                  ? POSTED_COMMENTS
                                  : BASE_COMMENTS
                                : undefined
                            }
                          />
                        )}
                        {idx === 3 && (
                          <SolvedPostPageView
                            closedByType="government"
                            postProps={{
                              title: REPORT_TITLE,
                              paragraphs: REPORT_PARAGRAPHS,
                            }}
                            comments={
                              replySubmitted ? POSTED_COMMENTS : BASE_COMMENTS
                            }
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dip-to-White Overlay Before Looping Back to Subtab 1 */}
              <div
                aria-hidden={!dipToWhite}
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: theme.colors.background.card,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "24px",
                  textAlign: "center",
                  opacity: dipToWhite ? 1 : 0,
                  pointerEvents: dipToWhite ? "auto" : "none",
                  transition: "opacity 0.55s ease",
                  zIndex: 10,
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontFamily: theme.typography.fontFamily,
                    fontSize: "24px",
                    fontWeight: theme.typography.weight.bold,
                    color: theme.colors.text.primary,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Your pain is our pain.{" "}
                  <span style={{ color: theme.colors.brand.primary }}>
                    #VoicePublicIssues
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
