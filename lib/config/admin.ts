/**
 * Admin configuration - Single source of truth for admin access
 */

export const ADMIN_EMAILS = [
  "editorjin0326@gmail.com",
  "byeongjin.jeong05@gmail.com",
];

/**
 * Check if an email has admin access
 */
export function isAdmin(email: string | null | undefined): boolean {
  return !!email && ADMIN_EMAILS.includes(email);
}
