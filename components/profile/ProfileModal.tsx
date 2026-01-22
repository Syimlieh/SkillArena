"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import Modal from "@/components/ui/Modal";
import { useAuth } from "@/context/AuthContext";
import apiClient from "@/lib/apiClient";
import { Profile } from "@/types/profile.types";
import { uploadImageDirect } from "@/lib/presigned-upload";
import { FileType } from "@/types/file.types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const inputClass =
  "w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:outline-none placeholder:text-[var(--text-secondary)]";

const ProfileModal = ({ isOpen, onClose }: Props) => {
  const { refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [profileFileId, setProfileFileId] = useState<string | undefined>(undefined);
  const [preview, setPreview] = useState<string | null>(null);
  const [verifySending, setVerifySending] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get("/api/profile");
        const data = res.data?.profile ?? res.data?.data?.profile ?? null;
        if (data) {
          setProfile(data);
          setName(data.name ?? "");
          setPhone(data.phone ?? "");
          setProfileFileId(data.profileFileId);
          setPreview(data.avatarUrl ?? null);
        }
      } catch {
        setError("Unable to load profile right now.");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [isOpen]);

  useEffect(
    () => () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    },
    [preview]
  );

  const handleUpload = async (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
      return;
    }
    setError(null);
    try {
      const localPreview = URL.createObjectURL(file);
      setPreview(localPreview);
      const uploaded = await uploadImageDirect(file, { type: FileType.PROFILE, folder: "profiles" });
      setProfileFileId(uploaded.fileId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await apiClient.patch("/api/profile", {
        name: name.trim(),
        phone: phone.trim() || undefined,
        profileFileId,
      });
      await refreshProfile();
      onClose();
    } catch (err: any) {
      const errorPayload = err?.response?.data?.error;
      const message =
        (typeof errorPayload === "string" ? errorPayload : errorPayload?.message) ||
        err?.response?.data?.message ||
        "Unable to update profile right now.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyEmail = async () => {
    setVerifySending(true);
    setVerifyMessage(null);
    setError(null);
    try {
      await apiClient.post("/api/auth/verify/request");
      setVerifyMessage("Verification email sent. Check your inbox.");
    } catch (err: any) {
      const errorPayload = err?.response?.data?.error;
      const message =
        (typeof errorPayload === "string" ? errorPayload : errorPayload?.message) ||
        err?.response?.data?.message ||
        "Unable to send verification email right now.";
      setError(message);
    } finally {
      setVerifySending(false);
    }
  };

  const avatarLabel = useMemo(() => {
    if (preview) return "Change";
    return "Upload";
  }, [preview]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Profile">
      <div className="space-y-4">
        {loading ? (
          <div className="text-sm text-(--text-secondary)">Loading profile...</div>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <label className="flex h-16 w-16 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed border-[var(--border-subtle)] bg-[var(--card-bg)] text-xs text-[var(--text-secondary)] hover:border-[var(--accent-primary)]">
                {preview ? (
                  <img src={preview} alt="Profile preview" className="h-full w-full object-cover" />
                ) : (
                  <span>{avatarLabel}</span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleUpload(e.target.files?.[0])}
                />
              </label>
              <div className="text-xs text-[var(--text-secondary)]">
                JPG or PNG up to 5MB. This picture will be used on your profile.
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--text-primary)]">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Full name" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--text-primary)]">Email</label>
              <input value={profile?.email ?? ""} disabled className={clsx(inputClass, "opacity-70")} />
              {profile?.emailVerified ? (
                <p className="text-xs text-[var(--text-secondary)]">Email verified.</p>
              ) : (
                <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                  <span>Email not verified.</span>
                  <button
                    type="button"
                    onClick={handleVerifyEmail}
                    className="text-[var(--accent-primary)] hover:underline"
                    disabled={verifySending}
                  >
                    {verifySending ? "Sending..." : "Resend verification"}
                  </button>
                </div>
              )}
              {verifyMessage && <p className="text-xs text-[var(--accent-primary)]">{verifyMessage}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--text-primary)]">Phone</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
                placeholder="+91 9876543210"
                disabled={profile?.phoneLocked}
              />
              {profile?.phoneLocked && (
                <p className="text-xs text-[var(--text-secondary)]">Phone number is locked for hosts.</p>
              )}
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="flex items-center justify-end gap-3">
              <button
                className="rounded-xl px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                onClick={onClose}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--accent-secondary)]"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ProfileModal;
