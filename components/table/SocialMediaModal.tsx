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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md transition-all duration-300 modal-background">
        <DialogHeader>
          <DialogTitle>Social Media Links - {contact.name}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {contact.socialMedia.length === 0 ? (
            <p className="text-center text-muted-foreground italic">
              No social media links available
            </p>
          ) : (
            <div className="space-y-3">
              {contact.socialMedia.map((link, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-all duration-200"
                  style={{
                    animation: `slideIn 0.3s ease-out ${index * 50}ms both`,
                  }}
                >
                  <span className="font-medium text-sm">{link.platform}</span>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:underline text-sm transition-all duration-200"
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
