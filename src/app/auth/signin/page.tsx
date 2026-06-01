"use client";

import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import LoginCardSection from "@/components/ui/login-signup";

function SignInContent() {
  return <LoginCardSection />;
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-zinc-950">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-50" />
        </main>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
