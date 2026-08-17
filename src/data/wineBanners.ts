const LOCAL_WINE_BANNERS: Readonly<Record<string, string>> = {
  chacha: "/images/VSOP-Banner.jpg",
  "kakhuri-mtsvane": "/images/Kakhuri-Mtsvane-Banner.jpg",
  kindzmarauli: "/images/Kindzmarauli-Banner.jpg",
  kisi: "/images/Kisi-Banner.jpg",
  "kisi-reserve": "/images/Kisi-Reserve-Banner.jpg",
  krakhuna: "/images/Tvishi-Banner.jpg",
  "rkatsiteli-amber": "/images/Rkatsiteli-Amber-Banner.jpg",
  rkatsiteli: "/images/Rkatsiteli-Banner.jpg",
  "rkatsiteli-batonnage": "/images/Rkatsiteli-Batonnage-Banner.jpg",
  saperavi: "/images/Saperavi-Banner.jpg",
  "saperavi-reserve": "/images/Saperavi-Reserve-Banner.jpg",
  "tavkveri-rose": "/images/Tavkveri-Banner.jpg",
  tsinandali: "/images/Tsinandali-Banner.jpg",
  tsolikouri: "/images/Tsolikouri-Banner.jpg",
  tvishi: "/images/Tvishi-Banner.jpg",
  vs: "/images/VSOP-Banner.jpg",
  vsop: "/images/VSOP-Banner.jpg",
  xo: "/images/VSOP-Banner.jpg",
};

const LOCAL_MOBILE_WINE_BANNERS: Readonly<Record<string, string>> = {
  "kakhuri-mtsvane": "/images/Kakhuri-Mtsvane-Mobile-Banner.jpg",
  kindzmarauli: "/images/Kindzmarauli-Mobile-Banner.jpg",
  kisi: "/images/Kisi-Mobile-Banner.jpg",
  "kisi-reserve": "/images/Kisi-Reserve-Mobile-Banner.jpg",
  krakhuna: "/images/Tvishi.jpg",
  "rkatsiteli-amber": "/images/Rkatsiteli-Amber-Mobile-Banner.jpg",
  rkatsiteli: "/images/Rkatsiteli-Mobile-Banner.jpg",
  "rkatsiteli-batonnage": "/images/Rkatsiteli-Batonnage-Mobile-Banner.jpg",
  saperavi: "/images/Saperavi-Mobile-Banner.jpg",
  "saperavi-reserve": "/images/Saperavi-Reserve-Mobile-Banner.jpg",
  "tavkveri-rose": "/images/Tavkveri-Mobile-Banner.jpg",
  tsinandali: "/images/Tsinandali-Mobile-Banner.jpg",
  tsolikouri: "/images/Tsolikouri-Mobile-Banner.jpg",
  tvishi: "/images/Tvishi.jpg",
  vs: "/images/VS-Mobile-Banner.jpg",
  vsop: "/images/VSOP-Mobile-Banner.jpg",
};

export function getLocalWineBanner(itemId: string): string | undefined {
  return LOCAL_WINE_BANNERS[itemId];
}

export function getLocalMobileWineBanner(itemId: string): string | undefined {
  return LOCAL_MOBILE_WINE_BANNERS[itemId];
}
