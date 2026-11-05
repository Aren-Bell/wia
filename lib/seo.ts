import { Metadata } from "next";

const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://kavi.id").replace(/\/$/, "");

export interface PostSeoData {
  id: string;
  title: string;
  content: string;
  images?: string[] | null;
  locationName?: string | null;
  province?: string | null;
  status: string;
  closeType?: string | null;
  upvotesCount: number;
  commentsCount: number;
  postedAt: Date | number;
  updatedAt: Date | number;
  author: {
    name: string;
    username: string;
    image?: string | null;
    role?: string;
    agencyName?: string | null;
  };
  topic?: {
    name: string;
    slug: string;
  } | null;
  resolutionComment?: {
    content: string;
    createdAt: Date | number;
    author: {
      name: string;
      agencyName?: string | null;
    };
  } | null;
}

/**
 * Generates automated clean 160-char description for SEO meta tags
 */
export function generateSmartDescription(post: PostSeoData): string {
  const statusBadge =
    post.status === "CLOSED"
      ? post.closeType === "SOLVED"
        ? "[SOLVED]"
        : "[SELESAI]"
      : "[LAPORAN AKTIF]";

  const locationPart = post.locationName
    ? `${post.locationName}, ${post.province || ""}`.trim()
    : post.province || "Indonesia";

  const cleanBody = post.content.replace(/\s+/g, " ").trim();
  const summaryPrefix = `${statusBadge} ${locationPart} — ${cleanBody}`;

  if (summaryPrefix.length <= 155) {
    return summaryPrefix;
  }

  return summaryPrefix.slice(0, 152) + "...";
}

/**
 * Generates dynamic Next.js Metadata for civic report detail pages
 */
export function generatePostMetadata(post: PostSeoData): Metadata {
  const title = `${post.title} | Kavi`;
  const description = generateSmartDescription(post);
  const canonicalUrl = `${baseUrl}/posts/${post.id}`;
  const ogImages = post.images && post.images.length > 0 ? post.images : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Kavi",
      locale: "id_ID",
      type: "article",
      images: ogImages,
      publishedTime: new Date(post.postedAt).toISOString(),
      modifiedTime: new Date(post.updatedAt).toISOString(),
      authors: [post.author.name],
      section: post.topic?.name || "Isu Publik",
    },
    twitter: {
      card: ogImages ? "summary_large_image" : "summary",
      title,
      description,
      images: ogImages,
    },
  };
}

/**
 * Generates Schema.org JSON-LD Structured Data for Google Rich Snippets
 * Uses DiscussionForumPosting & GovernmentService representation
 */
export function generatePostJsonLd(post: PostSeoData): Record<string, any> {
  const isSolved = post.status === "CLOSED" && post.closeType === "SOLVED";

  const schema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "DiscussionForumPosting",
    "@id": `${baseUrl}/posts/${post.id}#posting`,
    headline: post.title,
    articleBody: post.content,
    url: `${baseUrl}/posts/${post.id}`,
    datePublished: new Date(post.postedAt).toISOString(),
    dateModified: new Date(post.updatedAt).toISOString(),
    author: {
      "@type": "Person",
      name: post.author.name,
      url: `${baseUrl}/users/${post.author.username}`,
    },
    interactionStatistic: [
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/LikeAction",
        userInteractionCount: post.upvotesCount,
      },
      {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/CommentAction",
        userInteractionCount: post.commentsCount,
      },
    ],
  };

  if (post.images && post.images.length > 0) {
    schema.image = post.images;
  }

  if (post.locationName || post.province) {
    schema.contentLocation = {
      "@type": "Place",
      name: post.locationName || post.province,
      address: {
        "@type": "PostalAddress",
        addressRegion: post.province,
        addressCountry: "ID",
      },
    };
  }

  // Official Government Resolution Answer (bikin Google nampilin Answer/Solved badge!)
  if (isSolved && post.resolutionComment) {
    schema.acceptedAnswer = {
      "@type": "Answer",
      text: post.resolutionComment.content,
      dateCreated: new Date(post.resolutionComment.createdAt).toISOString(),
      author: {
        "@type": "GovernmentOrganization",
        name: post.resolutionComment.author.agencyName || post.resolutionComment.author.name,
      },
      url: `${baseUrl}/posts/${post.id}#resolution`,
    };
  }

  return schema;
}

/**
 * Generates BreadcrumbList Schema.org JSON-LD
 */
export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; path: string }>
): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.path}`,
    })),
  };
}
