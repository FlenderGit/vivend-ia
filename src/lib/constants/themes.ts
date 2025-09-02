export type Theme = {
  font: string;
  voice_name: string;
  colors: Record<ColorType, string>;
};

export const COLORS_TYPE = [
  "primary",
  "background",
] as const;

type ColorType = (typeof COLORS_TYPE)[number];
