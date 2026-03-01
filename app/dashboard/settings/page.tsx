"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  User,
  Shield,
  Building2,
  Save,
  Loader2,
  Users,
  Camera,
  Trash2,
  Lock,
} from "lucide-react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { useProfile, getAvatarUrl } from "@/lib/context/ProfileContext";

type Tab = "profile" | "organization" | "security" | "members";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { user, refreshProfile, uploadAvatar, isUploadingAvatar } = useProfile();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
  });

  const [orgData, setOrgData] = useState({
    name: "",
    id: "",
  });

  const [members, setMembers] = useState<any[]>([]);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [passwordFormData, setPasswordFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  // Sync form data when user profile loads/changes
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
      });
    }
  }, [user]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch org data & members in parallel with short timeout or simple catch
      const [orgRes, membersRes] = await Promise.all([
        api.get("/api/organization/settings").catch((e) => {
          console.error("Org fetch failed", e);
          return { data: { name: "", id: "" } };
        }),
        api.get("/api/organization/members").catch((e) => {
          console.error("Members fetch failed", e);
          return { data: [] };
        })
      ]);

      setOrgData(orgRes.data);
      setMembers(membersRes.data);
    } catch (error) {
      console.error("Critical settings fetch error", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.put("/api/auth/me", {
        first_name: formData.first_name,
        last_name: formData.last_name,
      });
      toast.success("Profile updated successfully.");
      refreshProfile();
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.put("/api/organization/settings", {
        name: orgData.name,
      });
      toast.success("Organization updated successfully.");
    } catch (error) {
      toast.error("Failed to update organization.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordFormData.new_password !== passwordFormData.confirm_password) {
      toast.error("New passwords do not match.");
      return;
    }
    setIsSaving(true);
    try {
      await api.post("/api/auth/change-password", {
        old_password: passwordFormData.old_password,
        new_password: passwordFormData.new_password,
      });
      toast.success("Password updated successfully.");
      setPasswordFormData({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (error: any) {
      const detail = error.response?.data?.detail || "Failed to update password.";
      toast.error(detail);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadAvatar(file);
    }
    e.target.value = "";
  };

  const handleRemoveAvatar = async () => {
    try {
      await api.put("/api/auth/me", { avatar_url: "" });
      toast.success("Profile photo removed.");
      refreshProfile();
    } catch (error) {
      toast.error("Failed to remove photo.");
    }
  };

  const avatarUrl = getAvatarUrl(user?.avatar_url);
  const initials =
    user?.first_name?.[0] || user?.email?.[0]?.toUpperCase() || "U";

  if (isLoading && !user) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div>
        <h1 className="text-3xl font-black tracking-tight">
          Management Console
        </h1>
        <p className="text-muted mt-1">
          Configure your personal experience and organization standards.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: "profile", label: "My Profile", icon: User },
            { id: "organization", label: "Organization", icon: Building2 },
            { id: "members", label: "Team Members", icon: Users },
            { id: "security", label: "Security", icon: Shield },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={cn(
                "w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all border",
                activeTab === tab.id
                  ? "bg-primary/10 text-primary border-primary/20 shadow-sm"
                  : "text-muted hover:bg-white/5 border-transparent"
              )}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3">
          {activeTab === "profile" && (
            <div className="glass p-8 rounded-[2rem] border border-white/5 space-y-8">
              {/* Profile Avatar Section */}
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-white/5">
                <div className="relative group flex-shrink-0">
                  {/* Avatar circle */}
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 shadow-xl">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl font-black text-white">
                        {initials}
                      </div>
                    )}
                  </div>

                  {/* Upload overlay */}
                  <button
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={isUploadingAvatar}
                    className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="Change profile photo"
                  >
                    {isUploadingAvatar ? (
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    ) : (
                      <Camera className="w-6 h-6 text-white" />
                    )}
                  </button>
                </div>

                <div className="text-center sm:text-left flex-1">
                  <h3 className="text-xl font-black">
                    {user?.first_name} {user?.last_name}
                  </h3>
                  <p className="text-muted font-medium">{user?.email}</p>
                  <div className="flex items-center gap-3 mt-3 justify-center sm:justify-start">
                    <button
                      onClick={() => avatarInputRef.current?.click()}
                      disabled={isUploadingAvatar}
                      className="text-xs font-bold text-primary hover:text-primary/80 transition-colors"
                    >
                      {isUploadingAvatar ? "Uploading..." : "Upload Photo"}
                    </button>
                    {user?.avatar_url && (
                      <>
                        <span className="text-white/10">|</span>
                        <button
                          onClick={handleRemoveAvatar}
                          className="text-xs font-bold text-muted hover:text-red-400 transition-colors"
                        >
                          Remove
                        </button>
                      </>
                    )}
                  </div>
                  <p className="text-[10px] text-muted/50 mt-1">
                    JPEG, PNG, WebP, or GIF. Auto-compressed if over 500KB.
                  </p>
                </div>

                {/* Hidden file input */}
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) =>
                        setFormData({ ...formData, first_name: e.target.value })
                      }
                      className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground focus:border-primary/50 outline-none transition-all placeholder:text-muted/30"
                      placeholder="e.g. John"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) =>
                        setFormData({ ...formData, last_name: e.target.value })
                      }
                      className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground focus:border-primary/50 outline-none transition-all placeholder:text-muted/30"
                      placeholder="e.g. Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    readOnly
                    className="w-full bg-white/2 border border-white/5 rounded-xl px-4 py-3 text-sm text-muted cursor-not-allowed opacity-60"
                  />
                  <p className="text-[10px] text-muted italic ml-1">
                    Email changes require administrative verification.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-primary hover:bg-accent text-white px-8 py-4 rounded-xl font-black transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  Save Profile Changes
                </button>
              </form>
            </div>
          )}

          {activeTab === "organization" && (
            <div className="glass p-8 rounded-[2rem] border border-white/5 space-y-8">
              <div className="p-6 bg-primary/5 border border-primary/10 rounded-3xl flex items-center gap-4">
                <Building2 className="w-10 h-10 text-primary" />
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-primary/60">
                    Organization ID
                  </p>
                  <code className="text-sm font-bold text-primary">
                    {orgData.id}
                  </code>
                </div>
              </div>

              <form onSubmit={handleUpdateOrg} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    value={orgData.name}
                    onChange={(e) =>
                      setOrgData({ ...orgData, name: e.target.value })
                    }
                    className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground focus:border-primary/50 outline-none transition-all"
                  />
                  <p className="text-[10px] text-muted ml-1 italic">
                    This name will appear on all shared reports and AI
                    dashboards.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-primary hover:bg-accent text-white px-8 py-4 rounded-xl font-black transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  Update Organization
                </button>
              </form>
            </div>
          )}

          {activeTab === "members" && (
            <div className="glass rounded-[2rem] border border-white/5 overflow-hidden">
              <div className="p-8 border-b border-white/5">
                <h3 className="text-xl font-black">Team Members</h3>
                <p className="text-sm text-muted mt-1">
                  Manage users with access to this knowledge base.
                </p>
              </div>
              <div className="divide-y divide-white/5 mx-2">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-all rounded-2xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center font-bold text-muted border border-white/5 overflow-hidden">
                        {member.avatar_url ? (
                          <img
                            src={getAvatarUrl(member.avatar_url) || ""}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          member.first_name?.[0] ||
                          member.email[0].toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-sm">
                          {member.first_name} {member.last_name || "(User)"}
                        </p>
                        <p className="text-xs text-muted font-medium">
                          {member.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                          member.is_active
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        )}
                      >
                        {member.is_active ? "Active" : "Disabled"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="glass p-8 rounded-[2rem] border border-white/5 space-y-8">
              <div className="flex items-center gap-4 pb-6 border-b border-white/5">
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-black">Security Protocols</h3>
                  <p className="text-sm text-muted">Manage your access credentials and account protection.</p>
                </div>
              </div>

              {user?.auth_provider === "local" ? (
                <form onSubmit={handleChangePassword} className="space-y-6 max-w-md">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/40" />
                        <input
                          type="password"
                          value={passwordFormData.old_password}
                          onChange={(e) => setPasswordFormData({...passwordFormData, old_password: e.target.value})}
                          className="w-full bg-surface border border-white/10 rounded-xl px-11 py-3 text-sm text-foreground focus:border-primary/50 outline-none transition-all"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/40" />
                        <input
                          type="password"
                          value={passwordFormData.new_password}
                          onChange={(e) => setPasswordFormData({...passwordFormData, new_password: e.target.value})}
                          className="w-full bg-surface border border-white/10 rounded-xl px-11 py-3 text-sm text-foreground focus:border-primary/50 outline-none transition-all"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/40" />
                        <input
                          type="password"
                          value={passwordFormData.confirm_password}
                          onChange={(e) => setPasswordFormData({...passwordFormData, confirm_password: e.target.value})}
                          className="w-full bg-surface border border-white/10 rounded-xl px-11 py-3 text-sm text-foreground focus:border-primary/50 outline-none transition-all"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-primary hover:bg-accent text-white px-8 py-4 rounded-xl font-black transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Update Password Sequence
                  </button>
                </form>
              ) : (
                <div className="p-8 bg-white/2 border border-white/5 rounded-3xl text-center space-y-4">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                    <Shield className="w-8 h-8 text-muted/20" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-black text-lg">External Authentication</h4>
                    <p className="text-sm text-muted max-w-xs mx-auto">
                      Your account is managed via <span className="text-primary font-bold uppercase">{user?.auth_provider}</span>. Password management is handled by your provider.
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-8 border-t border-white/5">
                <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-3xl flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-red-500">Deactivate Terminal</h4>
                    <p className="text-xs text-muted">Temporarily disable your access to the RheXa network.</p>
                  </div>
                  <button className="px-4 py-2 border border-red-500/20 text-red-500 rounded-lg text-xs font-black hover:bg-red-500/10 transition-all">
                    Deactivate
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
