"use client";

import React, { useState, useRef } from "react";
import { Share2, ShieldCheck, ChevronsLeftRight } from "lucide-react";
import { theme } from "@/app/config";
import TagPill from "@/app/components/small/TagPill";
import Badge from "@/app/components/small/Badge";

interface MapDot {
  id: number;
  x: number;
  y: number;
  isHub?: boolean;
}

// Koordinat dot-dot di dalam minimap (viewBox 0 0 400 400, center di 200,200)
const MINIMAP_DOTS: ReadonlyArray<MapDot> = [
  // Pusat Otoritas / Hub Utama
  { id: 0, x: 200, y: 196, isHub: true },

  // Cluster Barat Laut
  { id: 1, x: 138, y: 108 },
  { id: 2, x: 124, y: 138 },
  { id: 3, x: 158, y: 132 },

  // Cluster Barat Daya (rapat seperti referensi minimap)
  { id: 4, x: 104, y: 194 },
  { id: 5, x: 148, y: 202 },
  { id: 6, x: 144, y: 226 },
  { id: 7, x: 128, y: 244 },
  { id: 8, x: 158, y: 246 },
  { id: 9, x: 144, y: 266 },
  { id: 10, x: 118, y: 218 },

  // Cluster Timur Laut
  { id: 11, x: 256, y: 156 },
  { id: 12, x: 292, y: 168 },
  { id: 13, x: 278, y: 198 },
  { id: 14, x: 242, y: 126 },

  // Cluster Tenggara (rapat seperti referensi minimap)
  { id: 15, x: 244, y: 252 },
  { id: 16, x: 268, y: 254 },
  { id: 17, x: 262, y: 274 },
  { id: 18, x: 242, y: 288 },
  { id: 19, x: 286, y: 268 },
  { id: 20, x: 226, y: 314 },

  // Titik pinggir penghubung jaringan
  { id: 21, x: 192, y: 116 },
  { id: 22, x: 196, y: 288 },
  { id: 23, x: 308, y: 224 },
];

// Pasangan garis penghubung antar dot untuk state After (jaringan terhubung)
const NETWORK_EDGES: ReadonlyArray<[number, number]> = [
  // Koneksi di Cluster Barat Laut
  [1, 2],
  [1, 3],
  [2, 3],
  [1, 21],
  [3, 0],
  [21, 0],

  // Koneksi di Cluster Barat Daya
  [4, 10],
  [10, 5],
  [5, 6],
  [6, 7],
  [6, 8],
  [7, 9],
  [8, 9],
  [2, 4],
  [5, 0],
  [8, 22],

  // Koneksi di Cluster Timur Laut
  [14, 21],
  [14, 11],
  [11, 12],
  [12, 13],
  [11, 13],
  [11, 0],
  [13, 0],
  [13, 23],

  // Koneksi di Cluster Tenggara
  [15, 16],
  [16, 17],
  [15, 17],
  [17, 18],
  [16, 19],
  [17, 19],
  [18, 20],
  [18, 22],
  [15, 0],
  [16, 13],
  [19, 23],
  [22, 0],
];

const FEATURE_TAGS = ["KebakaranHutan", "ToneDeaf", "Karhutla"];

