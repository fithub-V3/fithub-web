"use client";
import "@/styles/auth/auth.scss";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, setTokens } from "@/lib/auth-client";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { accessToken, refreshToken } = await login({ email, password });

      // TEMPORARY - fine for now, we'll swap this for something more secure
      // once we build proper auth-state handling.
      setTokens(accessToken, refreshToken);

      router.push("/exercises");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="text">
        <div className="brand">
          <div className="brand__image">PLACEHOLDER</div>
          <div className="brand__text">Fithub</div>
        </div>
        <div className="heading">
          <div className="heading__title">Welcome back</div>
          <div className="heading__subtext">Log in to pick up where you left off.</div>
        </div>
      </div>
      <div className="auth-form">
        <div className="auth-element">
          <div className="auth-element__tag">Email</div>
          <div className="auth-element__input">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="auth-element">
          <div className="auth-element__tag">Password</div>
          <div className="auth-element__input">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="auth-element__error">
          {error && <p style={{ color: "red" }}>{error}</p>}        
        </div>
        <div className="auth-element__submit-button">
          <button type="submit" disabled={isSubmitting} onClick={handleSubmit}>
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-700"></div>
          <span className="text-sm text-gray-500">or</span>
          <div className="h-px flex-1 bg-gray-700"></div>
        </div>
        <div className="auth-element__alt-button">
          <button type="submit" disabled={isSubmitting}>
            Continue with Google
          </button>
        </div>
      </div>
      <div className="footer">
        <div className="footer__text">New here?</div>
        <Link className="footer__link" href="/register">Create an account</Link>
      </div>
    </div>
  );
}