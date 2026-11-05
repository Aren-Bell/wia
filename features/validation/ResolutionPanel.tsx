"use client";
import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Clock3 } from "lucide-react";
import { useDemo } from "@/features/auth/DemoProvider";
import { resolutionResult } from "@/lib/validation";
import { Button } from "@/components/ui/Button";
import type { Post } from "@/types/models";
import { people } from "@/mocks/data";

export function ResolutionPanel({ post }: { post: Post }) {
  const { updatePost, user } = useDemo();
  const [now, setNow] = useState(() => Date.now());
  const [argument, setArgument] = useState("");
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const latest = post.resolutions.at(-1);
  const canSubmit =
    user?.role === "GOVERNMENT" &&
    post.agencyKeys.includes(user.localKey) &&
    (!latest || resolutionResult(latest) === "failed");
  return (
    <section id="evidence" className="resolution-section" tabIndex={-1}>
      <h2>Bukti & validasi penyelesaian</h2>
      <p className="muted small">
        Penilaian penyelesaian terpisah dari upvote dan downvote.
      </p>
      {post.resolutions.map((resolution, index) => {
        const result = resolutionResult(resolution, now);
        const total = resolution.agree + resolution.disagree;
        const percent = total
          ? Math.round((resolution.agree / total) * 100)
          : 0;
        const showResults = !!resolution.choice || result !== "active";
        const hours = Math.max(
          0,
          Math.ceil((resolution.deadline - now) / 3600000),
        );
        return (
          <article
            key={resolution.localKey}
            className={`resolution-card ${result}`}
          >
            <div className="section-heading">
              {result === "success" ? (
                <CheckCircle2 />
              ) : result === "failed" ? (
                <AlertCircle />
              ) : (
                <Clock3 />
              )}
              <h3>
                {result === "active"
                  ? "Validasi sedang berlangsung"
                  : result === "success"
                    ? "Case Closed · Disetujui warga"
                    : result === "automatic"
                      ? "Ditutup otomatis · Tidak ada suara"
                      : "Pengajuan gagal · Laporan tetap terbuka"}
              </h3>
            </div>
            <p className="small muted">
              Pengajuan {index + 1} ·{" "}
              {
                people.find(
                  (person) => person.localKey === resolution.agencyKey,
                )?.name
              }
            </p>
            <p>{resolution.content}</p>
            <p className="small">
              Berakhir:{" "}
              {new Date(resolution.deadline).toLocaleString("id-ID", {
                timeZone: "Asia/Jakarta",
              })}{" "}
              WIB{result === "active" ? ` · Sisa sekitar ${hours} jam` : ""}
            </p>
            {showResults && (
              <>
                <div className="progress-track">
                  <span style={{ width: `${percent}%` }} />
                </div>
                <p>
                  <strong>{percent}% setuju</strong> · {total} suara
                </p>
              </>
            )}
            {result === "automatic" && (
              <p>
                Tidak ada suara selama periode validasi. Penutupan ini bukan
                persetujuan masyarakat.
              </p>
            )}
            {result === "failed" && (
              <p>
                Persetujuan belum mencapai 80%. Instansi terkait dapat
                mengajukan bukti atau argumen baru.
              </p>
            )}
            {result === "active" && (
              <>
                <div className="button-row">
                  {(["agree", "disagree"] as const).map((choice) => (
                    <Button
                      key={choice}
                      variant={
                        resolution.choice === choice ? "primary" : "secondary"
                      }
                      aria-pressed={resolution.choice === choice}
                      onClick={() =>
                        updatePost(post.localKey, (current) => ({
                          ...current,
                          resolutions: current.resolutions.map((item) => {
                            if (
                              item.localKey !== resolution.localKey ||
                              resolutionResult(item) !== "active" ||
                              item.choice === choice
                            )
                              return item;
                            return {
                              ...item,
                              agree:
                                item.agree -
                                (item.choice === "agree" ? 1 : 0) +
                                (choice === "agree" ? 1 : 0),
                              disagree:
                                item.disagree -
                                (item.choice === "disagree" ? 1 : 0) +
                                (choice === "disagree" ? 1 : 0),
                              choice,
                            };
                          }),
                        }))
                      }
                    >
                      {choice === "agree" ? "Setuju" : "Belum selesai"}
                    </Button>
                  ))}
                </div>
                <p className="small muted">
                  {resolution.choice
                    ? "Suaramu tersimpan di sesi demo. Kamu dapat mengubahnya sampai tenggat."
                    : "Baca bukti sebelum memilih. Persentase terlihat setelah memberikan suara."}
                </p>
              </>
            )}
          </article>
        );
      })}
      {!latest && <p className="muted">Belum ada pengajuan penyelesaian.</p>}
      {canSubmit && (
        <form
          className="resolution-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (!argument.trim() || !user) return;
            updatePost(post.localKey, (current) => {
              const last = current.resolutions.at(-1);
              if (last && resolutionResult(last) !== "failed") return current;
              return {
                ...current,
                resolutions: [
                  ...current.resolutions,
                  {
                    id: "",
                    localKey: crypto.randomUUID(),
                    agencyKey: user.localKey,
                    content: argument.trim(),
                    images: [],
                    deadline: Date.now() + 72 * 3600000,
                    agree: 0,
                    disagree: 0,
                    choice: null,
                  },
                ],
              };
            });
            setArgument("");
          }}
        >
          <label>
            Argumen penyelesaian *
            <textarea
              required
              rows={4}
              value={argument}
              onChange={(event) => setArgument(event.target.value)}
              placeholder="Jelaskan tindakan, unit penanggung jawab dan waktu pelaksanaan."
            />
          </label>
          <p className="muted small">
            Pengajuan memulai validasi 72 jam, bukan langsung menutup laporan.
            Satu pengajuan aktif per laporan.
          </p>
          <Button type="submit">Ajukan penyelesaian</Button>
        </form>
      )}
    </section>
  );
}
