"use client";

import React from "react";
import { theme } from "@/app/config";
import TagPill from "@/app/components/small/TagPill";
import AuthorMetadata from "@/app/components/medium/AuthorMetadata";
import ActionsButton from "@/app/components/medium/ActionsButton";

export interface CardViewProps {
  authorName?: string;
  avatarSrc?: string;
  topic?: string;
  timeAgo?: string;
  location?: string;
  title?: string;
  paragraphs?: string[];
  tags?: string[];
  initialScore?: number;
  isSolved?: boolean;
  onCommentClick?: () => void;
  onTagClick?: (tag: string) => void;
}

const DEFAULT_PARAGRAPHS = [
  "lakuin sesuatu dong!!",
  "kasian anak-anak aku yang masih pada kecil, seharusnya bisa bernafas dengan lega malah sengsara, padahal ini wilayah yang banyak pohon. Saking segitunya kah kalian sama uang sampe ngelupain tanggung jawab kalian terhadap masyarakat?",
  "Tetapkan bencana nasional dan mulai peduli kepada rakyatmu!",
];

const DEFAULT_TAGS = ["KebakaranHutan", "ToneDeaf", "Karhutla"];

export default function CardView({
  authorName = "Mira Sualifah",
  avatarSrc,
  topic = "BencanaNasional",
  timeAgo = "12d ago",
  location = "Kalimantan Utara",
  title = "Tolong dong pemerintah terkait, saya dan keluarga udah 1 minggu sesak nafas gara gara kebakaran.",
  paragraphs = DEFAULT_PARAGRAPHS,
  tags = DEFAULT_TAGS,
  initialScore = 995,
  isSolved = false,
  onCommentClick,
  onTagClick,
}: CardViewProps) {
  return (
    <article
      style={{
        backgroundColor: theme.colors.background.card,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "100%",
      }}
    >
      {/* TopCard: Author Metadata */}
      <AuthorMetadata
        mode="post"
        authorName={authorName}
        avatarSrc={avatarSrc}
        topic={topic}
        timeAgo={timeAgo}
        location={location}
        isSolved={isSolved}
      />

      {/* ValueCard: Content & Tags */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: theme.spacing.xs,
          padding: `0 ${theme.spacing.lg}`,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: theme.spacing.xxs,
            width: "100%",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.size.lg,
              fontWeight: theme.typography.weight.bold,
              color: theme.colors.text.primary,
              lineHeight: "normal",
              wordBreak: "break-word",
            }}
          >
            {title}
          </h2>

          <div
            style={{
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.size.sm,
              fontWeight: theme.typography.weight.regular,
              color: theme.colors.text.body,
              lineHeight: theme.typography.lineHeight.relaxed,
              wordBreak: "break-word",
            }}
          >
            {paragraphs.map((p, idx) => (
              <p key={idx} style={{ margin: 0 }}>
                {p}
              </p>
            ))}
          </div>
        </div>

        {tags.length > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: theme.spacing.xs,
            }}
          >
            {tags.map((tag) => (
              <TagPill key={tag} label={tag} onClick={onTagClick} />
            ))}
          </div>
        )}
      </div>

      {/* ActionsButton */}
      <ActionsButton
        initialScore={initialScore}
        onCommentClick={onCommentClick}
      />
    </article>
  );
}
