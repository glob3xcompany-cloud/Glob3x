"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import { track } from "@/lib/analytics";
import type { LeadErrors } from "@/lib/lead";
import { BASE_PATH, privacyUrl } from "@/lib/site";

const noop = () => () => {};
const useSearch = () => useSyncExternalStore(noop, () => window.location.search, () => "");

/** Unit chosen in the unit selector, passed as ?unit=A-23-04&type=2+1&area=78.0&tower=A&floor=23 */
function selectedUnit(search: string) {
  const q = new URLSearchParams(search);
  const code = q.get("unit") ?? "";
  if (!/^[AB]-\d{2}-\d{2}$/.test(code)) return null;
  return { code, type: q.get("type") ?? "", area: q.get("area") ?? "", tower: q.get("tower") ?? code[0], floor: q.get("floor") ?? String(Number(code.slice(2, 4))) };
}

export type ContactDict = {
  name: string;
  email: string;
  phone: string;
  country: string;
  budget: string;
  budgetOptions: string[];
  interest: string;
  interestOptions: string[];
  message: string;
  consent: string;
  privacy: string;
  submit: string;
  sending: string;
  whatsapp: string;
  success: string;
  error: string;
  invalid: string;
  selectedUnit: string;
  unitMessage: string;
};

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "success" } | { kind: "error"; invalid?: boolean };

const field =
  "w-full border-0 border-b border-paper/30 bg-transparent px-0 py-3 text-paper placeholder:text-paper/40 focus:border-gold focus:outline-none focus:ring-0";
const label = "eyebrow block text-paper/60";

export function ContactForm({ dict, locale, whatsappHref }: { dict: ContactDict; locale: string; whatsappHref: string }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<LeadErrors>({});
  const search = useSearch();
  const unit = selectedUnit(search);
  const unitMessage = unit ? dict.unitMessage.replace(/\{(\w+)\}/g, (_, k: keyof typeof unit) => unit[k] ?? "") : "";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus({ kind: "sending" });
    setErrors({});
    const data = new FormData(form);
    try {
      // fetch() does not know about basePath: without the prefix this would hit the group site's API instead.
      const res = await fetch(`${BASE_PATH}/api/lead`, { method: "POST", body: data });
      if (res.status === 422) {
        const body = (await res.json()) as { errors: LeadErrors };
        setErrors(body.errors);
        setStatus({ kind: "error", invalid: true });
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      track("lead", {
        form: "reeds",
        interest: String(data.get("interest") ?? ""),
        budget: String(data.get("budget") ?? ""),
        unit_type: unit?.type ?? "",
      });
      form.reset();
      setStatus({ kind: "success" });
    } catch {
      setStatus({ kind: "error" });
    }
  }

  const invalid = (k: keyof LeadErrors) => (errors[k] ? "border-red-400" : "");

  if (status.kind === "success") {
    return (
      <div className="border border-gold/60 p-8" role="status">
        <p className="font-display text-2xl">{dict.success}</p>
        <a href={whatsappHref} target="_blank" rel="noreferrer" className="mt-6 inline-block text-[0.75rem] font-semibold tracking-[0.18em] text-gold uppercase">
          {dict.whatsapp} →
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-7">
      <input type="hidden" name="locale" value={locale} />
      {unit && (
        <div className="flex items-center justify-between gap-4 border border-gold/60 px-5 py-4">
          <span className="eyebrow text-paper/60">{dict.selectedUnit}</span>
          <span className="font-display text-2xl text-gold tabular-nums">{unit.code}</span>
          <input type="hidden" name="unit" value={unit.code} />
        </div>
      )}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-7 md:grid-cols-2">
        <div>
          <label htmlFor="lead-name" className={label}>{dict.name}</label>
          <input id="lead-name" name="name" autoComplete="name" required className={`${field} ${invalid("name")}`} />
        </div>
        <div>
          <label htmlFor="lead-country" className={label}>{dict.country}</label>
          <input id="lead-country" name="country" autoComplete="country-name" required className={`${field} ${invalid("country")}`} />
        </div>
        <div>
          <label htmlFor="lead-email" className={label}>{dict.email}</label>
          <input id="lead-email" name="email" type="email" autoComplete="email" required className={`${field} ${invalid("email")}`} />
        </div>
        <div>
          <label htmlFor="lead-phone" className={label}>{dict.phone}</label>
          <input id="lead-phone" name="phone" type="tel" autoComplete="tel" placeholder="+" required className={`${field} ${invalid("phone")}`} />
        </div>
        <div>
          <label htmlFor="lead-budget" className={label}>{dict.budget}</label>
          <select id="lead-budget" name="budget" required defaultValue="" className={`${field} ${invalid("budget")} appearance-none [&>option]:text-ink`}>
            <option value="" disabled>—</option>
            {dict.budgetOptions.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="lead-interest" className={label}>{dict.interest}</label>
          <select id="lead-interest" name="interest" required defaultValue="" className={`${field} ${invalid("interest")} appearance-none [&>option]:text-ink`}>
            <option value="" disabled>—</option>
            {dict.interestOptions.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="lead-message" className={label}>{dict.message}</label>
        <textarea key={search} id="lead-message" name="message" rows={3} defaultValue={unitMessage} className={`${field} resize-none`} />
      </div>

      <label className={`flex items-start gap-3 text-sm text-paper/70 ${errors.consent ? "text-red-300" : ""}`}>
        <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 shrink-0 accent-gold" />
        <span>
          {dict.consent}{" "}
          <a href={privacyUrl(locale)} target="_blank" className="underline underline-offset-4 hover:text-paper">
            {dict.privacy}
          </a>
        </span>
      </label>

      {status.kind === "error" ? (
        <p role="alert" className="text-sm text-red-300">
          {status.invalid ? dict.invalid : dict.error}
        </p>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status.kind === "sending"}
          className="inline-flex items-center justify-center rounded-full bg-gold px-7 py-3.5 text-[0.75rem] font-semibold tracking-[0.16em] text-ink uppercase transition-colors hover:bg-gold-2 disabled:opacity-60"
        >
          {status.kind === "sending" ? dict.sending : dict.submit}
        </button>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-paper/30 px-7 py-3.5 text-[0.75rem] font-semibold tracking-[0.16em] uppercase transition-colors hover:border-paper"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 12 12 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2l-.5-.3Z" />
          </svg>
          {dict.whatsapp}
        </a>
      </div>
    </form>
  );
}
