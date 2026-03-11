import { randomBytes } from 'crypto';

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function uniqueSlug(title: string): string {
  const base = generateSlug(title);
  const suffix = randomBytes(4).toString('hex');
  return `${base}-${suffix}`;
}

/**
 * Generate a slug guaranteed to be unique by checking the database.
 * Retries with a new random suffix if a collision is found.
 */
export async function uniqueSlugWithCheck(
  title: string,
  exists: (slug: string) => Promise<boolean>,
): Promise<string> {
  const base = generateSlug(title);
  // First try: base slug without suffix
  if (!(await exists(base))) return base;

  // Retry with random suffix (up to 5 attempts)
  for (let i = 0; i < 5; i++) {
    const slug = `${base}-${randomBytes(4).toString('hex')}`;
    if (!(await exists(slug))) return slug;
  }

  // Fallback: long random suffix (virtually impossible to collide)
  return `${base}-${randomBytes(8).toString('hex')}`;
}
