const axios = require("axios");

const config = require("../config/env");

function createGitHubClient(accessToken) {
  return axios.create({
    baseURL: "https://api.github.com",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": "DevPulse",
      "X-GitHub-Api-Version": "2022-11-28"
    },
    timeout: 10000
  });
}

function mapRepository(repository) {
  return {
    archived: repository.archived,
    defaultBranch: repository.default_branch,
    description: repository.description,
    forksCount: repository.forks_count,
    fullName: repository.full_name,
    htmlUrl: repository.html_url,
    id: repository.id,
    language: repository.language,
    name: repository.name,
    openIssuesCount: repository.open_issues_count,
    private: repository.private,
    pushedAt: repository.pushed_at,
    size: repository.size,
    stargazersCount: repository.stargazers_count,
    updatedAt: repository.updated_at,
    visibility: repository.visibility
  };
}

function getNextPageUrl(linkHeader) {
  if (!linkHeader) {
    return null;
  }

  const nextLinkMatch = linkHeader.match(/<([^>]+)>;\s*rel="next"/i);
  return nextLinkMatch?.[1] || null;
}

async function fetchPaginatedGitHubResults(client, endpoint, initialParams) {
  const items = [];
  let nextUrl = endpoint;
  let nextParams = initialParams;

  for (let page = 1; page <= config.githubRepoPageLimit && nextUrl; page += 1) {
    const response = await client.get(nextUrl, {
      params: nextParams
    });

    items.push(...response.data);
    nextUrl = getNextPageUrl(response.headers.link);
    nextParams = undefined;
  }

  return items;
}

async function fetchAuthenticatedViewer(accessToken) {
  const client = createGitHubClient(accessToken);
  const response = await client.get("/user");

  return {
    avatarUrl: response.data.avatar_url,
    id: response.data.id,
    login: response.data.login,
    profileUrl: response.data.html_url
  };
}

async function fetchUserRepositories(accessToken) {
  const client = createGitHubClient(accessToken);
  const repositories = await fetchPaginatedGitHubResults(client, "/user/repos", {
    affiliation: "owner,collaborator,organization_member",
    direction: "desc",
    per_page: 100,
    sort: "updated"
  });

  return repositories.map(mapRepository);
}

async function fetchRepository(accessToken, repositoryFullName) {
  const client = createGitHubClient(accessToken);
  const response = await client.get(`/repos/${repositoryFullName}`);
  return response.data;
}

module.exports = {
  fetchAuthenticatedViewer,
  fetchRepository,
  fetchUserRepositories,
  getNextPageUrl,
  mapRepository
};
