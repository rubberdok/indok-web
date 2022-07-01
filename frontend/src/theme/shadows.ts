import { alpha } from "@mui/material/styles";
import { Shadows } from "@mui/material/styles/shadows";
import palette from "./palette";

declare module "@mui/material/styles" {
  interface Theme {
    customShadows: CustomShadowOptions;
  }
  interface ThemeOptions {
    customShadows?: CustomShadowOptions;
  }
}

interface CustomShadowOptions {
  z1: string;
  z4: string;
  z8: string;
  z12: string;
  z16: string;
  z20: string;
  z24: string;
  primary: string;
  secondary: string;
  info: string;
  success: string;
  warning: string;
  error: string;
}

const SHADOW_COLOR_LIGHT = palette.light.grey[500];
const SHADOW_COLOR_DARK = palette.light.common.black;

const createShadow = (color: string): Shadows => {
  const transparent = [alpha(color, 0.19), alpha(color, 0.15), alpha(color, 0.13)];

  return [
    "none",
    `0px 2px 1px -1px ${transparent[0]},0px 1px 1px 0px ${transparent[1]},0px 1px 3px 0px ${transparent[2]}`,
    `0px 3px 1px -2px ${transparent[0]},0px 2px 2px 0px ${transparent[1]},0px 1px 5px 0px ${transparent[2]}`,
    `0px 3px 3px -2px ${transparent[0]},0px 3px 4px 0px ${transparent[1]},0px 1px 8px 0px ${transparent[2]}`,
    `0px 2px 4px -1px ${transparent[0]},0px 4px 5px 0px ${transparent[1]},0px 1px 10px 0px ${transparent[2]}`,
    `0px 3px 5px -1px ${transparent[0]},0px 5px 8px 0px ${transparent[1]},0px 1px 14px 0px ${transparent[2]}`,
    `0px 3px 5px -1px ${transparent[0]},0px 6px 10px 0px ${transparent[1]},0px 1px 18px 0px ${transparent[2]}`,
    `0px 4px 5px -2px ${transparent[0]},0px 7px 10px 1px ${transparent[1]},0px 2px 16px 1px ${transparent[2]}`,
    `0px 5px 5px -3px ${transparent[0]},0px 8px 10px 1px ${transparent[1]},0px 3px 14px 2px ${transparent[2]}`,
    `0px 5px 6px -3px ${transparent[0]},0px 9px 12px 1px ${transparent[1]},0px 3px 16px 2px ${transparent[2]}`,
    `0px 6px 6px -3px ${transparent[0]},0px 10px 14px 1px ${transparent[1]},0px 4px 18px 3px ${transparent[2]}`,
    `0px 6px 7px -4px ${transparent[0]},0px 11px 15px 1px ${transparent[1]},0px 4px 20px 3px ${transparent[2]}`,
    `0px 7px 8px -4px ${transparent[0]},0px 12px 17px 2px ${transparent[1]},0px 5px 22px 4px ${transparent[2]}`,
    `0px 7px 8px -4px ${transparent[0]},0px 13px 19px 2px ${transparent[1]},0px 5px 24px 4px ${transparent[2]}`,
    `0px 7px 9px -4px ${transparent[0]},0px 14px 21px 2px ${transparent[1]},0px 5px 26px 4px ${transparent[2]}`,
    `0px 8px 9px -5px ${transparent[0]},0px 15px 22px 2px ${transparent[1]},0px 6px 28px 5px ${transparent[2]}`,
    `0px 8px 10px -5px ${transparent[0]},0px 16px 24px 2px ${transparent[1]},0px 6px 30px 5px ${transparent[2]}`,
    `0px 8px 11px -5px ${transparent[0]},0px 17px 26px 2px ${transparent[1]},0px 6px 32px 5px ${transparent[2]}`,
    `0px 9px 11px -5px ${transparent[0]},0px 18px 28px 2px ${transparent[1]},0px 7px 34px 6px ${transparent[2]}`,
    `0px 9px 12px -6px ${transparent[0]},0px 19px 29px 2px ${transparent[1]},0px 7px 36px 6px ${transparent[2]}`,
    `0px 10px 13px -6px ${transparent[0]},0px 20px 31px 3px ${transparent[1]},0px 8px 38px 7px ${transparent[2]}`,
    `0px 10px 13px -6px ${transparent[0]},0px 21px 33px 3px ${transparent[1]},0px 8px 40px 7px ${transparent[2]}`,
    `0px 10px 14px -6px ${transparent[0]},0px 22px 35px 3px ${transparent[1]},0px 8px 42px 7px ${transparent[2]}`,
    `0px 11px 14px -7px ${transparent[0]},0px 23px 36px 3px ${transparent[1]},0px 9px 44px 8px ${transparent[2]}`,
    `0px 11px 15px -7px ${transparent[0]},0px 24px 38px 3px ${transparent[1]},0px 9px 46px 8px ${transparent[2]}`,
  ];
};

const createCustomShadow = (color: string) => ({
  z1: `0 1px 2px 0 ${alpha(color, 0.24)}`,
  z4: `-4px 4px 24px 0 ${alpha(color, 0.08)}`,
  z8: `-8px 8px 24px -4px ${alpha(color, 0.1)}`,
  z12: `-12px 12px 48px -4px ${alpha(color, 0.12)}`,
  z16: `-16px 16px 56px -8px ${alpha(color, 0.16)}`,
  z20: `-20px 20px 64px -8px ${alpha(color, 0.2)}`,
  z24: `-24px 24px 72px -8px ${alpha(color, 0.24)}`,
  primary: `0 8px 16px 0 ${alpha(palette.light.primary.main, 0.24)}`,
  secondary: `0 8px 16px 0 ${alpha(palette.light.secondary.main, 0.24)}`,
  info: `0 8px 16px 0 ${alpha(palette.light.info.main, 0.24)}`,
  success: `0 8px 16px 0 ${alpha(palette.light.success.main, 0.24)}`,
  warning: `0 8px 16px 0 ${alpha(palette.light.warning.main, 0.24)}`,
  error: `0 8px 16px 0 ${alpha(palette.light.error.main, 0.24)}`,
});

export const customShadows = {
  light: createCustomShadow(SHADOW_COLOR_LIGHT),
  dark: createCustomShadow(SHADOW_COLOR_DARK),
};

const shadows: {
  light: Shadows;
  dark: Shadows;
} = {
  light: createShadow(SHADOW_COLOR_LIGHT),
  dark: createShadow(SHADOW_COLOR_DARK),
};

export default shadows;
