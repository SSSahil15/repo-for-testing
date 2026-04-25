import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import {
  apiRequest,
  removeGitHubProviderToken,
  syncGitHubProviderToken
} from "./api";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import { mapSupabaseUser, supabase } from "./supabase";

function LoadingScreen() {
  return (
    <div className="screen-center">
      <div className="loading-stack">
        <div className="pulse-orb" />
        <p>Loading your DevPulse workspace...</p>
      </div>
    </div>
  );
}

function App() {
  const [session, setSession] = useState({
    error: "",
    accessToken: "",
    githubTokenSynced: null,
    rawSession: null,
    status: "loading",
    user: null
  });

  useEffect(() => {
    let isMounted = true;

    async function applySession(nextSession) {
      if (!isMounted) {
        return;
      }

      if (!nextSession) {
        setSession({
          accessToken: "",
          error: "",
          githubTokenSynced: null,
          rawSession: null,
          status: "anonymous",
          user: null
        });
        return;
      }

      setSession({
        accessToken: nextSession.access_token,
        error: "",
        githubTokenSynced: null,
        rawSession: nextSession,
        status: "authenticated",
        user: mapSupabaseUser(nextSession.user)
      });

      try {
        const authState = await apiRequest("/auth/me", {
          accessToken: nextSession.access_token
        });

        if (!isMounted) {
          return;
        }

        setSession((currentValue) => ({
          ...currentValue,
          githubTokenSynced: Boolean(authState.githubTokenSynced)
        }));
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setSession((currentValue) => ({
          ...currentValue,
          error: error.message
        }));
      }

      if (nextSession.provider_token) {
        try {
          await syncGitHubProviderToken(nextSession);
          if (!isMounted) {
            return;
          }

          setSession((currentValue) => ({
            ...currentValue,
            githubTokenSynced: true
          }));
        } catch (error) {
          if (!isMounted) {
            return;
          }

          setSession((currentValue) => ({
            ...currentValue,
            error: error.message
          }));
        }
      }
    }

    async function loadSession() {
      try {
        const {
          data: { session: currentSession }
        } = await supabase.auth.getSession();

        await applySession(currentSession);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setSession({
          accessToken: "",
          error: "",
          githubTokenSynced: null,
          rawSession: null,
          status: "anonymous",
          user: null
        });
      }
    }

    loadSession();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      void applySession(nextSession);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    try {
      await removeGitHubProviderToken(session.accessToken);
    } catch (error) {
      // If the backend token is already gone, we still want to sign the user out.
    }

    await supabase.auth.signOut();
  }

  async function handleSessionExpired(message) {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      // If sign out fails, we still force the UI back to login.
    }

    setSession({
      accessToken: "",
      error: message || "Your session expired. Please sign in again.",
      githubTokenSynced: null,
      rawSession: null,
      status: "anonymous",
      user: null
    });
  }

  if (session.status === "loading") {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          session.status === "authenticated" ? (
            <Navigate replace to="/dashboard" />
          ) : (
            <LoginPage sessionError={session.error} />
          )
        }
      />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route
        path="/dashboard"
        element={
          session.status !== "authenticated" ? (
            <Navigate replace to="/login" />
          ) : (
            <DashboardPage
              accessToken={session.accessToken}
              githubTokenSynced={session.githubTokenSynced}
              onLogout={handleLogout}
              onSessionExpired={handleSessionExpired}
              user={session.user}
            />
          )
        }
      />
      <Route
        path="*"
        element={
          <Navigate
            replace
            to={session.status === "authenticated" ? "/dashboard" : "/login"}
          />
        }
      />
    </Routes>
  );
}

export default App;
