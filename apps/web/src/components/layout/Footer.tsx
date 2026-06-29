import Link from "next/link";
import { BRAND } from "@/constants";

export function Footer() {
  return (
    <footer className="border-t border-border bg-brand-light-gray">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold text-brand-navy">
              {BRAND.name}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {BRAND.description}
            </p>
            <p className="mt-2 text-xs font-medium text-brand-blue">
              {BRAND.tagline}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-brand-navy">Platform</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/communities"
                  className="text-sm text-muted-foreground hover:text-brand-navy"
                >
                  Komunitas
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-sm text-muted-foreground hover:text-brand-navy"
                >
                  Event
                </Link>
              </li>
              <li>
                <Link
                  href="/articles"
                  className="text-sm text-muted-foreground hover:text-brand-navy"
                >
                  Artikel
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-brand-navy">Perusahaan</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-brand-navy"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-brand-navy"
                >
                  Hubungi Kami
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-muted-foreground hover:text-brand-navy"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-brand-navy">Legal</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-brand-navy"
                >
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-brand-navy"
                >
                  Syarat & Ketentuan
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {BRAND.name}. Hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
