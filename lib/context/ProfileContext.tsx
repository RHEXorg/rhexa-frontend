"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

interface UserProfile {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  organization_id: number;
  auth_provider: string;
}

interface ProfileContextType {
  user: UserProfile | null;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  isUploadingAvatar: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000";

/**
 * Compress an image file client-side.
 * If the image is > maxSizeKB, it progressively reduces quality/dimensions.
 */
async function compressImage(file: File, maxSizeKB: number = 500): Promise<File> {
  return new Promise((resolve, reject) => {
    // If already small enough, return as-is
    if (file.size <= maxSizeKB * 1024) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;

        // Calculate target dimensions (max 400x400 for avatar)
        let { width, height } = img;
        const maxDim = 400;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Try progressively lower quality until under maxSizeKB
        let quality = 0.85;
        const tryCompress = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Compression failed"));
                return;
              }
              if (blob.size <= maxSizeKB * 1024 || quality <= 0.3) {
                const compressed = new File([blob], file.name, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                });
                resolve(compressed);
              } else {
                quality -= 0.1;
                tryCompress();
              }
            },
            "image/jpeg",
            quality
          );
        };
        tryCompress();
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const refreshProfile = useCallback(async () => {
    try {
      const response = await api.get("/api/auth/me");
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const uploadAvatar = useCallback(async (file: File) => {
    // Validate file type
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      toast.error("Only JPEG, PNG, WebP, or GIF images are allowed.");
      return;
    }

    setIsUploadingAvatar(true);
    try {
      // Compress image client-side before upload
      const compressed = await compressImage(file, 500);

      const formData = new FormData();
      formData.append("file", compressed);

      const response = await api.post("/api/auth/me/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(response.data);
      toast.success("Profile photo updated.");
    } catch (error: any) {
      const detail = error?.response?.data?.detail || "Failed to upload image.";
      toast.error(detail);
    } finally {
      setIsUploadingAvatar(false);
    }
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        user,
        isLoading,
        refreshProfile,
        uploadAvatar,
        isUploadingAvatar,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}

/**
 * Helper to get the full avatar URL from the backend path.
 */
export function getAvatarUrl(avatarPath: string | null | undefined): string | null {
  if (!avatarPath) return null;
  return `${API_URL}${avatarPath}`;
}
