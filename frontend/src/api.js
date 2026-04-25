const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

async function apiRequest(path, options = {}) {
  const { accessToken, headers, ...requestOptions } = options;

  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(headers || {})
    },
    ...requestOptions
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new ApiError(
      payload?.message || `Request failed with status ${response.status}.`,
      response.status,
      payload
    );
  }

  return payload;
}

async function syncGitHubProviderToken(session) {
  if (!session?.access_token || !session?.provider_token) {
    return {
      skipped: true
    };
  }

  return apiRequest("/auth/provider-token", {
    accessToken: session.access_token,
    body: JSON.stringify({
      providerToken: session.provider_token
    }),
    method: "POST"
  });
}

async function removeGitHubProviderToken(accessToken) {
  if (!accessToken) {
    return;
  }

  return apiRequest("/auth/provider-token", {
    accessToken,
    method: "DELETE"
  });
}

export {
  API_URL,
  ApiError,
  apiRequest,
  removeGitHubProviderToken,
  syncGitHubProviderToken
};
