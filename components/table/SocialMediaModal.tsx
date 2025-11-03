"use client";

import { ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Contact } from "@/lib/table-data";

interface SocialMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact | null;
}

export function SocialMediaModal({
  isOpen,
  onClose,
  contact,
}: SocialMediaModalProps) {
  if (!contact) return null;

  // Extract Facebook and Twitter from socialMedia array
  const facebookFromArray = contact.socialMedia?.find(s => s.platform.toLowerCase().includes('facebook'))?.url;
  const twitterFromArray = contact.socialMedia?.find(s => s.platform.toLowerCase().includes('twitter'))?.url;
  
  const socialLinks = [
    { platform: "Personal LinkedIn", url: contact.personLinkedIn },
    { platform: "Company LinkedIn", url: contact.companyLinkedin },
    { platform: "Website", url: contact.website },
    { platform: "Facebook", url: contact.facebookUrl || facebookFromArray },
    { platform: "Twitter", url: contact.twitterUrl || twitterFromArray },
  ].filter((link) => link.url && link.url.trim() !== "");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] sm:max-w-md transition-all duration-300 modal-background max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Social Media Links - {contact.name}</DialogTitle>
        </DialogHeader>
        <div className="py-3 sm:py-4">
          {socialLinks.length === 0 ? (
            <p className="text-center text-muted-foreground italic text-sm sm:text-base">
              No social media links available
            </p>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {socialLinks.map((link, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 sm:p-3 rounded-lg border hover:bg-accent transition-all duration-200"
                  style={{
                    animation: `slideIn 0.3s ease-out ${index * 50}ms both`,
                  }}
                >
                  <span className="font-medium text-xs sm:text-sm truncate mr-2">{link.platform}</span>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 sm:gap-2 text-blue-600 hover:underline text-xs sm:text-sm transition-all duration-200 whitespace-nowrap flex-shrink-0"
                  >
                    <span>Visit</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
