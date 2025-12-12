import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";

const EMAIL_MAX_LENGTH = 254;
const MESSAGE_MAX_LENGTH = 2000;

export const ContactPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const remainingChars = MESSAGE_MAX_LENGTH - message.length;

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
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={EMAIL_MAX_LENGTH}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <div className="relative">
            <Textarea
              id="message"
              placeholder="Enter your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={MESSAGE_MAX_LENGTH}
              className="min-h-32"
            />
            <div className="absolute bottom-2 right-2 text-sm text-muted-foreground">
              {remainingChars} characters remaining
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
