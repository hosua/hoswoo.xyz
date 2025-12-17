import { API_BASE_URL } from "./env";

interface RenameCognitoUserRequest {
  originalUsername: string;
  newUsername: string;
}

export const renameCognitoUsername = async ({
  originalUsername,
  newUsername,
}: RenameCognitoUserRequest) => {
  const url = `${API_BASE_URL}/rename-user`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ originalUsername, newUsername }),
  });

  if (!response.ok) {
    throw new Error("Failed to rename user!");
  }

  return await response.json();
};
