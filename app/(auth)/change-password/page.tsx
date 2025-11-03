"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SuccessModal from "@/components/shared/SuccessModal";
import styles from "@/styles/modules/auth.module.css";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    
    // Simulate password change
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    setShowModal(true);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.formCard}>
          <button
            onClick={() => router.push("/dashboard")}
            className={styles.backButton}
            aria-label="Back to dashboard"
          >
            <ArrowLeft />
          </button>

          <div className={styles.header}>
            <h1 className={styles.title}>Change Password</h1>
            <p className={styles.subtitle}>Enter your current and new password</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="oldPassword" className={styles.label}>
                Old Password
              </label>
              <Input
                id="oldPassword"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter old password"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="newPassword" className={styles.label}>
                New Password
              </label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                className={styles.input}
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <Button
              type="submit"
              disabled={isLoading}
              className={styles.submitButton}
            >
              {isLoading ? "Changing..." : "Change Password"}
            </Button>
          </form>
        </div>
      </div>

      <SuccessModal
        isOpen={showModal}
        message="Password changed successfully!"
        onClose={() => setShowModal(false)}
        redirectTo="/dashboard"
      />
    </>
  );
}
