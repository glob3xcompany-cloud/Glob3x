"use client";

import { useId, useState } from "react";
import { PAYMENT, PRICE_BANDS } from "@/lib/towers";

type Labels = {
  title: string;
  band: string;
  bands: string[];
  area: string;
  presets: string;
  total: string;
  down: string;
  installment: string;
  schedule: string;
  signing: string;
  month: string;
  installmentN: string;
};

const PRESETS = [
  { label: "1+1", area: 60 },
  { label: "1+1", area: 66 },
  { label: "2+1", area: 78 },
  { label: "2+1", area: 101 },
];

const eur = (v: number) => `€${Math.round(v).toLocaleString("en-US")}`;

export function PaymentCalculator({ labels }: { labels: Labels }) {
  const id = useId();
  const [band, setBand] = useState(0);
  const [area, setArea] = useState(66);

  const price = PRICE_BANDS[band].pricePerM2;
  const total = Math.max(0, area) * price;
  const down = total * PAYMENT.downPayment;
  const installment = (total - down) / PAYMENT.installments;

  return (
    <div className="border border-line-dark bg-ink-2 p-6 md:p-8">
      <p className="eyebrow text-gold">{labels.title}</p>

      <fieldset className="mt-6">
        <legend className="eyebrow text-paper/50">{labels.band}</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {labels.bands.map((b, i) => (
            <button
              key={b}
              type="button"
              aria-pressed={band === i}
              onClick={() => setBand(i)}
              className={`border px-4 py-3 text-left text-sm transition-colors ${band === i ? "border-gold bg-gold/10 text-paper" : "border-line-dark text-paper/60 hover:text-paper"}`}
            >
              {b}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-6">
        <label htmlFor={`${id}-area`} className="eyebrow text-paper/50">
          {labels.area}
        </label>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <div className="flex items-baseline border-b border-line-dark">
            <input
              id={`${id}-area`}
              type="number"
              inputMode="decimal"
              min={30}
              max={400}
              step={0.1}
              value={area}
              onChange={(e) => setArea(Number(e.target.value))}
              className="font-display w-24 bg-transparent py-1 text-3xl text-paper outline-none"
            />
            <span className="text-sm text-paper/50">m²</span>
          </div>
          <span className="text-[0.6875rem] tracking-[0.12em] text-paper/40 uppercase">{labels.presets}</span>
          {PRESETS.map((p) => (
            <button
              key={p.area}
              type="button"
              onClick={() => setArea(p.area)}
              className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${area === p.area ? "border-gold text-gold" : "border-line-dark text-paper/60 hover:text-paper"}`}
            >
              {p.label} · {p.area} m²
            </button>
          ))}
        </div>
      </div>

      <dl className="mt-8 grid gap-6 border-t border-line-dark pt-6 sm:grid-cols-3" aria-live="polite">
        <div>
          <dt className="text-[0.75rem] text-paper/50">{labels.total}</dt>
          <dd className="font-display mt-1 text-3xl text-paper tabular-nums">{eur(total)}</dd>
        </div>
        <div>
          <dt className="text-[0.75rem] text-paper/50">{labels.down}</dt>
          <dd className="font-display mt-1 text-3xl text-gold tabular-nums">{eur(down)}</dd>
        </div>
        <div>
          <dt className="text-[0.75rem] text-paper/50">
            {labels.installment} × {PAYMENT.installments}
          </dt>
          <dd className="font-display mt-1 text-3xl text-paper tabular-nums">{eur(installment)}</dd>
        </div>
      </dl>

      <details className="group mt-6 border-t border-line-dark pt-4">
        <summary className="cursor-pointer list-none text-[0.75rem] font-semibold tracking-[0.16em] text-paper/70 uppercase hover:text-paper">
          {labels.schedule} <span className="inline-block transition-transform group-open:rotate-45">+</span>
        </summary>
        <ol className="mt-4 grid gap-x-8 text-sm sm:grid-cols-2">
          <li className="flex justify-between border-b border-line-dark py-2">
            <span className="text-paper/60">{labels.signing} · 30%</span>
            <span className="tabular-nums">{eur(down)}</span>
          </li>
          {Array.from({ length: PAYMENT.installments }, (_, i) => (
            <li key={i} className="flex justify-between border-b border-line-dark py-2">
              <span className="text-paper/60">
                {labels.installmentN} {i + 1} · {labels.month} {(i + 1) * PAYMENT.monthsBetween}
              </span>
              <span className="tabular-nums">{eur(installment)}</span>
            </li>
          ))}
        </ol>
      </details>
    </div>
  );
}
