import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

const AssetsBaseUrl =
	import.meta.env.VITE_ASSET_BASE_URL ?? "http://127.0.0.1:8000/storage/";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function showImage(image) {
  return `${AssetsBaseUrl}${image}`;
}