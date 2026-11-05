import { Suspense } from "react";
import { PostDetail } from "@/features/posts/PostDetail";
async function Detail({ params }: { params: Promise<{ postKey: string }> }) {
  const keys = await params;
  return <PostDetail postKey={keys.postKey} />;
}
export default function Page({
  params,
}: {
  params: Promise<{ postKey: string }>;
}) {
  return (
    <Suspense fallback={<p role="status">Memuat postingan�</p>}>
      <Detail params={params} />
    </Suspense>
  );
}
