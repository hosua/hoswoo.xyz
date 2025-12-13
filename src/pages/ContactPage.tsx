import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { publicIpv4 } from "public-ip";
import { sendContactEmail } from "@/lib/sendContactEmail";

const EMAIL_MAX_LENGTH = 254;
const MESSAGE_MAX_LENGTH = 2000;

export const ContactPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remainingChars = MESSAGE_MAX_LENGTH - message.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const ip = await publicIpv4();
      await sendContactEmail({ ip, email, body: message });
      toast.success("Message sent successfully!");
      setEmail("");
      setMessage("");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to send message. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Mail size={40} />
          Contact
        </h1>
        <p className="text-muted-foreground">
          Have any inquiries? Feel free to send me a message!
        </p>
      </div>
      <div className="max-w-2xl mx-auto space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={EMAIL_MAX_LENGTH}
              disabled={loading}
              required
            />
          </div>
          <div className="space-y-2 mb-2">
            <Label htmlFor="message">Message</Label>
            <div className="relative">
              <Textarea
                id="message"
                placeholder="Enter your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={MESSAGE_MAX_LENGTH}
                className="min-h-60 max-h-60"
                disabled={loading}
                required
              />
              <div className="absolute bottom-2 right-2 text-sm text-muted-foreground">
                {remainingChars} characters remaining
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="default" type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </form>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default ContactPage;
