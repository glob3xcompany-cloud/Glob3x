import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[70svh] items-center bg-paper">
      <div className="container-x py-32">
        <p className="eyebrow text-blue">404</p>
        <h1 className="font-display mt-4 text-display-lg font-light">Page not found · Faqja nuk u gjet</h1>
        <div className="mt-8 flex gap-6 text-[0.75rem] font-semibold tracking-[0.18em] uppercase">
          <Link href="/en" className="text-blue">English →</Link>
          <Link href="/sq" className="text-blue">Shqip →</Link>
        </div>
      </div>
    </section>
  );
}
