"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SuccessModal from "@/components/shared/SuccessModal";
import styles from "@/styles/modules/auth.module.css";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate sending reset link
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    setShowModal(true);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.formCard}>
          <button
            onClick={() => router.push("/login")}
            className={styles.backButton}
            aria-label="Back to login"
          >
            <ArrowLeft />
          </button>

          <div className={styles.header}>
            <Image
              src="/logo.png"
              alt="PGAGI Logo"
              width={64}
              height={64}
              className={styles.logo}
              priority
            />
            <h1 className={styles.title}>Forgot Password</h1>
            <p className={styles.subtitle}>
              Enter your email to receive a reset link
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className={styles.input}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className={styles.submitButton}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </div>
      </div>

      <SuccessModal
        isOpen={showModal}
        message="Email sent successfully!"
        onClose={() => setShowModal(false)}
        redirectTo="/login"
      />
    </>
  );
}
