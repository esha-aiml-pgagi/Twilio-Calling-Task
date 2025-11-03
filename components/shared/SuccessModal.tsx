"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  redirectTo: string;
}

export default function SuccessModal({
  isOpen,
  message,
  onClose,
  redirectTo,
}: SuccessModalProps) {
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
        router.push(redirectTo);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, redirectTo, router]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full mx-4 animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">{message}</h3>
          <p className="text-sm text-gray-500">Redirecting...</p>
        </div>
      </div>
    </div>
  );
}
