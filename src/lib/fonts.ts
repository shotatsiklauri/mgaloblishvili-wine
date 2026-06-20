import localFont from "next/font/local";
import { Noto_Serif_Georgian } from "next/font/google";

export const fontSans = localFont({
  src: "../app/fonts/Inter-Variable.ttf",
  variable: "--font-sans",
  display: "swap",
  weight: "100 900",
});

export const fontSerif = localFont({
  src: "../app/fonts/NotoSerif-Variable.ttf",
  variable: "--font-serif-latin",
  display: "swap",
  weight: "100 900",
});

export const fontSerifGeorgian = Noto_Serif_Georgian({
  weight: ["300", "400", "500", "700"],
  subsets: ["georgian"],
  variable: "--font-serif-georgian",
  display: "swap",
});
