export type LeadInput = {
  name: string;
  email: string;
  phone: string;
  country: string;
  budget: string;
  interest: string;
  message: string;
  /** Unit code chosen in the unit selector, e.g. "A-23-04". */
  unit: string;
  consent: boolean;
  locale: string;
  /** Honeypot: must stay empty. */
  website?: string;
};

export type LeadErrors = Partial<Record<keyof LeadInput, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[0-9 ()./-]{7,20}$/;

export function validateLead(input: LeadInput): LeadErrors {
  const errors: LeadErrors = {};
  if (input.name.trim().length < 2) errors.name = "name";
  if (!EMAIL.test(input.email.trim())) errors.email = "email";
  if (!PHONE.test(input.phone.trim())) errors.phone = "phone";
  if (input.country.trim().length < 2) errors.country = "country";
  if (!input.budget) errors.budget = "budget";
  if (!input.interest) errors.interest = "interest";
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
    budget: str("budget"),
    interest: str("interest"),
    message: str("message"),
    unit: /^[AB]-\d{2}-\d{2}$/.test(str("unit")) ? str("unit") : "",
    consent: fd.get("consent") === "on",
    locale: str("locale"),
    website: str("website"),
  };
}
