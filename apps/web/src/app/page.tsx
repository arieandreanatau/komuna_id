import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BRAND } from "@/constants";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-navy via-brand-blue to-brand-teal">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
                {BRAND.name}
              </h1>
              <p className="mt-4 text-lg font-medium text-brand-aqua">
                {BRAND.tagline}
              </p>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
                {BRAND.description}
              </p>
              <div className="mt-10 flex items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="rounded-lg bg-brand-orange px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-brand-orange/90"
                >
                  Mulai Sekarang
                </Link>
                <Link
                  href="/communities"
                  className="rounded-lg border border-white/30 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Jelajahi Komunitas
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-brand-navy">
                Mengapa KomunaID?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Platform yang menghubungkan komunitas, organisasi, dan brand
                dalam satu ekosistem.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Terhubung",
                  description:
                    "Temukan dan bergabung dengan komunitas yang sesuai minat Anda.",
                  color: "text-brand-blue",
                },
                {
                  title: "Kolaboratif",
                  description:
                    "Bangun kolaborasi antar komunitas, organisasi, dan brand.",
                  color: "text-brand-teal",
                },
                {
                  title: "Bertumbuh",
                  description:
                    "Kembangkan potensi Anda dan komunitas bersama.",
                  color: "text-brand-orange",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-xl border border-border bg-brand-light-gray p-8"
                >
                  <h3
                    className={`text-xl font-semibold ${feature.color}`}
                  >
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-brand-light-gray py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-semibold text-brand-navy">
              Siap Bergabung?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Mulai petualangan Anda di KomunaID hari ini.
            </p>
            <div className="mt-8">
              <Link
                href="/register"
                className="inline-flex rounded-lg bg-brand-blue px-8 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-brand-blue/90"
              >
                Daftar Gratis
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
