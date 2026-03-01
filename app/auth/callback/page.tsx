"use client";

import { Suspense } from "react";
import AuthCallbackContent from "./auth-callback-content";

export const dynamic = "force-dynamic";

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
