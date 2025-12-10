import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link2, CheckCircle2, Copy, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { shortenUrl } from "@/lib/urlShortener";

export const UrlShortenerPage = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shortenedUrl, setShortenedUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setShortenedUrl(null);
    setLoading(true);

    try {
      const response = await shortenUrl({ originalUrl: url });
      const fullShortUrl = `${window.location.origin}/s/${response.short_url}`;
      setShortenedUrl(fullShortUrl);
      setUrl("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to shorten URL. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (shortenedUrl) {
      await navigator.clipboard.writeText(shortenedUrl);
      toast.success("URL copied to clipboard");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Link2 size={40} />
          URL Shortener
        </h1>
        <p className="text-muted-foreground">
          Shorten your URLs quickly and easily.
        </p>
      </div>
      <div className="max-w-2xl space-y-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="url"
            placeholder="Enter URL to shorten"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
            disabled={loading}
            required
          />
          <Button variant="secondary" type="submit" disabled={loading}>
            {loading ? "Shortening..." : "Shorten"}
          </Button>
        </form>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {shortenedUrl && (
          <div className="space-y-2">
            <Alert>
              <CheckCircle2 className="text-green-600" />
              <AlertDescription className="flex items-center justify-between gap-2">
                <span className="break-all">{shortenedUrl}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="shrink-0"
                >
                  <Copy className="size-4" />
                </Button>
              </AlertDescription>
            </Alert>
            <Alert variant="default">
              <AlertTriangle className="text-yellow-600" />
              <AlertDescription>
                Shortened URLs expire after 24 hours.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlShortenerPage;
