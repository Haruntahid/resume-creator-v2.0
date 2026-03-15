"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { config } from "@/lib/config";

export default function Home() {
  const router = useRouter();
  const {
    user,
    loading,
    authLoading,
    signInWithGoogle,
    registerWithPhone,
    signInWithPhone,
  } = useAuth();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold">
            {config.projectName}
          </CardTitle>
          <CardDescription className="text-lg">
            Create professional ATS-friendly resumes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>✨ Beautiful templates</p>
            <p>🤖 AI-powered parsing & enhancements</p>
            <p>💾 Auto-save & versioning</p>
            <p>📄 PDF export</p>
          </div>
          <div className="space-y-3">
            <Button
              onClick={signInWithGoogle}
              className="w-full"
              size="lg"
              disabled={authLoading}
            >
              {authLoading ? "Signing in..." : "Sign in with Google"}
            </Button>
            <div className="h-px bg-border" />
            <form
              className="space-y-3"
              onSubmit={async (e: FormEvent) => {
                e.preventDefault();
                if (!phone || !password) return;
                if (isRegister) {
                  await registerWithPhone(phone, password);
                } else {
                  await signInWithPhone(phone, password);
                }
              }}
            >
              <input
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm bg-background"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-sm bg-background"
              />
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={authLoading}
              >
                {isRegister ? "Register with phone" : "Login with phone"}
              </Button>
              <button
                type="button"
                className="w-full text-xs text-muted-foreground underline"
                onClick={() => setIsRegister((prev) => !prev)}
              >
                {isRegister
                  ? "Already have an account? Login"
                  : "New here? Create account with phone"}
              </button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
