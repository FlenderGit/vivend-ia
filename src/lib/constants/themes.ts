export type Theme = {
    [key in ColorType]?: string;
};

export const COLORS_TYPE = [
  "primary",
  "secondary",
  "background",
  "text",
  "info",
  "error",
] as const;

type ColorType = (typeof COLORS_TYPE)[number];

export const THEMES: Record<string, Theme> = {
  default: {
  },
  dark: {
    primary: "#2563eb",
    secondary: "#1f2937",
    background: "#111827",
    text: "#e5e7eb",
  },
  highContrast: {
    primary: "#ff0000",
    secondary: "#ffff00",
    background: "#000000",
    text: "#ffffff",
  },
  pastel: {
    primary: "#ff6f61",
    secondary: "#f0e68c",
    background: "#f5f5f5",
    text: "#333333",
  },
  retro: {
    primary: "#ff00ff",
    secondary: "#00ffff",
    background: "#000000",
    text: "#ffffff",
  },
};
