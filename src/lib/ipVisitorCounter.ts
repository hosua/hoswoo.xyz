import { API_BASE_URL } from "@lib/env";

export const countVisitor = async ({ ip }: { ip: string }) => {
  const url = `${API_BASE_URL}/visit-count`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ip }),
  });

  if (!response.ok) {
    throw new Error("Failed to count visitor IP!");
  }
};

export default countVisitor;
