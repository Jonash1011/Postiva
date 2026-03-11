import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, env } from 'prisma/config';

function loadLocalEnvFile(): void {
  const envFilePath = resolve(process.cwd(), '.env');
  if (!existsSync(envFilePath)) {
    return;
  }

  const envFile = readFileSync(envFilePath, 'utf8');

  // Prisma skips .env auto-loading when prisma.config.ts is present.
  for (const rawLine of envFile.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const separatorIndex = line.indexOf('=');
    if (separatorIndex <= 0) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    if (!key || process.env[key] !== undefined) {
      continue;
    }

    let value = line.slice(separatorIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

loadLocalEnvFile();

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  engine: 'classic',
  datasource: {
    url: env('DATABASE_URL'),
  },
});
