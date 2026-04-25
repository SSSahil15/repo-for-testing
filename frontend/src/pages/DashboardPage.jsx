import { startTransition, useDeferredValue, useEffect, useState } from "react";

import { ApiError, apiRequest } from "../api";
import AnalysisPanel from "../components/AnalysisPanel";
import RepositoryCard from "../components/RepositoryCard";

function getUserInitials(user) {
  if (!user?.displayName && !user?.username) {
    return "DP";
  }

  return (user.displayName || user.username)
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function DashboardPage({
  accessToken,
  githubTokenSynced,
  onLogout,
  onSessionExpired,
  user
}) {
  const [repositories, setRepositories] = useState([]);
  const [repoState, setRepoState] = useState({
    error: "",
    status: "loading"
  });
  const [analysisState, setAnalysisState] = useState({
    error: "",
    status: "idle",
    targetRepositoryId: null
  });
  const [analysisResult, setAnalysisResult] = useState(null);
  const [selectedRepositoryId, setSelectedRepositoryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const deferredSearchTerm = useDeferredValue(searchTerm);

  useEffect(() => {
    let isMounted = true;

    async function loadRepositories() {
      setRepoState({
        error: "",
        status: "loading"
      });

      try {
        const data = await apiRequest("/repos", {
          accessToken
        });

        if (!isMounted) {
          return;
        }

        setRepositories(data.repositories);
        setRepoState({
          error: "",
          status: "success"
        });

        if (data.repositories.length > 0) {
          setSelectedRepositoryId((currentValue) => currentValue || data.repositories[0].id);
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (error instanceof ApiError && error.status === 401) {
          onSessionExpired("Your GitHub session expired. Please sign in again.");
          return;
        }

        setRepoState({
          error: error.message,
          status: "error"
        });
      }
    }

    if (githubTokenSynced === null) {
      setRepoState({
        error: "",
        status: "loading"
      });
      return () => {
        isMounted = false;
      };
    }

    if (!githubTokenSynced) {
      setRepoState({
        error:
          "GitHub login succeeded, but the backend is still waiting for the GitHub provider token. Finish the sign-in flow again if this message persists.",
        status: "error"
      });
      return () => {
        isMounted = false;
      };
    }

    loadRepositories();

    return () => {
      isMounted = false;
    };
  }, [accessToken, githubTokenSynced, onSessionExpired, user.id]);

  const filteredRepositories = repositories.filter((repository) => {
    const haystack = `${repository.name} ${repository.fullName} ${
      repository.language || ""
    } ${repository.description || ""}`.toLowerCase();

    return haystack.includes(deferredSearchTerm.trim().toLowerCase());
  });

  const selectedRepository =
    repositories.find((repository) => repository.id === selectedRepositoryId) || null;

  async function handleAnalyze(repository) {
    setAnalysisState({
      error: "",
      status: "loading",
      targetRepositoryId: repository.id
    });
    setSelectedRepositoryId(repository.id);

    try {
      const data = await apiRequest("/analyze", {
        accessToken,
        body: JSON.stringify({
          repositoryFullName: repository.fullName
        }),
        method: "POST"
      });

      setAnalysisResult(data);
      setAnalysisState({
        error: "",
        status: "success",
        targetRepositoryId: repository.id
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        onSessionExpired("Your GitHub session expired. Please sign in again.");
        return;
      }

      setAnalysisState({
        error: error.message,
        status: "error",
        targetRepositoryId: repository.id
      });
    }
  }

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <p className="section-label">DevPulse dashboard</p>
          <h1>Welcome back, {user.displayName}</h1>
        </div>

        <div className="header-actions">
          <div className="user-chip">
            {user.avatarUrl ? (
              <img alt={user.username} src={user.avatarUrl} />
            ) : (
              <div className="user-avatar-fallback">{getUserInitials(user)}</div>
            )}
            <div>
              <strong>{user.username}</strong>
              <span>GitHub connected</span>
            </div>
          </div>

          <button className="ghost-button" onClick={onLogout} type="button">
            Logout
          </button>
        </div>
      </header>

      <section className="workspace-grid">
        <aside className="repo-shell">
          <div className="repo-toolbar">
            <div>
              <p className="section-label">Repositories</p>
              <h2>{repositories.length} connected repositories</h2>
              {githubTokenSynced === null ? (
                <p className="panel-description">
                  Checking whether the backend already has your GitHub provider
                  token from Supabase.
                </p>
              ) : null}
              {githubTokenSynced === false ? (
                <p className="panel-description">
                  Waiting for the backend to receive the GitHub provider token
                  from Supabase.
                </p>
              ) : null}
            </div>

            <input
              className="repo-search"
              onChange={(event) => {
                const nextValue = event.target.value;
                startTransition(() => {
                  setSearchTerm(nextValue);
                });
              }}
              placeholder="Search repositories"
              type="search"
              value={searchTerm}
            />
          </div>

          {repoState.status === "loading" ? (
            <div className="empty-panel">
              <h3>Loading repositories</h3>
              <p>Fetching your GitHub repositories and preparing the dashboard.</p>
            </div>
          ) : null}

          {repoState.status === "error" ? (
            <div className="feedback-card feedback-error">{repoState.error}</div>
          ) : null}

          {repoState.status === "success" && filteredRepositories.length === 0 ? (
            <div className="empty-panel">
              <h3>No matching repositories</h3>
              <p>Try a different search term or refresh after adding GitHub access.</p>
            </div>
          ) : null}

          <div className="repo-list">
            {filteredRepositories.map((repository) => (
              <RepositoryCard
                isAnalyzing={
                  analysisState.status === "loading" &&
                  analysisState.targetRepositoryId === repository.id
                }
                isSelected={selectedRepositoryId === repository.id}
                key={repository.id}
                onAnalyze={handleAnalyze}
                onSelect={(nextRepository) => {
                  setSelectedRepositoryId(nextRepository.id);
                }}
                repository={repository}
              />
            ))}
          </div>
        </aside>

        <AnalysisPanel
          accessToken={accessToken}
          analysisResult={analysisResult}
          analysisState={analysisState}
          onAnalyze={handleAnalyze}
          repository={selectedRepository}
        />
      </section>
    </main>
  );
}

export default DashboardPage;
