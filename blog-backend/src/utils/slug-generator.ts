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
  const suffix = Date.now().toString(36).slice(-4);
  return `${base}-${suffix}`;
}
