"use client";

import React, { useRef } from "react";
import { Search, Menu, Camera, Loader2 } from "lucide-react";
import { useLayout } from "@/lib/context/LayoutContext";
import { useProfile, getAvatarUrl } from "@/lib/context/ProfileContext";

export const TopBar = () => {
  const { toggleSidebar } = useLayout();
  const { user, uploadAvatar, isUploadingAvatar } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadAvatar(file);
    }
    // Reset input so the same file can be re-selected
    e.target.value = "";
  };

  const avatarUrl = getAvatarUrl(user?.avatar_url);
  const initials = user?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || "U";
  const displayName = user?.first_name
    ? `${user.first_name} ${user.last_name || ""}`
    : user?.email?.split("@")[0] || "User";

  return (
    <header className="h-20 border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={toggleSidebar}
          className="p-2 text-muted hover:text-white lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="relative w-full max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search documents or messages..."
            className="w-full pl-12 pr-4 py-2.5 bg-surface/50 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 pl-6 border-l border-white/5">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-foreground truncate max-w-[150px]">
              {displayName}
            </p>
            <p className="text-xs text-muted">Organization Member</p>
          </div>

          {/* Avatar with upload */}
          <button
            onClick={handleAvatarClick}
            disabled={isUploadingAvatar}
            className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/10 shadow-lg cursor-pointer group transition-all hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/30 flex-shrink-0"
            title="Upload profile photo"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                {initials}
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {isUploadingAvatar ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : (
                <Camera className="w-4 h-4 text-white" />
              )}
            </div>
          </button>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
    </header>
  );
};
