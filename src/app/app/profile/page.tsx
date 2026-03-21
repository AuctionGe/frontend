"use client";

import { useEffect, useState } from "react";
import { SourceHealth, fetchSourcesHealth, getSourceLabel } from "@/lib/api";
import { SourceLogo } from "@/components/lot/SourceLogo";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import { useFavorites } from "@/lib/favorites/context";
import { useAuth } from "@/lib/firebase/auth-context";
import { Locale } from "@/lib/i18n/translations";

const LANGUAGES: { code: Locale; label: string; flag: string }[] = [
  { code: "ka", label: "ქართული", flag: "🇬🇪" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
];

export default function ProfilePage() {
  const { locale, setLocale, t } = useI18n();
  const { count: favCount } = useFavorites();
  const { user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut, error, clearError } = useAuth();
  const [health, setHealth] = useState<SourceHealth[]>([]);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    fetchSourcesHealth().then(setHealth).catch(console.error);
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === "signup") {
      await signUpWithEmail(email, password, name);
    } else {
      await signInWithEmail(email, password);
    }
  };

  return (
    <div className="px-5 pt-[env(safe-area-inset-top)] mt-4 lg:pt-0 lg:max-w-3xl lg:mx-auto">
      <header className="mb-6">
        <h1 className="text-[22px] font-bold text-text tracking-tight lg:text-[28px]">{t("profile.title")}</h1>
        <p className="text-[13px] text-text-secondary mt-0.5">{t("profile.subtitle")}</p>
      </header>

      {/* Auth section */}
      {!loading && (
        <section className="mb-6">
          {user ? (
            /* Logged in */
            <div className="bg-surface rounded-2xl p-5">
              <div className="flex items-center gap-3.5">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-copper flex items-center justify-center text-white font-bold text-[18px]">
                    {(user.displayName || user.email || "U")[0].toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[16px] font-semibold text-text truncate">
                    {user.displayName || "User"}
                  </p>
                  <p className="text-[13px] text-text-secondary truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={signOut}
                className="w-full mt-4 py-2.5 rounded-xl text-[14px] font-medium text-danger bg-danger-light hover:bg-danger/10 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            /* Not logged in */
            <div className="bg-surface rounded-2xl p-5">
              {/* Google sign-in */}
              <button
                onClick={signInWithGoogle}
                className="w-full flex items-center justify-center gap-3 py-3 bg-white rounded-xl border border-border hover:border-gray-300 hover:shadow-sm transition-all text-[14px] font-medium text-text"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-[12px] text-text-secondary">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Email form */}
              <form onSubmit={handleEmailSubmit} className="space-y-3">
                {authMode === "signup" && (
                  <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => { setName(e.target.value); clearError(); }}
                    className="w-full bg-white rounded-xl border border-border px-4 py-2.5 text-[14px] outline-none focus:border-copper/40 transition-colors"
                  />
                )}
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError(); }}
                  className="w-full bg-white rounded-xl border border-border px-4 py-2.5 text-[14px] outline-none focus:border-copper/40 transition-colors"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError(); }}
                  className="w-full bg-white rounded-xl border border-border px-4 py-2.5 text-[14px] outline-none focus:border-copper/40 transition-colors"
                  required
                  minLength={6}
                />

                {error && (
                  <p className="text-[13px] text-danger bg-danger-light px-3 py-2 rounded-lg">{error}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-copper hover:bg-copper-dark text-white font-semibold text-[14px] rounded-xl transition-colors"
                >
                  {authMode === "signup" ? "Create Account" : "Sign In"}
                </button>
              </form>

              {/* Toggle mode */}
              <p className="text-center text-[13px] text-text-secondary mt-3">
                {authMode === "signin" ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => { setAuthMode(authMode === "signin" ? "signup" : "signin"); clearError(); }}
                  className="text-copper font-medium ml-1"
                >
                  {authMode === "signin" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          )}
        </section>
      )}

      {/* Favorites */}
      <Link href="/app/favorites" className="block mb-6 bg-surface rounded-2xl p-4 hover:bg-border/50 transition-colors active:scale-[0.99]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-danger" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <div>
              <p className="text-[15px] font-semibold text-text">Favorites</p>
              <p className="text-[12px] text-text-secondary">{favCount} saved lots</p>
            </div>
          </div>
          <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </div>
      </Link>

      {/* Language selector */}
      <section className="mb-6">
        <h2 className="text-[15px] font-semibold text-text mb-3">{t("profile.language")}</h2>
        <div className="flex gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLocale(lang.code)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-[14px] transition-colors ${
                locale === lang.code
                  ? "border-copper bg-copper-light text-copper-dark font-medium"
                  : "border-border text-text-secondary hover:bg-surface"
              }`}
            >
              <span>{lang.flag}</span>
              {lang.label}
            </button>
          ))}
        </div>
      </section>

      {/* Data sources health */}
      <section>
        <h2 className="text-[15px] font-semibold text-text mb-3">{t("profile.data_sources")}</h2>
        <div className="space-y-2.5">
          {health.filter(s => s.source !== "bog").map((source) => (
            <div
              key={source.source}
              className="bg-surface rounded-2xl p-4 flex items-center gap-3"
            >
              <SourceLogo source={source.source} size="md" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-semibold text-text">
                    {getSourceLabel(source.source)}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${
                    source.is_healthy ? "bg-success" : "bg-danger"
                  }`} />
                </div>
                <p className="text-[12px] text-text-secondary mt-0.5">
                  {source.lots_count.toLocaleString()} {t("profile.lots")}
                  {source.last_success && (
                    <> · {t("profile.synced")} {new Date(source.last_success).toLocaleTimeString()}</>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
