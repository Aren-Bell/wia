import { theme } from "@/app/config";
import Navbar from "@/app/components/land/Navbar";
import AboutContent from "@/app/components/land/AboutContent";
import Footer from "@/app/components/land/Footer";

export default function AboutPage() {
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
        style={{
          flex: 1,
          width: "100%",
        }}
      >
        <AboutContent />
      </main>

      <Footer />
    </div>
  );
}
