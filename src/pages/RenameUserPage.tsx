import { useState } from "react";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Button } from "@components/ui/button";
import { User } from "lucide-react";
import { Spinner } from "@components/ui/spinner";
import * as oidc from "react-oidc-context";

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 20;
const USERNAME_PATTERN = /^[a-zA-Z0-9_-]+$/;

export const RenameUserPage = () => {
  const auth = oidc.useAuth();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentUsername =
    (typeof auth.user?.profile?.["cognito:preferred_username"] === "string" &&
      auth.user.profile["cognito:preferred_username"]) ||
    (typeof auth.user?.profile?.["cognito:username"] === "string" &&
      auth.user.profile["cognito:username"]) ||
    "unknown username";

  const remainingChars = USERNAME_MAX_LENGTH - username.length;

  const validateUsername = (value: string): string | null => {
    if (value.length < USERNAME_MIN_LENGTH) {
      return `Username must be at least ${USERNAME_MIN_LENGTH} characters`;
    } else if (value.length > USERNAME_MAX_LENGTH) {
      return `Username must be no more than ${USERNAME_MAX_LENGTH} characters`;
    }
    if (!USERNAME_PATTERN.test(value)) {
      return "Username can only contain letters, numbers, underscores, and hyphens";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateUsername(username);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      // TODO: Call API gateway
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Would update username to:", username);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to update username. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <User size={40} />
          Rename User
        </h1>
        <p className="text-muted-foreground">
          Update your display username. This will change how your name appears
          across the site.
        </p>
      </div>
      <div className="max-w-2xl mx-auto space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="current-username">Current Username</Label>
            <Input
              id="current-username"
              type="text"
              value={currentUsername}
              disabled
              className="bg-muted"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">New Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your new username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError(null);
              }}
              minLength={USERNAME_MIN_LENGTH}
              maxLength={USERNAME_MAX_LENGTH}
              disabled={loading}
              required
              className={error ? "border-destructive" : ""}
            />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {remainingChars} characters remaining
              </span>
              {error && (
                <span className="text-destructive font-medium">{error}</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Username can contain letters, numbers, underscores, and hyphens
            </p>
          </div>
          <div className="flex justify-end">
            <Button variant="default" type="submit" disabled={loading}>
              {loading ? <Spinner /> : "Update Username"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RenameUserPage;
