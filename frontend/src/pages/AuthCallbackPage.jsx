import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { syncGitHubProviderToken } from "../api";
import { supabase } from "../supabase";

function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function handleCallback() {
      const providerError =
        searchParams.get("error_description") || searchParams.get("error");

      if (providerError) {
        navigate("/login?error=supabase_auth_failed", { replace: true });
        return;
      }

      const authCode = searchParams.get("code");

      if (!authCode) {
        navigate("/login?error=missing_auth_code", { replace: true });
        return;
      }

      const { data, error } = await supabase.auth.exchangeCodeForSession(authCode);

      if (error || !data.session) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(
          error?.message || "Supabase could not finish the GitHub sign-in flow."
        );
        return;
      }

      try {
        await syncGitHubProviderToken(data.session);
        navigate("/dashboard", { replace: true });
      } catch (syncError) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(
          syncError.message ||
            "GitHub login succeeded, but DevPulse could not sync your GitHub token to the backend."
        );
      }
    }

    handleCallback();

    return () => {
      isMounted = false;
    };
  }, [navigate, searchParams]);

  return (
    <div className="screen-center">
      <div className="loading-stack">
        <div className="pulse-orb" />
        <p>
          {errorMessage || "Finishing your GitHub sign-in and preparing DevPulse..."}
        </p>
      </div>
    </div>
  );
}

export default AuthCallbackPage;

