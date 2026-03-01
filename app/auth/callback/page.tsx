"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      router.push(`/login?error=${error}`);
      return;
    }

    if (token) {
      // Store the token
      Cookies.set("rhexa_token", token, { expires: 7 });
      // Redirect to dashboard
      router.push("/dashboard");
    } else {
      router.push("/login?error=no_token");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
      <div className="text-center space-y-6">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin mx-auto" />
        <p className="text-white/60 font-mono uppercase tracking-widest text-sm">
          Establishing Neural Link...
        </p>
      </div>
    </div>
  );
}
