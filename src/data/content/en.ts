/**
 * English site content. Text lifted verbatim from `Web content ENG.docx`.
 * Do not rewrite or paraphrase. Two known source-side quirks are
 * preserved as written: Saperavi's "kakheti" (lower-case) and the
 * mid-sentence capital "In" in the wines intro.
 */
import type { SiteContent } from "./types";

export const enContent: SiteContent = {
  locale: "en",

  nav: {
    history: "History",
    vineyards: "Vineyards",
    wines: "Wines",
    experiences: "Experiences",
  },

  history: {
    title: "History",
    items: [
      {
        id: "encounter",
        title: "The Encounter",
        body: [
          "This story begins on the pages of an ampelography book, where two Mgaloblishvilis unexpectedly met each other. A red grapevine variety “Mgaloblishvili” was discovered by its namesake while she was exploring Georgian vines.",
          "Whether this meeting was chance or destiny, it did not pass without a trace. The discovery of a vine bearing their own surname inspired the family to embark on a true Georgian endeavor.",
          "And so, Wine Mgaloblishvili was born. A vibrant, experimental wine from Georgia, crafted as a tribute to encounters: the planned and the spontaneous, the longed-for and the unexpected, the farewell and the inevitable.",
        ],
      },
      {
        id: "crossroads",
        title: "The Crossroads",
        body: [
          "Mgaloblishvili Winery sits on a symbolic location in Gardabani, at the crossroads of Kartli and Kakheti, where two of Georgia's great wine regions meet.",
        ],
      },
      {
        id: "symbol",
        title: "The Symbol",
        body: [
          "The identity of the brand is rooted in crossed roads, as a symbol where cultures meet, experiences are shared, and diverse histories intertwine.",
        ],
      },
    ],
  },

  vineyards: {
    title: "Vineyards",
    introHeading: "Where our vines breathe and flourish",
    intro: [
      "Georgia is the ancient cradle of vine and wine culture, boasting an unbroken winemaking tradition that spans 8000 years. This heritage, passed down through generations, has preserved over 500 indigenous grape varieties and a remarkable array of styles. Wine Mgaloblishvili is an echo of this diversity – our vineyards are spread across various corners of the country to best showcase the authentic character and flavor unique to each region.",
    ],
    regions: [
      {
        id: "kakheti",
        title: "Kakheti",
        subtitle: "The heart of Georgian winemaking",
        body: [
          "Kakheti is the primary region of Georgian viticulture, where the depth and power of Georgian wine are felt most intensely. The region is distinguished by a diverse array of both traditional and European-style wines.",
          "The most widespread grape varieties include Rkatsiteli, Saperavi, Kakhuri Mtsvane, Khikhvi, and Kisi. However, Saperavi holds a special place, producing exceptional dry reds, rosés, and naturally semi-sweet wines. Among these are Kindzmarauli and Mukuzani, the latter often hailed as the king of Georgian red wines.",
          "Kakheti is also a land of vibrant white wines. Particularly notable are the Protected Designations of Origin (PDOs) of Manavi, Gurjaani, Vazisubani, and Napareuli. In the realm of classic, European-style white wines, Tsinandali remains the leader.",
          "The diversity of Kakhetian wine is crowned by the traditional Kvevri method. This typically Georgian wine, characterized by its archaic flavor profile and strong personality, is the ultimate expression of the region's ancient heritage.",
        ],
      },
      {
        id: "kartli",
        title: "Kartli",
        subtitle: "The region of white and sparkling wines",
        body: [
          "Kartli is renowned for its white, light, and airy wines. The region serves as the primary hub for Georgian sparkling wine production. The most widely cultivated varieties here are Chinuri and Goruli Mtsvane, which produce high-quality wines in both the classic European and traditional Kvevri styles.",
          "A prominent place within the region is held by the Ateni Gorge, celebrated for its unique microclimate and terroir. The local white sparkling wine, Atenuri, is the region's only Protected Designation of Origin (PDO).",
          "Kartli is also known for its expressive red wines. Notable in this regard are Tavkveri and Shavkapito, which are used to craft vibrant red and rosé wines rich in fruit aromas.",
        ],
      },
      {
        id: "imereti",
        title: "Imereti",
        subtitle: "Diversity and the traditional Churi",
        body: [
          "Imereti is one of the most diverse winemaking regions in Georgia, where variations in terrain and climatic conditions determine the distinct character of its wines. The region is primarily famous for its white wines, led by the Tsolikouri, Tsitska, and Krakhuna varieties. These grapes produce wines characterized by high acidity, vibrancy, and full body.",
          "The symbol of traditional Imeretian winemaking is the Churi – the local name for the Kvevri, which, in this region, is typically buried outdoors rather than in an enclosed cellar.",
          "Beyond white wines, the region stands out for its red varieties: Otskhanuri Sapere, Dzelshavi, and Aladasturi. Otskhanuri Sapere, in particular, produces intense, full-bodied wines with high alcohol content. Key winemaking zones include the villages of Zestafoni, Baghdati, and Terjola, while historically renowned terroirs include Sviri, Obcha, Rodinauli, Kvaliti, and Dimi.",
          "Notably, Mgaloblishvili is an indigenous red grape variety from Imereti, often used in blends with Otskhanuri Sapere. Mgaloblishvili holds the distinction of being the first Georgian Vitis vinifera variety to have its genome fully sequenced, revealing a unique natural resistance to downy mildew – a discovery of significant importance for global viticulture.",
        ],
      },
      {
        id: "racha-lechkhumi",
        title: "Racha-Lechkhumi",
        subtitle: "Unique terroirs and rare wines",
        body: [
          "Racha-Lechkhumi is a remarkably complex and distinguished winemaking region. It is celebrated for its unique micro-zones and rare grape varieties, which produce wines of exceptional quality.",
          "The region’s primary hallmark is Khvanchkara, a naturally semi-sweet red wine crafted from the Aleksandrouli and Mujuretuli varieties. In the Lechkhumi area, Tvishi holds a special place. It is a semi-sweet white wine produced from the Tsolikouri grape.",
          "Lechkhumi is also renowned for Usakhelouri, a rare and precious wine distinguished by its intense color, deep aroma, and rich, harmonious flavor profile.",
        ],
      },
      {
        id: "guria-samegrelo",
        title: "Guria-Samegrelo",
        subtitle: "Lands of high-trained vineyards",
        body: [
          "Guria and Samegrelo differ most significantly from the rest of Georgia in their viticulture practice. In these regions, you will encounter Maghlari – vines trained to grow up trees, as well as trellised vines (Talaveri).",
          "The Samegrelo region represents one of the most archaic cultural hubs of winemaking in Georgia. Its hallmark is Ojaleshi, a red grape variety from which exceptional wine is produced. The finest Ojaleshi is harvested in the Salkhino and Tamakoni zones.",
          "The pride of Guria is the Chkhaveri variety, which is harvested late, typically in November or December. The region was also historically renowned for the strong and aromatic wines of the Sajavakho zone. Particularly notable are the varieties: Jani, Mtevandidi, and Skhilatubani.",
        ],
      },
    ],
  },

  wines: {
    title: "Wines",
    originLabel: "Grape origin",
    categories: [
      { id: "wines", label: "Wines" },
      { id: "brandy", label: "Brandy" },
      { id: "chacha", label: "Chacha" },
    ],
    intro: [
      "Georgia’s geographical contrasts intersect In “Mgaloblishvili” wines – from the powerful and expressive wines of Kakheti to the elegant and vibrant aromas of Western Georgia.",
    ],
    items: [
      {
        id: "saperavi",
        name: "Saperavi",
        description: [
          "Dry red wine that exhibits a dark ruby color.",
          "It has intense cherry, black plum and blackberry aromas, complemented by hints of vanilla and cream that have developed through secondary fermentation. Saperavi is characterized by a medium body and gentle tannins, creating a well-balanced palate where the aromas of ripe red fruits and berries linger on.",
        ],
        grapeOrigin: "kakheti (Kvareli, Telavi)",
      },
      {
        id: "tavkveri-rose",
        name: "Tavkveri Rose",
        description: [
          "Dry rose wine that exhibits a light salmon color with a pink hue.",
          "The wine stands out with its bold and intense aroma, showcasing a delightful blend of floral and berry notes, including rose petals, barberry, and raspberry. On the palate, it is marked by vibrant acidity, refreshing liveliness, and a harmonious balance, enhanced by the flavors of barberry and sweet raspberry.",
        ],
        grapeOrigin: "Bolnisi, Kartli",
      },
      {
        id: "rkatsiteli-amber",
        name: "Rkatsiteli Amber",
        description: [
          "Dry wine characterized by a light amber color.",
          "It exudes delightful aromas of yellow fruits, including pear and yellow apple, complemented by enticing hints of apricot jam and spices. The taste is marked by smooth, velvety tannins and pleasant acidity. On the palate, one can savor the flavors of ripe quince and yellow fruits.",
        ],
        grapeOrigin: "Sagarejo, Kakheti",
      },
      {
        id: "rkatsiteli",
        name: "Rkatsiteli",
        description: [
          "Dry white wine that exhibits a pale straw color with a subtle greenish hue.",
          "It stands out by a diverse range of aromas, including a delicate bouquet of citrus, ripe lemon, grapefruit and green apple. On the palate, Rkatsiteli is marked by a fresh, light, tender taste.",
        ],
        grapeOrigin: "Akhmeta, Kakheti",
      },
      {
        id: "kindzmarauli",
        name: "Kindzmarauli",
        description: [
          "Semi-sweet red wine made from the Saperavi grape.",
          "The wine exhibits a ruby color and reveals aromas of berries and black pepper. Marked by a balanced acidity and sweetness, Kindzmarauli has a harmonious, velvety taste.",
        ],
        grapeOrigin: "Kvareli, Kakheti",
      },
      {
        id: "kisi",
        name: "Kisi",
        description: [
          "Dry white wine characterized by a straw color, with yellow tones.",
          "Kisi has a rich and well-balanced bouquet that showcases aromas of pineapple, grapefruit peel and flesh of yellow melon. It has a harmonious taste with a crisp, lingering finish.",
        ],
        grapeOrigin: "Alvani village, Akhmeta microzone, Kakheti",
      },
      {
        id: "kakhuri-mtsvane",
        name: "Kakhuri Mtsvane",
        description: [
          "Dry white wine characterized by a pale straw color.",
          "It reveals aromas of green apple, citrus and white cherry. Kakhuri Mtsvane is a high-acid wine with a tender, velvety taste and a lingering finish.",
        ],
        grapeOrigin: "Manavi subregion, Kakheti",
      },
      {
        id: "saperavi-reserve",
        name: "Saperavi Reserve",
        description: [
          "Dry red wine that is aged in French oak barrels for 12 months.",
          "The wine showcases a cherry-red color and features aromas of berries and currants.",
          "Saperavi Reserve is marked by a balanced, velvety taste with a touch of tannin.",
        ],
        grapeOrigin: "Akura village, Telavi, Kakheti",
      },
      {
        id: "rkatsiteli-batonnage",
        name: "Rkatsiteli Bâtonnage",
        description: [
          "Dry white wine made from selected Rkatsiteli grapes, and aged ‘Sur Lie’ for 10 months.",
          "The wine is characterized by a straw color and reveals refined aromas of exotic fruits. On the palate, it is marked by a creamy texture and pleasant finish.",
        ],
        grapeOrigin: "Akhmeta, Kakheti",
      },
      {
        id: "krakhuna",
        name: "Krakhuna",
        description: [
          "Naturally dry white wine with a straw-colored hue.",
          "Krakhuna reveals aromas of white fruits and flowers. On the palate, it has a light body and a medium finish.",
        ],
        grapeOrigin: "Sviri subregion, Imereti",
      },
      {
        id: "tvishi",
        name: "Tvishi",
        description: [
          "White semi-sweet wine made from the Tsolikouri grape.",
          "It has a straw-colored hue and is distinguished by aromas of herbs and field flowers. On the palate, Tvishi shows a balanced sweetness and acidity.",
        ],
        grapeOrigin: "Lechkhumi",
      },
      {
        id: "tsolikouri",
        name: "Tsolikouri",
        description: [
          "Dry white wine with a straw-colored hue. Tsolikouri reveals aromas of white fruits, lemon, and flowers. On the palate, it is characterized by a light body and vibrant acidity.",
        ],
        grapeOrigin: "Baghdati, Imereti",
      },
      {
        id: "tsinandali",
        name: "Tsinandali",
        description: [
          "Dry white wine made in the classic Tsinandali style.",
          "It has a straw-colored hue and is distinguished by aromas of fruit, lemon peel, and herbal notes. On the palate, Tsinandali is crisp and well-balanced, with lively acidity and a smooth texture.",
        ],
        grapeOrigin: "Tsinandali, Kakheti",
      },
      {
        id: "xo",
        name: "XO",
        description: ["Aged grape brandy with a smooth, rounded character."],
        grapeOrigin: "",
        categoryId: "brandy",
      },
      {
        id: "vsop",
        name: "VSOP",
        description: ["Aged grape brandy with a balanced, mellow character."],
        grapeOrigin: "",
        categoryId: "brandy",
      },
      {
        id: "vs",
        name: "VS",
        description: ["Aged grape brandy with a smooth, rounded character."],
        grapeOrigin: "",
        categoryId: "brandy",
      },
      {
        id: "chacha",
        name: "Chacha",
        description: ["Traditional Georgian grape pomace spirit."],
        grapeOrigin: "",
        categoryId: "chacha",
      },
    ],
  },

  experiences: {
    title: "Experiences",
    items: [
      {
        id: "gastronomy",
        title: "Gastronomy",
        sections: [
          {
            heading: "Nowhere do they welcome you like here, in this country",
            body: [
              "Georgia is a crossroads of cultures, histories, and civilizations. Here, every region has its own way of living, its own way of believing. And yet, wherever you go in this country, one thing remains constant: the act of meeting is an art form, whether it is welcoming a guest or greeting one another.",
              "Our dining space was created to share this experience, so that everyone who visits us can discover, firsthand, the art of Georgian cuisine, Georgian meeting, and Georgian welcome.",
            ],
          },
          {
            heading: "And they welcome you with the very best",
            body: [
              "If wine is the face of Georgia among drinks, then Khachapuri must be its face among dishes.",
              "In Georgia, making Khachapuri is a language spoken without words. It is how we have expressed our mood, warmth, care, and respect since ancient times. And like wine, every region has its own khachapuri – with its own distinct shape, filling, technique, and story.",
              "In this country, the guest is always greeted with the very best. Perhaps that is why we feel a particular pride every time a guest begins their discovery of Georgian cuisine with its most iconic dish.",
            ],
          },
        ],
      },
      {
        id: "winery",
        title: "Winery",
        sections: [
          {
            heading: "From cluster to wine – the transformation",
            body: [
              "The journey from vine to bottle is an inspiring one.",
              "The grape selection process begins in the vineyard, where only the finest bunches are hand-picked. This is a crucial stage that strongly impacts the character and quality of the wine.",
              "Following a visual inspection, the grapes undergo a two-stage selection process at our winery: manual and mechanical sorting, using appropriate sieves and vibrating tables for precise grape selection. Mgaloblishvili winery is equipped with the state-of-the-art Bucher machinery, which is calibrated to the specific needs of each grape variety to ensure the fruit is handled with the utmost delicacy.",
              "As a result, we achieve perfectly intact, destemmed grapes and gently press them to yield sweet, high-quality wine.",
            ],
          },
        ],
      },
    ],
  },
};
