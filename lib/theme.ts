export type ThemeName = "dark" | "light";

export const DEFAULT_THEME: ThemeName = "dark";

export const isValidTheme = (value?: string | null): value is ThemeName => value === "dark" || value === "light";

export const themeAttr = (theme: ThemeName = DEFAULT_THEME) => ({
  "data-theme": theme,
});
