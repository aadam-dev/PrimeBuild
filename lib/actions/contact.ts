"use server";

export type ContactFormState = {
  ok: boolean;
  message: string;
} | null;

export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const subject = formData.get("subject")?.toString().trim();
  const message = formData.get("message")?.toString().trim();

  if (!name || !email || !message) {
    return { ok: false, message: "Please fill in all required fields." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { ok: false, message: "Please enter a valid email address." };
  }

  try {
    // In production, this would send an email via Resend or store in DB
    // For now, we simulate a successful submission
    console.log("[Contact Form]", { name, email, subject, message });

    return {
      ok: true,
      message:
        "Thank you for your message! We'll get back to you within 2 business hours.",
    };
  } catch {
    return {
      ok: false,
      message: "Something went wrong. Please try again or contact us via WhatsApp.",
    };
  }
}
