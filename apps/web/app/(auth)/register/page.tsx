"use client";

import "@/styles/auth/auth.scss";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api-client";
import Link from "next/link";


export default function RegisterPage() {
    const router = useRouter();
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await register({ displayName, email, password });
            router.push("/login")
        }
        catch {
            setError("Registration failed. That email may already be taken.");
        }
        finally {
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
            <div className="heading__title">Start training</div>
            <div className="heading__subtext">
              Free - build your library and log your first workout today.
            </div>
          </div>
        </div>
        <div className="auth-form">
          <div className="auth-element">
            <div className="auth-element__tag">Name</div>
            <div className="auth-element__input">
              <input
                type="text"
                placeholder="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>

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
            <button
              type="submit"
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? "Creating account..." : "Sign up"}
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
          <div className="footer__text">By continuing you agree to the Terms & Privacy Policy.</div>
          <div className="footer__text">Already have an account?</div>

          <Link className="footer__link" href="/login">Log in</Link>
        </div>
      </div>
    );
}