import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { supabase } from "../supabase";

function LoginPage({ sessionError }) {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [oauthError, setOauthError] = useState("");
  const authError = searchParams.get("error");

  async function handleLoginWithGitHub() {
    setIsLoading(true);
    setOauthError("");

    const { error } = await supabase.auth.signInWithOAuth({
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: "repo read:user user:email"
      },
      provider: "github"
    });

    if (error) {
      setIsLoading(false);
      setOauthError(error.message);
    }
  }

  return (
    <main className="login-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="section-label">AI-powered DevSecOps</p>
          <h1>Confidence for every merge, before your pipeline breaks.</h1>
          <p className="hero-text">
            DevPulse connects to GitHub, understands your repositories, and
            turns noisy engineering risk into a clean operational signal your
            team can act on.
          </p>

          <div className="hero-actions">
            <button
              className="primary-button"
              disabled={isLoading}
              onClick={handleLoginWithGitHub}
              type="button"
            >
              {isLoading ? "Redirecting to GitHub..." : "Login with GitHub"}
            </button>
            <span className="hero-note">
              Supabase handles the OAuth redirect flow so your login feels like a
              standard hosted sign-in.
            </span>
          </div>

          {authError ? (
            <div className="feedback-card feedback-error">
              GitHub login failed. Double-check your Supabase GitHub provider
              setup and allowed redirect URLs, then try again.
            </div>
          ) : null}

          {sessionError ? (
            <div className="feedback-card feedback-error">{sessionError}</div>
          ) : null}

          {oauthError ? (
            <div className="feedback-card feedback-error">{oauthError}</div>
          ) : null}
        </div>

        <div className="hero-visual">
          <div className="signal-card">
            <p className="signal-label">What DevPulse will show</p>
            <div className="signal-row">
              <span>Risk score</span>
              <strong>72</strong>
            </div>
            <div className="signal-row">
              <span>Failure prediction</span>
              <strong>61%</strong>
            </div>
            <div className="signal-row">
              <span>Critical vulnerabilities</span>
              <strong>3</strong>
            </div>
          </div>

          <div className="note-card">
            <h2>Next phases already planned</h2>
            <p>
              GitHub Actions, Trivy, Python failure prediction, and AI
              explanations plug into this dashboard next.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
