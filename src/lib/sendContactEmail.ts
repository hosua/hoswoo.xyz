import { API_BASE_URL } from "@lib/env";

interface SendContactEmailProps {
  ip: string;
  email: string;
  body: string;
}
export const sendContactEmail = async ({
  ip,
  email,
  body,
}: SendContactEmailProps) => {
  const url = `${API_BASE_URL}/send-contact-email`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ip, email, body }),
  });

  if (!response.ok) {
    const msg = await response.json();
    throw new Error(`Failed to send contact email!\n\n${msg?.error}`);
  }
};

export default sendContactEmail;
