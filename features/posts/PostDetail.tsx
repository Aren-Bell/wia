"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useDemo } from "@/features/auth/DemoProvider";
import { ProductShell } from "@/components/layout/ProductShell";
import { PostCard } from "./PostCard";
import { CommentThread } from "./CommentThread";
import { ResolutionPanel } from "@/features/validation/ResolutionPanel";

export function PostDetail({
  postKey,
  branchKey,
}: {
  postKey: string;
  branchKey?: string;
}) {
  const { posts } = useDemo();
  const post = posts.find((item) => item.localKey === postKey);
  return (
    <ProductShell title={branchKey ? "Cabang percakapan" : "Postingan"}>
      <section className="feed-surface">
        <Link
          href={branchKey ? `/posts/${postKey}` : "/home"}
          className="back-link"
        >
          <ArrowLeft size={18} />
          {branchKey ? "Kembali ke postingan" : "Kembali ke beranda"}
        </Link>
        {post ? (
          <>
            <PostCard post={post} detail />
            {post.kind === "report" && !branchKey && (
              <ResolutionPanel post={post} />
            )}
            <CommentThread post={post} parentKey={branchKey} />
          </>
        ) : (
          <div className="empty-state">
            <h2>Postingan tidak tersedia</h2>
            <p>
              Data demo dapat hilang setelah refresh. Kembali ke beranda untuk
              memulai lagi.
            </p>
          </div>
        )}
      </section>
    </ProductShell>
  );
}
