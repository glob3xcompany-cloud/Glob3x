"use client";

import { useSearchParams } from "next/navigation";
import { ContactForm, type ContactDict } from "./contact-form";

/** Reads ?interest= so project pages can preselect the enquiry type. Must be rendered inside <Suspense>. */
export function ContactFormWithQuery(props: { dict: ContactDict; locale: string; whatsappHref: string }) {
  const params = useSearchParams();
  return <ContactForm {...props} defaultInterest={params.get("interest") ?? undefined} />;
}
