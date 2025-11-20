/**
 * Normalise l'URL de base en supprimant les slashes de fin
 * pour éviter les doubles slashes lors de la concaténation
 */
export function getBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  // Supprimer tous les slashes de fin
  return baseUrl.replace(/\/+$/, '');
}

/**
 * Vérifie si l'environnement est localhost
 */
export function isLocalhost(url?: string): boolean {
  const checkUrl = url || getBaseUrl();
  return checkUrl.includes('localhost') || checkUrl.includes('127.0.0.1');
}
