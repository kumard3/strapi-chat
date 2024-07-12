import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateText(
  text: string,
  maxLength: number,
  lastChars?: number,
) {
  if (text) {
    if (text.length <= maxLength) return text;
    const truncated = text.substring(0, maxLength);

    if (lastChars)
      return truncated + "..." + text.substring(text.length - lastChars);
    return truncated + "...";
  }
}
