import { theme } from "@/app/config";
import Navbar from "@/app/components/land/Navbar";
import Hero from "@/app/components/land/Hero";
import NetworkSection from "@/app/components/land/NetworkSection";
import CtaSection from "@/app/components/land/CtaSection";
import Footer from "@/app/components/land/Footer";

export default function Home() {
  return (
    <div
      id="top"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.colors.background.page,
        fontFamily: theme.typography.fontFamily,
      }}
    >
      <Navbar />

      <main
        id="footer-product"
        style={{
          flex: 1,
          width: "100%",
        }}
      >
        <Hero />
        <NetworkSection />
        <CtaSection />
      </main>

      <Footer />
    </div>
  );
}
