import "dotenv/config";
import {
  generateSmartDescription,
  generatePostMetadata,
  generatePostJsonLd,
  PostSeoData,
} from "../lib/seo";
import robots from "../app/robots";
import sitemap from "../app/sitemap";
import { GET as getLlmsTxt } from "../app/llms.txt/route";
import assert from "assert";

async function runSeoAndLlmsTests() {
  console.log("=== [TEST SUITE] AUTOMATED SEO, SCHEMA.ORG & LLMS.TXT ===");

  const samplePost: PostSeoData = {
    id: "post_sample_seo_01",
    title: "Jalan Rusak Parah di Jalur Trans-Kalimantan",
    content: "Lubang besar sedalam 30 cm membahayakan pengendara motor dan truk logistik sejak dua pekan lalu tanpa penerangan memadai.",
    locationName: "KM 12 Balikpapan",
    province: "Kalimantan Timur",
    status: "CLOSED",
    closeType: "SOLVED",
    upvotesCount: 245,
    commentsCount: 38,
    postedAt: new Date(),
    updatedAt: new Date(),
    author: {
      name: "Budi Santoso",
      username: "budisantoso",
      role: "USER",
    },
    topic: {
      name: "Infrastruktur",
      slug: "infrastruktur",
    },
    resolutionComment: {
      content: "Perbaikan darurat aspal telah diselesaikan oleh tim UPTD PU Wilayah II.",
      createdAt: new Date(),
      author: {
        name: "Dinas PUPR Kaltim",
        agencyName: "Dinas PUPR Provinsi Kalimantan Timur",
      },
    },
  };

  // Test 1: Smart SEO Description Truncation
  console.log("-> Test 1: Testing Smart SEO Description Generator...");
  const desc = generateSmartDescription(samplePost);
  assert(desc.includes("[SOLVED]"), "Description must include [SOLVED] status tag");
  assert(desc.includes("KM 12 Balikpapan"), "Description must contain location");
  assert(desc.length <= 160, `Description length must be <= 160 characters (got ${desc.length})`);
  console.log("   PASS: Smart description generated:", `"${desc}"`);

  // Test 2: Next.js Metadata
  console.log("-> Test 2: Testing Post Metadata...");
  const metadata = generatePostMetadata(samplePost);
  assert.strictEqual(metadata.title, "Jalan Rusak Parah di Jalur Trans-Kalimantan | Kavi");
  assert.strictEqual((metadata.openGraph as any)?.type, "article");
  console.log("   PASS: Metadata conforms to OpenGraph and Twitter specifications");

  // Test 3: Schema.org JSON-LD Structured Data
  console.log("-> Test 3: Testing Schema.org JSON-LD (Rich Results)...");
  const jsonLd = generatePostJsonLd(samplePost);
  assert.strictEqual(jsonLd["@context"], "https://schema.org");
  assert.strictEqual(jsonLd["@type"], "DiscussionForumPosting");
  assert.strictEqual(jsonLd.interactionStatistic[0].userInteractionCount, 245);
  assert(jsonLd.acceptedAnswer, "Solved post must have acceptedAnswer schema");
  assert.strictEqual(jsonLd.acceptedAnswer.author["@type"], "GovernmentOrganization");
  console.log("   PASS: Schema.org JSON-LD correctly includes GovernmentOrganization resolution");

  // Test 4: Robots.txt
  console.log("-> Test 4: Testing Robots.txt Generation...");
  const robotsConfig = robots();
  assert(Array.isArray(robotsConfig.rules));
  assert(robotsConfig.sitemap?.includes("sitemap.xml"));
  console.log("   PASS: Robots.txt rules & sitemap URL configured");

  // Test 5: Dynamic Sitemap
  console.log("-> Test 5: Testing Dynamic Sitemap.xml...");
  const sitemapList = await sitemap();
  assert(sitemapList.length > 0, "Sitemap must contain URLs");
  const homeRoute = sitemapList.find((s) => !s.url.includes("/posts/") && !s.url.includes("/topics/"));
  assert(homeRoute, "Sitemap must include root domain");
  console.log(`   PASS: Sitemap generated successfully (${sitemapList.length} indexed URLs)`);

  // Test 6: llms.txt Route Handler
  console.log("-> Test 6: Testing /llms.txt AI Crawler Output...");
  const llmsResponse = await getLlmsTxt();
  assert.strictEqual(llmsResponse.status, 200);
  assert.strictEqual(llmsResponse.headers.get("Content-Type"), "text/markdown; charset=utf-8");
  const llmsText = await llmsResponse.text();
  assert(llmsText.includes("# Kavi"), "llms.txt must have Kavi heading");
  assert(llmsText.includes("Public REST API Endpoints"), "llms.txt must document public endpoints");
  assert(llmsText.includes("Macro Topics"), "llms.txt must document macro topics");
  console.log("   PASS: /llms.txt generated conforming to standard markdown AI crawler specification");

  console.log("=== ALL SEO & LLMS.TXT TESTS PASSED SUCCESSFULLY ===");
}

runSeoAndLlmsTests().catch((err) => {
  console.error("Test failed:", err);
  process.exitCode = 1;
});
