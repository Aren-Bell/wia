"use client";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  Home,
  Search,
  MessagesSquare,
  Bell,
  UserRound,
  ListTree,
  Settings,
  Plus,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";
import { useDemo } from "@/features/auth/DemoProvider";
import { Login } from "@/features/auth/Login";
import { Composer } from "@/features/posts/Composer";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { people } from "@/mocks/data";

const destinations = [
  { label: "Beranda", icon: Home, href: "/home" },
  { label: "Jelajah", icon: Search },
  { label: "Obrolan", icon: MessagesSquare },
  { label: "Notifikasi", icon: Bell },
  { label: "Profil", icon: UserRound },
  { label: "Timeline Kinerja", icon: ListTree },
  { label: "Pengaturan", icon: Settings },
];
export function ProductShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const { user, logout, following, setFollowing, theme, setTheme } = useDemo();
  const [composer, setComposer] = useState(false);

  const [notice, setNotice] = useState("");
  if (!user) return <Login />;
  const unavailable = (label: string) =>
    setNotice(`${label} akan tersedia pada tahap berikutnya.`);
  return (
    <div
      className={`product ${theme === "dark" ? "theme-dark" : theme === "light" ? "theme-light" : "theme-system"}`}
    >
      <a className="skip-link" href="#main-content">
        Lewati navigasi
      </a>
      <aside className="sidebar">
        <Link href="/home" className="wordmark">
          kavi
        </Link>
        <nav aria-label="Navigasi utama">
          {destinations.map(({ label, icon: Icon, href }, index) =>
            href ? (
              <Link
                key={label}
                href={href}
                aria-current={href === "/home" ? "page" : undefined}
                className={`nav-item ${href === "/home" ? "active" : ""} nav-group-${index}`}
              >
                <Icon />
                <span>{label}</span>
              </Link>
            ) : (
              <button
                key={label}
                className={`nav-item nav-group-${index}`}
                onClick={() => unavailable(label)}
              >
                <Icon />
                <span>{label}</span>
              </button>
            ),
          )}
        </nav>
        <Button className="compose-nav" onClick={() => setComposer(true)}>
          <Plus />
          <span>Buat Postingan</span>
        </Button>
        <div className="sidebar-account">
          <Avatar name={user.name} />
          <div>
            <strong>{user.name}</strong>
            <small>@{user.username}</small>
          </div>
          <Button variant="ghost" aria-label="Keluar demo" onClick={logout}>
            <LogOut />
          </Button>
        </div>
      </aside>
      <main id="main-content" className="reading-column">
        <header className="page-header">
          <h1>{title}</h1>
          <div>
            <Button
              variant="ghost"
              className="mobile-bell"
              aria-label="Notifikasi"
              onClick={() => unavailable("Notifikasi")}
            >
              <Bell />
            </Button>
            <Button
              variant="ghost"
              aria-label="Ganti tema"
              onClick={() =>
                setTheme(
                  theme === "dark" ||
                    (theme === "system" &&
                      window.matchMedia("(prefers-color-scheme: dark)").matches)
                    ? "light"
                    : "dark",
                )
              }
            >
              {theme === "dark" ? <Moon /> : <Sun />}
            </Button>
          </div>
        </header>
        {notice && (
          <div role="status" className="notice">
            {notice}
            <button
              aria-label="Tutup pemberitahuan"
              onClick={() => setNotice("")}
            >
              ×
            </button>
          </div>
        )}
        {children}
        <Button
          className="floating-compose"
          aria-label="Buat postingan"
          onClick={() => setComposer(true)}
        >
          <Plus />
        </Button>
      </main>
      <aside className="support-column">
        <button className="search-box" onClick={() => unavailable("Pencarian")}>
          <Search />
          Cari di KAVI
        </button>
        <section className="suggestions">
          <h2>Temukan suara baru</h2>
          {people
            .filter((person) =>
              ["pupr", "komunitas", "dishub"].includes(person.localKey),
            )
            .map((person) => (
              <div className="suggestion" key={person.localKey}>
                <Avatar name={person.name} />
                <div>
                  <strong>
                    {person.name}
                    {person.role === "GOVERNMENT" ? " ✓" : ""}
                  </strong>
                  <small>{person.bio}</small>
                </div>
                <Button
                  variant="secondary"
                  onClick={() =>
                    setFollowing((current) =>
                      current.includes(person.localKey)
                        ? current.filter((key) => key !== person.localKey)
                        : [...current, person.localKey],
                    )
                  }
                >
                  {following.includes(person.localKey) ? "Diikuti" : "Ikuti"}
                </Button>
              </div>
            ))}
        </section>
        <p className="footer-note">
          KAVI · Ruang bersama untuk perubahan.
          <br />© 2026 KAVI · Konten contoh
        </p>
      </aside>
      <nav className="mobile-island" aria-label="Navigasi seluler">
        <Link
          href="/home"
          aria-label="Beranda"
          aria-current="page"
          className="active"
        >
          <Home />
        </Link>
        <button aria-label="Jelajah" onClick={() => unavailable("Jelajah")}>
          <Search />
        </button>
        <button
          className="island-compose"
          aria-label="Buat postingan"
          onClick={() => setComposer(true)}
        >
          <Plus />
        </button>
        <button aria-label="Obrolan" onClick={() => unavailable("Obrolan")}>
          <MessagesSquare />
        </button>
        <button
          aria-label="Timeline Kinerja"
          onClick={() => unavailable("Timeline Kinerja")}
        >
          <ListTree />
        </button>
        <button aria-label="Profil" onClick={() => unavailable("Profil")}>
          <UserRound />
        </button>
      </nav>
      {composer && <Composer onClose={() => setComposer(false)} />}
    </div>
  );
}