export default function NetworkSection() {
  // Posisi pembagi slider (0 - 100%). Kiri = Before (redup abu), Kanan = After (hijau terhubung)
  const [sliderPct, setSliderPct] = useState<number>(46);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const updateSliderFromClientX = (clientX: number) => {
    const el = mapContainerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const rawPct = ((clientX - rect.left) / rect.width) * 100;
    const clamped = Math.max(6, Math.min(94, rawPct));
    setSliderPct(clamped);
  };

  return (
    <section
      style={{
        width: "100%",
        maxWidth: theme.spacing.pageMaxWidth,
        margin: "0 auto",
        padding: `40px ${theme.spacing.pagePaddingX} 96px`,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: theme.spacing.showcaseMaxWidth,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "64px",
          flexWrap: "wrap",
        }}
      >
        {/* Left Column: Narrative + Divider Points */}
        <div
          style={{
            flex: "1 1 420px",
            maxWidth: "480px",
            display: "flex",
            flexDirection: "column",
            gap: "28px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontFamily: theme.typography.fontFamily,
                fontSize: "36px",
                fontWeight: theme.typography.weight.extraBold,
                color: theme.colors.text.primary,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
              }}
            >
              No More Isolated Voices.
              <br />
              Every Report Connects.
            </h2>

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
              Individual complaints on social media fade away in isolation. Kavi
              connects reports from citizens in the same area into a unified
              local network that authorities cannot ignore.
            </p>
          </div>

          {/* Divider Feature List (Railway Style) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              borderTop: `1px solid ${theme.colors.border.divider}`,
            }}
          >
            {/* Row 1 */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "14px",
                padding: "18px 0",
                borderBottom: `1px solid ${theme.colors.border.divider}`,
              }}
            >
              <div
                style={{
                  marginTop: "2px",
                  color: theme.colors.brand.primary,
                  flexShrink: 0,
                }}
              >
                <Share2 size={18} />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <span
                  style={{
                    fontFamily: theme.typography.fontFamily,
                    fontSize: theme.typography.size.sm,
                    fontWeight: theme.typography.weight.bold,
                    color: theme.colors.text.primary,
                  }}
                >
                  Connected Citizen Nodes
                </span>
                <span
                  style={{
                    fontFamily: theme.typography.fontFamily,
                    fontSize: theme.typography.size.sm,
                    fontWeight: theme.typography.weight.regular,
                    color: theme.colors.text.muted,
                    lineHeight: 1.45,
                  }}
                >
                  Nearby reports with matching locations and tags automatically
                  link together to amplify public exposure.
                </span>
              </div>
            </div>

            {/* Row 2 */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "14px",
                padding: "18px 0",
                borderBottom: `1px solid ${theme.colors.border.divider}`,
              }}
            >
              <div
                style={{
                  marginTop: "2px",
                  color: theme.colors.badge.government,
                  flexShrink: 0,
                }}
              >
                <ShieldCheck size={18} />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <span
                  style={{
                    fontFamily: theme.typography.fontFamily,
                    fontSize: theme.typography.size.sm,
                    fontWeight: theme.typography.weight.bold,
                    color: theme.colors.text.primary,
                  }}
                >
                  Direct Regional Routing
                </span>
                <span
                  style={{
                    fontFamily: theme.typography.fontFamily,
                    fontSize: theme.typography.size.sm,
                    fontWeight: theme.typography.weight.regular,
                    color: theme.colors.text.muted,
                    lineHeight: 1.45,
                  }}
                >
                  Connected issue clusters route straight to verified local
                  governments until an official response closes the thread.
                </span>
              </div>
            </div>

            {/* Row 3: Active Cluster Tags */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                paddingTop: "18px",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontFamily: theme.typography.fontFamily,
                  fontSize: theme.typography.size.xs,
                  fontWeight: theme.typography.weight.bold,
                  color: theme.colors.text.secondary,
                }}
              >
                Active Clusters
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: theme.spacing.xs,
                  flexWrap: "wrap",
                }}
              >
                {FEATURE_TAGS.map((tag) => (
                  <TagPill key={tag} label={tag} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Before/After Minimap Network Card */}
        <div
          style={{
            flex: "1 1 480px",
            maxWidth: "560px",
            backgroundColor: theme.colors.background.card,
            border: `1px solid ${theme.colors.border.divider}`,
            borderRadius: theme.radius.md,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Top Header Bar */}
          <div
            style={{
              height: "44px",
              padding: "0 18px",
              borderBottom: `1px solid ${theme.colors.border.divider}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: theme.colors.background.card,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  fontFamily: theme.typography.fontFamily,
                  fontSize: theme.typography.size.xs,
                  fontWeight: theme.typography.weight.bold,
                  color: theme.colors.text.primary,
                }}
              >
                Kalimantan Utara Sector
              </span>
              <Badge type="government" />
            </div>

            <span
              style={{
                fontFamily: theme.typography.fontFamily,
                fontSize: theme.typography.size.xs,
                fontWeight: theme.typography.weight.regular,
                color: theme.colors.text.muted,
              }}
            >
              Drag slider to connect reports
            </span>
          </div>

          {/* Interactive Before / After Minimap Area */}
          <div
            ref={mapContainerRef}
            onPointerDown={(e) => {
              setIsDragging(true);
              e.currentTarget.setPointerCapture(e.pointerId);
              updateSliderFromClientX(e.clientX);
            }}
            onPointerMove={(e) => {
              if (!isDragging) return;
              updateSliderFromClientX(e.clientX);
            }}
            onPointerUp={() => setIsDragging(false)}
            onPointerCancel={() => setIsDragging(false)}
            style={{
              position: "relative",
              width: "100%",
              height: "420px",
              backgroundColor: "#f3f3f3",
              backgroundImage: "radial-gradient(#d6d6d6 1px, transparent 1px)",
              backgroundSize: "18px 18px",
              cursor: "ew-resize",
              userSelect: "none",
              touchAction: "none",
              overflow: "hidden",
            }}
          >
            {/* LAYER 1 (BEFORE - Left Side): Minimap dengan Dot Redup Abu & Terisolasi */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="360"
                height="360"
                viewBox="0 0 400 400"
                fill="none"
                style={{ width: "360px", height: "360px", display: "block" }}
              >
                {/* Lingkaran Radar Minimap (Redup) */}
                <circle
                  cx="200"
                  cy="200"
                  r="176"
                  fill="#ebebeb"
                  stroke={theme.colors.border.divider}
                  strokeWidth="2"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="130"
                  stroke="#d8d8d8"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="80"
                  stroke="#d8d8d8"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />

                {/* Garis Kontur Wilayah Redup */}
                <path
                  d="M 70 150 Q 130 110, 190 140 T 320 130"
                  stroke="#dddddd"
                  strokeWidth="1.2"
                  fill="none"
                />
                <path
                  d="M 65 250 Q 150 280, 220 240 T 335 260"
                  stroke="#dddddd"
                  strokeWidth="1.2"
                  fill="none"
                />

                {/* Indikator Utara (N) ala Minimap */}
                <rect
                  x="188"
                  y="12"
                  width="24"
                  height="20"
                  rx="6"
                  fill={theme.colors.background.card}
                  stroke={theme.colors.border.divider}
                  strokeWidth="1"
                />
                <text
                  x="200"
                  y="26"
                  textAnchor="middle"
                  fill={theme.colors.text.muted}
                  fontSize="11"
                  fontWeight="700"
                  fontFamily={theme.typography.fontFamily}
                >
                  N
                </text>

                {/* Dot-Dot Warga Redup Abu (Belum Terhubung) */}
                {MINIMAP_DOTS.map((dot) => (
                  <g key={`before-${dot.id}`}>
                    <circle
                      cx={dot.x}
                      cy={dot.y}
                      r={dot.isHub ? 9 : 6.5}
                      fill="#dcdcdc"
                      stroke="#9e9e9e"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx={dot.x}
                      cy={dot.y}
                      r={dot.isHub ? 4 : 3}
                      fill="#8c8c8c"
                    />
                  </g>
                ))}
              </svg>

              {/* Label Pojok Kiri Atas: Before */}
              <div
                style={{
                  position: "absolute",
                  top: "14px",
                  left: "16px",
                  padding: "4px 10px",
                  borderRadius: theme.radius.button,
                  backgroundColor: theme.colors.background.card,
                  border: `1px solid ${theme.colors.border.divider}`,
                  fontFamily: theme.typography.fontFamily,
                  fontSize: theme.typography.size.xs,
                  fontWeight: theme.typography.weight.medium,
                  color: theme.colors.text.muted,
                }}
              >
                Before: Isolated Reports
              </div>
            </div>

            {/* LAYER 2 (AFTER - Right Side): Minimap Cerah + Jaringan Garis & Dot Hijau */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                clipPath: `inset(0 0 0 ${sliderPct}%)`,
                backgroundColor: "#eef6f6",
                backgroundImage: "radial-gradient(#bdd8d8 1px, transparent 1px)",
                backgroundSize: "18px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="360"
                height="360"
                viewBox="0 0 400 400"
                fill="none"
                style={{ width: "360px", height: "360px", display: "block" }}
              >
                <style>{`
                  @keyframes kaviNetPulse {
                    to {
                      stroke-dashoffset: -20;
                    }
                  }
                `}</style>

                {/* Lingkaran Radar Minimap (Cerah / Terhubung) */}
                <circle
                  cx="200"
                  cy="200"
                  r="176"
                  fill="#f4fbf9"
                  stroke={theme.colors.brand.primary}
                  strokeWidth="2"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="130"
                  stroke="rgba(15, 139, 141, 0.25)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="80"
                  stroke="rgba(15, 139, 141, 0.25)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />

                {/* Garis Kontur Wilayah Cerah */}
                <path
                  d="M 70 150 Q 130 110, 190 140 T 320 130"
                  stroke="rgba(20, 174, 92, 0.18)"
                  strokeWidth="1.2"
                  fill="none"
                />
                <path
                  d="M 65 250 Q 150 280, 220 240 T 335 260"
                  stroke="rgba(20, 174, 92, 0.18)"
                  strokeWidth="1.2"
                  fill="none"
                />

                {/* Indikator Utara (N) Aktif */}
                <rect
                  x="188"
                  y="12"
                  width="24"
                  height="20"
                  rx="6"
                  fill={theme.colors.brand.primary}
                />
                <text
                  x="200"
                  y="26"
                  textAnchor="middle"
                  fill={theme.colors.text.inverse}
                  fontSize="11"
                  fontWeight="700"
                  fontFamily={theme.typography.fontFamily}
                >
                  N
                </text>

                {/* Jaringan Garis Penghubung Antar Dot (Seperti Visualisasi Internet) */}
                {NETWORK_EDGES.map(([fromIdx, toIdx], idx) => {
                  const a = MINIMAP_DOTS[fromIdx];
                  const b = MINIMAP_DOTS[toIdx];
                  const isMainLink = a.isHub || b.isHub;

                  return (
                    <g key={`edge-${idx}`}>
                      <line
                        x1={a.x}
                        y1={a.y}
                        x2={b.x}
                        y2={b.y}
                        stroke={
                          isMainLink
                            ? theme.colors.brand.primary
                            : "rgba(20, 174, 92, 0.55)"
                        }
                        strokeWidth={isMainLink ? "1.8" : "1.3"}
                        strokeDasharray={isMainLink ? "5 5" : "none"}
                        style={
                          isMainLink
                            ? { animation: "kaviNetPulse 1.1s linear infinite" }
                            : undefined
                        }
                      />
                    </g>
                  );
                })}

                {/* Dot-Dot Warga Hijau Terhubung */}
                {MINIMAP_DOTS.map((dot) => (
                  <g key={`after-${dot.id}`}>
                    <circle
                      cx={dot.x}
                      cy={dot.y}
                      r={dot.isHub ? 12 : 7.5}
                      fill={
                        dot.isHub
                          ? "rgba(15, 139, 141, 0.22)"
                          : "rgba(20, 174, 92, 0.22)"
                      }
                      stroke={
                        dot.isHub
                          ? theme.colors.brand.primary
                          : theme.colors.badge.government
                      }
                      strokeWidth="1.6"
                    />
                    <circle
                      cx={dot.x}
                      cy={dot.y}
                      r={dot.isHub ? 5.5 : 3.8}
                      fill={
                        dot.isHub
                          ? theme.colors.brand.primary
                          : theme.colors.badge.government
                      }
                    />
                  </g>
                ))}
              </svg>

              {/* Label Pojok Kanan Atas: After */}
              <div
                style={{
                  position: "absolute",
                  top: "14px",
                  right: "16px",
                  padding: "4px 10px",
                  borderRadius: theme.radius.button,
                  backgroundColor: theme.colors.background.card,
                  border: `1px solid ${theme.colors.badge.government}`,
                  fontFamily: theme.typography.fontFamily,
                  fontSize: theme.typography.size.xs,
                  fontWeight: theme.typography.weight.bold,
                  color: theme.colors.badge.government,
                }}
              >
                After: Connected Network
              </div>
            </div>

            {/* Garis Pembagi Slider Vertikal + Handle Tengah */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: `${sliderPct}%`,
                width: "2px",
                backgroundColor: theme.colors.brand.primary,
                transform: "translateX(-50%)",
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "34px",
                  height: "34px",
                  borderRadius: theme.radius.full,
                  backgroundColor: theme.colors.background.card,
                  border: `1.5px solid ${theme.colors.brand.primary}`,
                  color: theme.colors.brand.primary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                }}
              >
                <ChevronsLeftRight size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
