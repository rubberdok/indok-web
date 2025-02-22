import { CssVarsThemeOptions } from "@mui/material/styles";

const shadowBorder = "0 0 0 1px rgba(0,0,0,0.06)";

const createProgressiveShadow = (y: number, blur: number, spread = 0, opacity = 0.04) =>
  `0px ${y}px ${blur}px ${spread}px rgba(0, 0, 0, ${opacity})`;

export const shadows: CssVarsThemeOptions["shadows"] = [
  "none",
  `${shadowBorder}, ${createProgressiveShadow(1, 2)}`, // 1
  `${shadowBorder}, ${createProgressiveShadow(2, 4)}`, // 2
  `${shadowBorder}, ${createProgressiveShadow(2, 4)}, ${createProgressiveShadow(4, 6, -2)}`, // 3
  `${shadowBorder}, ${createProgressiveShadow(2, 4)}, ${createProgressiveShadow(6, 8, -3)}`, // 4
  `${shadowBorder}, ${createProgressiveShadow(3, 5)}, ${createProgressiveShadow(8, 10, -4)}`, // 5
  `${shadowBorder}, ${createProgressiveShadow(3, 6)}, ${createProgressiveShadow(10, 12, -4)}`, // 6
  `${shadowBorder}, ${createProgressiveShadow(4, 7)}, ${createProgressiveShadow(12, 14, -4)}`, // 7
  `${shadowBorder}, ${createProgressiveShadow(5, 8)}, ${createProgressiveShadow(14, 16, -4)}`, // 8
  `${shadowBorder}, ${createProgressiveShadow(5, 9)}, ${createProgressiveShadow(16, 18, -4)}`, // 9
  `${shadowBorder}, ${createProgressiveShadow(6, 10)}, ${createProgressiveShadow(18, 20, -4)}`, // 10
  `${shadowBorder}, ${createProgressiveShadow(6, 11)}, ${createProgressiveShadow(20, 22, -4)}`, // 11
  `${shadowBorder}, ${createProgressiveShadow(7, 12)}, ${createProgressiveShadow(22, 24, -4)}`, // 12
  `${shadowBorder}, ${createProgressiveShadow(7, 13)}, ${createProgressiveShadow(24, 26, -4)}`, // 13
  `${shadowBorder}, ${createProgressiveShadow(7, 14)}, ${createProgressiveShadow(26, 28, -4)}`, // 14
  `${shadowBorder}, ${createProgressiveShadow(8, 15)}, ${createProgressiveShadow(28, 30, -4)}`, // 15
  `${shadowBorder}, ${createProgressiveShadow(8, 16)}, ${createProgressiveShadow(30, 32, -4)}`, // 16
  `${shadowBorder}, ${createProgressiveShadow(8, 17)}, ${createProgressiveShadow(32, 34, -4)}`, // 17
  `${shadowBorder}, ${createProgressiveShadow(9, 18)}, ${createProgressiveShadow(34, 36, -4)}`, // 18
  `${shadowBorder}, ${createProgressiveShadow(9, 19)}, ${createProgressiveShadow(36, 38, -4)}`, // 19
  `${shadowBorder}, ${createProgressiveShadow(10, 20)}, ${createProgressiveShadow(38, 40, -4)}`, // 20
  `${shadowBorder}, ${createProgressiveShadow(10, 21)}, ${createProgressiveShadow(40, 42, -4)}`, // 21
  `${shadowBorder}, ${createProgressiveShadow(10, 22)}, ${createProgressiveShadow(42, 44, -4)}`, // 22
  `${shadowBorder}, ${createProgressiveShadow(11, 23)}, ${createProgressiveShadow(44, 46, -4)}`, // 23
  `${shadowBorder}, ${createProgressiveShadow(11, 24)}, ${createProgressiveShadow(46, 48, -4)}`, // 24
];
