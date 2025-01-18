import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


export function showImage(image) {
  return `http://127.0.0.1:8000/storage/${image}`;
}