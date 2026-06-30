"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useEffect, useState } from "react";

interface Faq {
  id: number;
  question: string;
  answer: string;
  category: string | null;
  order: number;
}

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/faqs`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setFaqs(data.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-brand-light-gray">
        <section className="bg-gradient-to-r from-brand-navy to-brand-blue py-16">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              Frequently Asked Questions
            </h1>
          </div>
        </section>
        <section className="mx-auto max-w-3xl px-4 py-12">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent" />
            </div>
          ) : faqs.length === 0 ? (
            <div className="rounded-xl border border-border bg-white p-8 text-center">
              <p className="text-muted-foreground">Belum ada FAQ yang tersedia.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={faq.id} className="rounded-xl border border-border bg-white">
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="flex w-full items-center justify-between p-5 text-left"
                  >
                    <span className="text-sm font-semibold text-brand-navy">{faq.question}</span>
                    <svg
                      className={`h-5 w-5 text-muted-foreground transition-transform ${openIndex === index ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  {openIndex === index && (
                    <div className="border-t border-border px-5 pb-5 pt-3">
                      <p className="text-sm text-muted-foreground">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
