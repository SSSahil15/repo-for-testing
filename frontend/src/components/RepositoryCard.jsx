function formatDate(value) {
  if (!value) {
    return "Unknown";
  }

  return new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function RepositoryCard({
  isAnalyzing,
  isSelected,
  onAnalyze,
  onSelect,
  repository
}) {
  return (
    <article
      className={`repo-card ${isSelected ? "repo-card-selected" : ""}`}
      onClick={() => onSelect(repository)}
    >
      <div className="repo-card-head">
        <div>
          <p className="repo-visibility">{repository.visibility}</p>
          <h3>{repository.name}</h3>
          <p className="repo-full-name">{repository.fullName}</p>
        </div>
        <button
          className="secondary-button"
          onClick={(event) => {
            event.stopPropagation();
            onAnalyze(repository);
          }}
          type="button"
        >
          {isAnalyzing ? "Analyzing..." : "Analyze Repo"}
        </button>
      </div>

      <p className="repo-description">
        {repository.description || "No repository description provided."}
      </p>

      <div className="repo-meta-row">
        <span>{repository.language || "Unknown stack"}</span>
        <span>{repository.private ? "Private" : "Public"}</span>
        <span>Updated {formatDate(repository.updatedAt)}</span>
      </div>
    </article>
  );
}

export default RepositoryCard;

