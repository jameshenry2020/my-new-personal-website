"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  // If redirected because of an auth error
  const authError = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        setError("Invalid email address or cryptographic access key.");
      } else {
        router.refresh();
        router.push(callbackUrl);
      }
    } catch (err) {
      console.error(err);
      setError("An operational error occurred during authentication.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-sm w-full bg-card-paper p-8 border border-border-paper">
      <div className="text-center space-y-1.5">
        <h1 className="font-serif text-2xl font-bold text-fg-ink">Secure Gateway</h1>
        <p className="meta-mono">Console Access Authorized Personnel Only</p>
      </div>

      {(error || authError) && (
        <div className="p-3 border border-red-500/35 bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-mono flex items-start gap-2">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <span>{error || "Authentication check failed. Access denied."}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="meta-mono">
            Identity Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-bg-paper border border-border-paper px-4 py-2.5 text-xs font-mono rounded-none focus:outline-none focus:border-copper text-fg-ink"
            placeholder="admin@henrydev.online"
            disabled={isPending}
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label htmlFor="pass" className="meta-mono">
            Cryptographic Access Key
          </label>
          <input
            id="pass"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-bg-paper border border-border-paper px-4 py-2.5 text-xs font-mono rounded-none focus:outline-none focus:border-copper text-fg-ink"
            placeholder="••••••••••••"
            disabled={isPending}
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full border border-fg-ink bg-fg-ink text-bg-paper py-3 text-xs font-mono hover:bg-copper hover:border-copper disabled:bg-muted-paper disabled:border-muted-paper transition-all flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 size={12} className="animate-spin" /> Verifying Credentials...
            </>
          ) : (
            "Authenticate Access"
          )}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[50vh] py-12">
      <Suspense fallback={<div className="font-mono text-xs text-muted-paper">Loading Security Interface...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
