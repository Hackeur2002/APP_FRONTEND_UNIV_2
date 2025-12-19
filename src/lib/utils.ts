import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Génère une référence de paiement unique au format XXXxXXXXXX
 * @returns Une chaîne de caractères alphanumériques unique
 */
export function generatePaymentReference(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const randomChar = () => chars.charAt(Math.floor(Math.random() * chars.length));
  
  // Format: 3 caractères + 'x' + 6 caractères
  const part1 = Array.from({ length: 3 }, randomChar).join('');
  const part2 = Array.from({ length: 6 }, randomChar).join('');
  
  return `${part1}x${part2}`;
}