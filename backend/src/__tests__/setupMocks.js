/**
 * setupMocks.js — runs via setupFilesAfterEnv (after Jest environment is
 * initialised), so jest.mock / jest.fn() are available here.
 *
 * These global mocks apply to EVERY test suite in the backend.
 */

// ─── Redis Service ────────────────────────────────────────────────────────────
// isConnected() returns false → rateLimiter falls back to MemoryStore.
// All cache helpers become silent no-ops so tests don't need a real Redis.
jest.mock('../services/redis.service', () => ({
  client:      null,
  isConnected: () => false,
  get:         jest.fn().mockResolvedValue(null),
  set:         jest.fn().mockResolvedValue(true),
  del:         jest.fn().mockResolvedValue(true),
  delPattern:  jest.fn().mockResolvedValue(true),
}));

// ─── rate-limit-redis ─────────────────────────────────────────────────────────
// Prevent the real RedisStore constructor from being called during tests.
// rateLimiter will receive `store: undefined` and use the built-in MemoryStore.
jest.mock('rate-limit-redis', () => ({
  default: jest.fn().mockImplementation(() => ({})),
}));
