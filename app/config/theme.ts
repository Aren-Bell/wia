/**
 * Design Tokens & Theme Configuration
 * Semua komponen mengambil warna, ukuran font, spacing, dan radius dari sini.
 */
export const theme = {
  colors: {
    brand: {
      primary: "#0f8b8d",
      primaryHover: "#0c7274",
      primaryLight: "rgba(15, 139, 141, 0.1)",
    },
    background: {
      card: "#f9f9f9",
      navbar: "#f9f9f9",
      input: "#f1f1f1",
      page: "#f9f9f9",
      avatarPlaceholder: "#d9d9d9",
      hoverIcon: "rgba(0, 0, 0, 0.05)",
    },
    text: {
      primary: "#262626",      // Nama author, judul post (soft charcoal, bukan hitam pekat)
      secondary: "#404040",    // Lokasi (Kalimantan Utara)
      body: "#525252",         // Isi paragraf post & komentar, nav links, placeholder reply
      muted: "#737373",        // Counter vote (995), tombol Drafts, Select Topic
      timestamp: "#a9a9a9",    // Waktu post (12d ago)
      placeholder: "#c1c1c1",  // Placeholder Title & What's happening
      inverse: "#f9f9f9",      // Teks terang (bukan #ffffff pure)
      requiredAsterisk: "#740000", // Tanda bintang merah (*Title, *Select Topic)
    },
    border: {
      divider: "#c3c3c3",      // Garis pemisah tipis (1px)
      footerDivider: "#e5e5e5",
      navbarPill: "#dedede",   // Border tombol sekunder di Navbar (1px)
      tag: "#b6b6b6",          // Border pill tag (1px)
      secondaryButton: "#d4d4d4",
    },
    badge: {
      government: "#14ae5c",               // Centang hijau (Aparat / Pemda)
      governmentPillBg: "rgba(20, 174, 92, 0.3)", // Background pill solved di pojok kanan atas card
      internal: "#dc2626",                 // Centang merah (Tim Internal Dev)
    },
    icon: {
      default: "#525252",
      muted: "#737373",
      activeUpvote: "#0f8b8d",
      activeDownvote: "#dc2626",
      activeRepost: "#14ae5c",
    },
  },

  typography: {
    fontFamily: "var(--font-dm-sans), sans-serif",
    logoFontFamily: "var(--font-joti-one), cursive",
    size: {
      xs: "12px",   // Tag, tombol kecil, counter vote, closed thread text
      sm: "14px",   // Body post, komentar, lokasi, timestamp, input title
      md: "16px",   // Nama author, nama komunitas, nav links, judul kolom footer
      lg: "18px",   // Judul post utama
      logo: "32px", // Ukuran logo Kavi
    },
    weight: {
      regular: 400,
      medium: 500,
      bold: 700,
      extraBold: 800,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.4,
      relaxed: 1.6,
    },
  },

  spacing: {
    xxs: "4px",
    xs: "8px",
    sm: "10px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    heroOuterPaddingX: "16px", // Margin tipis kiri-kanan frame Hero ala Railway
    pagePaddingX: "72px", // 16px (hero luar) + 56px (hero dalam) supaya sejajar persis
    pageMaxWidth: "1440px",
    showcaseMaxWidth: "1140px", // Lebar konten Navbar, Showcase Box, dan Footer supaya rata kiri-kanan
    commentIndent: "40px", // Indentasi kiri isi komentar sejajar dengan avatar
  },

  radius: {
    sm: "10px",      // TagPill, input
    md: "14px",      // Card, Modal, InputComment, ClosedThread
    button: "9999px", // Pill-shaped button supaya halus & modern
    full: "9999px",  // Avatar, Solved badge pill
  },

  sizes: {
    avatar: {
      xs: 20, // ClosedThread resolver avatar
      sm: 24, // PostCreateModal author avatar
      md: 32, // CommentItem avatar
      lg: 40, // CardView main post avatar
    },
    formalPhoto: {
      sm: 48,
      md: 64, // Crew member square formal photo
      lg: 80,
    },
    icon: {
      xs: 14,
      sm: 16,
      md: 22,
      lg: 24,
      action: 26,
    },
  },
} as const;

export type Theme = typeof theme;
