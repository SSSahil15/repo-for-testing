const dotenv = require("dotenv");
const { z } = require("zod");

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  BACKEND_URL: z.string().url().default("http://localhost:4000"),
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
  SUPABASE_URL: z.string().url("SUPABASE_URL must be a valid URL."),
  SUPABASE_PUBLISHABLE_KEY: z
    .string()
    .min(1, "SUPABASE_PUBLISHABLE_KEY is required."),
  TOKEN_ENCRYPTION_SECRET: z
    .string()
    .min(32, "TOKEN_ENCRYPTION_SECRET must be at least 32 characters long."),
  GITHUB_TOKEN_STORE_FILE_PATH: z
    .string()
    .min(1)
    .default("./.data/github-provider-tokens.json"),
  GITHUB_REPO_PAGE_LIMIT: z.coerce.number().int().positive().max(50).default(10),
  AI_SERVICE_URL: z.string().url().default("http://localhost:8000")
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment configuration:");
  console.error(parsedEnv.error.flatten().fieldErrors);
  throw new Error("Failed to start due to invalid environment variables.");
}

const env = parsedEnv.data;

module.exports = {
  backendUrl: env.BACKEND_URL,
  aiServiceUrl: env.AI_SERVICE_URL,
  frontendUrl: env.FRONTEND_URL,
  githubRepoPageLimit: env.GITHUB_REPO_PAGE_LIMIT,
  githubTokenStoreFilePath: env.GITHUB_TOKEN_STORE_FILE_PATH,
  isProduction: env.NODE_ENV === "production",
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  supabasePublishableKey: env.SUPABASE_PUBLISHABLE_KEY,
  supabaseUrl: env.SUPABASE_URL,
  tokenEncryptionSecret: env.TOKEN_ENCRYPTION_SECRET
};
