export const SITE_CONTACT = {
  company: "Wine Mgaloblishvili LLC",
  address: "Village Martkopi, 1320, Gardabani, Georgia",
} as const;

export const SITE_NAME = "Mgaloblishvili";

export const SITE_SOCIAL_LINKS = [
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/share/1FxZTrzb3S/?mibextid=wwXIfr",
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/wine.mgaloblishvili?igsh=dmd5eTJqc251MWF2",
  },
  {
    id: "x",
    label: "X",
    href: "https://x.com/wmgaloblishvili",
  },
] as const;

export const SITE_DESCRIPTION =
  "Ancient Georgian winemaking reimagined. Bold flavors, modern spirit.";
("Mgaloblishvili is a Georgian wine estate crafting wine, brandy, and chacha from indigenous grape varieties across Georgia's historic regions.");

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
