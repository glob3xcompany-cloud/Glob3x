export type LeadInput = {
  name: string;
  email: string;
  phone: string;
  country: string;
  interest: string;
  message: string;
  consent: boolean;
  locale: string;
  /** Honeypot: must stay empty. */
  website?: string;
};

export type LeadErrors = Partial<Record<keyof LeadInput, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[0-9 ()./-]{7,20}$/;
const MAX_MESSAGE = 2000;

export function validateLead(input: LeadInput): LeadErrors {
  const errors: LeadErrors = {};
  if (input.name.trim().length < 2) errors.name = "name";
  if (!EMAIL.test(input.email.trim())) errors.email = "email";
  if (!PHONE.test(input.phone.trim())) errors.phone = "phone";
  if (input.country.trim().length < 2) errors.country = "country";
  if (!input.interest) errors.interest = "interest";
  if (input.message.length > MAX_MESSAGE) errors.message = "message";
  if (!input.consent) errors.consent = "consent";
  return errors;
}

export function leadFromFormData(fd: FormData): LeadInput {
  const str = (k: string) => (typeof fd.get(k) === "string" ? (fd.get(k) as string) : "");
  return {
    name: str("name"),
    email: str("email"),
    phone: str("phone"),
    country: str("country"),
    interest: str("interest"),
    message: str("message"),
    consent: fd.get("consent") === "on",
    locale: str("locale"),
    website: str("website"),
  };
}
