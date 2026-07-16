import 'server-only'

import { z } from 'zod'

const envSchema = z.object({
  ONOFFICE_API_BASE_URL: z.string().url(),
  ONOFFICE_API_LIST_PATH: z.string().min(1).default('/properties'),
  ONOFFICE_API_DETAILS_PATH: z.string().min(1).default('/properties/:id'),
  ONOFFICE_API_USERNAME: z.string().min(1),
  ONOFFICE_API_SECRET: z.string().min(1),
  ONOFFICE_API_TOKEN: z.string().min(1),

  ALLOWED_IFRAME_ANCESTORS: z
    .string()
    .default(
      "'self' http://localhost:5500 http://127.0.0.1:5500"
    ),
})

/**
 * Validated server environment values used for API access and security headers.
 */
let cachedEnv: z.infer<typeof envSchema> | null = null

/**
 * Returns validated environment variables and caches the result.
 */
export const getEnv = (): z.infer<typeof envSchema> => {
  if (cachedEnv) {
    return cachedEnv
  }

  cachedEnv = envSchema.parse({
    ONOFFICE_API_BASE_URL: process.env.ONOFFICE_API_BASE_URL,

    ONOFFICE_API_LIST_PATH: process.env.ONOFFICE_API_LIST_PATH ?? "/properties",

    ONOFFICE_API_DETAILS_PATH:
      process.env.ONOFFICE_API_DETAILS_PATH ?? "/properties/:id",

    ONOFFICE_API_USERNAME: process.env.ONOFFICE_API_USERNAME,

    ONOFFICE_API_SECRET: process.env.ONOFFICE_API_SECRET,

    ONOFFICE_API_TOKEN: process.env.ONOFFICE_API_TOKEN,

    ALLOWED_IFRAME_ANCESTORS:  "'self' http://localhost:5500 http://127.0.0.1:5500",
  });

  return cachedEnv
}