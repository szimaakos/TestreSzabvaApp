import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ReceptekPage.css";
import avokadoPiritos from "./images/avokadoPiritos.jpeg";
import avokadosCsicseriSalata from "./images/avokadosCsicseriSalata.jpeg";
import bananosProteinMuffin from "./images/bananosProteinMuffin.jpeg";
import bananosSmoothie from "./images/bananosSmoothie.jpg";
import bananosZabkasa from "./images/bananosSmoothie.jpg";
import bogyosGyumiSmoothie from "./images/bogyosGyumiSmoothie.jpeg";
import csicseriBorsoCurry from "./images/csicseriborsoCurry.jpeg";
import csirkeCeaserSalataEgeszseges from "./images/csirkeCaesarSalataEgeszseges.jpeg";
import csirkequinoasalataval from "./images/csirkequinoasalataval.jpeg";
import csirkeWrap from "./images/csirkeWrap.jpeg";
import edesburgonyBuddhaBowl from "./images/edesburgonyaBuddhaBowl.jpeg";
import edesburgonyaSalata from "./images/edesburgonyaSalata.jpeg";
import gorogJoghurtParafait from "./images/gorogJoghurtParfait.jpg";
import gorogSalataCsirke from "./images/gorogSalataCsirke.jpeg";
import haziProtein from "./images/haziProteinSzelet.jpeg";
import lencseLeves from "./images/lencseLeves.jpeg";
import mandulaGyumolcs from "./images/mandulaGyumolcsSali.jpeg";
import marhahusosSalata from "./images/marhahusosSalata.jpeg";
import mediterranCsicseriSalata from "./images/mediterranCsicseriSalata.jpeg";
import mediterranTofuBowl from "./images/mediterranTofuBowl.jpeg";
import proteinPalacsinta from "./images/proteinPalacsinta.jpeg";
import proteinZabkasa from "./images/proteinZabkasa.jpg";
import bowlZoldseg from "./images/quinoaBowlZoldseg.jpg";
import ZoldsegBurger from "./images/quinoaZoldsegBurger.jpeg";
import quionaBabSalata from "./images/quionaBabSalata.jpeg";
import rakosAvokadoSalata from "./images/rakosAvokadoSalata.jpeg";
import spenotosFetaOmlett from "./images/spenotosFetaOmlett.jpeg";
import spenotosTortilla from "./images/spenotosTortilla.jpeg";
import sultCsirkeBrokoliStirfry from "./images/sultCsirkeBrokkoliStirfry.jpeg";
import sultLazacZoldseg from "./images/sultLazacZoldseg.jpeg";
import sultPulykaZoldsegMix from "./images/sultPulykaZoldsegMix.jpg";
import sultTonhalAvokadoSalata from "./images/sultTonhalAvokadoSalata.jpeg";
import teljesKiorlesTesztaZoldseg from "./images/teljesKiorlesTesztaZoldseg.jpeg";
import tofuRantotta from "./images/tofuRantotta.jpeg";
import toltottPapper from "./images/toltottPapper.jpg";
import tonhalSalata from "./images/tonhalSalata.jpeg";
import veganZoldTal from "./images/veganZoldTal.jpeg";
import zoldsegesTofuStirfry from "./images/zoldsegesTofuStirfry.jpeg";
import zoldsegSpaghetti from "./images/zoldsegSpaghetti.jpeg";
import zoldturmix from "./images/zoldturmix.jpeg";






interface Recipe {
  id: number;
  title: string;
  image: string;
  description: string;
  ingredients: string[];
  instructions: string[];
}

const recipesData: Recipe[] = [
  {
    id: 1,
    title: "Csirke Quinoa Saláta",
    image: csirkequinoasalataval,
    description:
      "Tápláló és könnyű recept, ideális az izomépítéshez és regenerációhoz.",
    ingredients: [
      "150g csirkemell",
      "100g quinoa",
      "Vegyes zöldségek (paradicsom, uborka, paprika)",
      "Olívaolaj",
      "Citromlé",
      "Só, bors, fűszerek"
    ],
    instructions: [
      "Grillezd meg a csirkemellet, majd szeleteld fel.",
      "Főzd meg a quinoát a csomagoláson lévő utasítás szerint.",
      "Vágd apróra a zöldségeket és keverd össze az olívaolajjal, citromlével, sóval és borssal.",
      "Tálald a csirkét a quinoa és a saláta tetején."
    ]
  },
  {
    id: 2,
    title: "Zöld Turmix",
    image: zoldturmix,
    description:
      "Frissítő, vitaminokban gazdag smoothie az immunrendszer támogatására.",
    ingredients: [
      "Egy marék spenót",
      "1 érett banán",
      "1 alma",
      "Fél citrom leve",
      "200ml mandulatej vagy víz"
    ],
    instructions: [
      "Hámozd meg a banánt és az almát, majd darabold fel.",
      "Tedd a spenótot, banánt, almát és citromlevet a turmixgépbe.",
      "Öntsd fel mandulatejjel vagy vízzel, majd turmixold simára.",
      "Azonnal tálald, hogy megőrizze a vitaminokat."
    ]
  },
  {
    id: 3,
    title: "Sült Lazac és Zöldségek",
    image: sultLazacZoldseg,
    description:
      "Omega-3-ban gazdag lazac sült zöldségekkel, ideális egy egészséges étkezéshez.",
    ingredients: [
      "200g lazacfilé",
      "Brokkoli, sárgarépa, cukkini",
      "Olívaolaj",
      "Fűszerek (rozmaring, só, bors)",
      "Citromszeletek"
    ],
    instructions: [
      "Melegítsd elő a sütőt 200°C-ra.",
      "Locsold meg a lazacot és a zöldségeket olívaolajjal, majd szórd meg a fűszerekkel.",
      "Süsd a lazacot 15-20 percig, a zöldségeket pár perccel rövidebb ideig.",
      "Tálald citromszeletekkel és friss fűszerekkel."
    ]
  },
  {
    id: 4,
    title: "Teljes Kiőrlésű Tészta Zöldségekkel",
    image: teljesKiorlesTesztaZoldseg,
    description:
      "Rostban gazdag recept, amely energiával tölt fel és támogatja az egészséges életmódot.",
    ingredients: [
      "200g teljes kiőrlésű tészta",
      "Friss paradicsom, spenót, fokhagyma",
      "Olívaolaj",
      "Bazsalikom",
      "Só, bors"
    ],
    instructions: [
      "Főzd meg a tésztát a csomagolás utasítása szerint.",
      "Párold meg a fokhagymát olívaolajon, add hozzá a paradicsomot és spenótot.",
      "Keverd össze a főtt tésztával, majd szórd meg bazsalikommal, sóval és borssal.",
      "Tálald azonnal, hogy a zöldségek frissessége megmaradjon."
    ]
  },
  {
    id: 5,
    title: "Avokádós Pirítós",
    image: avokadoPiritos,
    description:
      "Egyszerű, mégis ízletes reggeli, ami feltölt energiával és egészséges zsírokkal.",
    ingredients: [
      "2 szelet teljes kiőrlésű kenyér",
      "1 érett avokádó",
      "Só, bors, citromlé",
      "Fűszerpaprika"
    ],
    instructions: [
      "Pirítsd meg a kenyérszeleteket.",
      "Hémozd meg és karikázd fel az avokádót, majd kend a kenyérre.",
      "Locsold meg egy kevés citromlével, szórd meg sóval, borssal és fűszerpaprikával.",
      "Azonnal fogyasztható."
    ]
  },
  {
    id: 6,
    title: "Bogyós Gyümölcs Smoothie Bowl",
    image: bogyosGyumiSmoothie,
    description:
      "Frissítő és energizáló smoothie bowl, tele vitaminokkal és rostokkal.",
    ingredients: [
      "1 banán",
      "150g vegyes bogyós gyümölcs",
      "100ml joghurt",
      "20g zabpehely",
      "Egy kevés méz",
      "Friss menta a díszítéshez"
    ],
    instructions: [
      "Turmixold össze a banánt, bogyós gyümölcsöket és a joghurtot.",
      "Öntsd tálba, szórd meg zabpehellyel és locsold meg egy kevés mézzel.",
      "Díszítsd friss mentával.",
      "Azonnal tálald."
    ]
  },
  // Új receptek
  {
    id: 7,
    title: "Protein Zabkása",
    image: proteinZabkasa,
    description: "Energia- és fehérjefokozó reggeli, mely segít a nap indításában.",
    ingredients: [
      "50g zabpehely",
      "200ml mandulatej",
      "1 kanál proteinpor",
      "1 banán",
      "Egy marék dió vagy mandula",
      "Méz vagy juharszirup ízlés szerint"
    ],
    instructions: [
      "Forrald fel a mandulatejet, majd add hozzá a zabpelyhet és főzd, amíg besűrűsödik.",
      "Keverd bele a proteinport, majd szeleteld fel a banánt.",
      "Tálald dióval és egy kis mézzel vagy juharsziruppal."
    ]
  },
  {
    id: 8,
    title: "Zöldséges Tofu Stir-fry",
    image: zoldsegesTofuStirfry,
    description: "Egészséges és gyors étel tofuval és friss zöldségekkel.",
    ingredients: [
      "200g tofu, kockára vágva",
      "Brokkoli, paprika, sárgarépa",
      "2 evőkanál szójaszósz",
      "1 evőkanál szezámolaj",
      "Gyömbér és fokhagyma ízlés szerint"
    ],
    instructions: [
      "Pirítsd a tofu kockákat egy serpenyőben szezámolajon, amíg enyhén megpirulnak.",
      "Add hozzá a felaprított zöldségeket, fokhagymát és gyömbért, majd párold pár percig.",
      "Öntsd rá a szójaszószt, és kevergetve főzd további 2-3 percig."
    ]
  },
  {
    id: 9,
    title: "Spenótos Feta Omlett",
    image: spenotosFetaOmlett,
    description: "Magas fehérjetartalmú omlett friss spenóttal és feta sajttal.",
    ingredients: [
      "3 tojás",
      "Egy marék friss spenót",
      "50g feta sajt",
      "Só, bors",
      "Egy kis olívaolaj"
    ],
    instructions: [
      "Verd fel a tojásokat, sózd, borsozd ízlés szerint.",
      "Adj hozzá spenótot és morzsolt feta sajtot.",
      "Önts egy serpenyőbe, és süsd mindkét oldalát aranybarnára."
    ]
  },
  {
    id: 10,
    title: "Marhahúsos Saláta",
    image: marhahusosSalata,
    description: "Fehérjedús saláta sült marhahússal és friss zöldségekkel.",
    ingredients: [
      "150g sovány marhahús",
      "Vegyes zöldsaláta",
      "Paradicsom, uborka, lilahagyma",
      "Olívaolaj, balzsamecet",
      "Só, bors"
    ],
    instructions: [
      "Grillezd vagy süsd meg a marhahúst, majd szeleteld vékonyra.",
      "Keverd össze a zöldségeket egy tálban.",
      "Locsold meg olívaolajjal és balzsamecettel, majd tálald a marhahússal."
    ]
  },
  {
    id: 11,
    title: "Csicseriborsó Curry",
    image: csicseriBorsoCurry,
    description: "Fűszeres és tápláló csicseriborsó curry, ami feltölti a szervezetedet.",
    ingredients: [
      "400g csicseriborsó (konzerv vagy főzött)",
      "1 hagyma, apróra vágva",
      "2 gerezd fokhagyma",
      "1 doboz kókusztej",
      "Curry fűszerkeverék",
      "Friss koriander, só, bors"
    ],
    instructions: [
      "Pirítsd meg az apróra vágott hagymát és fokhagymát egy serpenyőben.",
      "Add hozzá a csicseriborsót és a curry fűszert, majd keverd össze.",
      "Öntsd rá a kókusztejet, és főzd alacsony lángon 10-15 percig.",
      "Tálald friss korianderrel."
    ]
  },
  {
    id: 12,
    title: "Quinoa Bowl Zöldségekkel",
    image: bowlZoldseg,
    description: "Egy tápláló tál, melyben a quinoa és a friss zöldségek dominálnak.",
    ingredients: [
      "100g quinoa",
      "Vegyes zöldségek (spenót, paradicsom, avokádó)",
      "Olívaolaj, citromlé",
      "Só, bors"
    ],
    instructions: [
      "Főzd meg a quinoát a csomagolás utasítása szerint.",
      "Keverd össze a friss zöldségeket apróra vágva.",
      "Locsold meg olívaolajjal és citromlével, majd ízesítsd sóval és borssal."
    ]
  },
  {
    id: 13,
    title: "Avokádós Csicseriborsó Saláta",
    image: avokadosCsicseriSalata,
    description: "Könnyű és ízletes saláta avokádóval és csicseriborsóval.",
    ingredients: [
      "1 érett avokádó",
      "400g csicseriborsó",
      "Friss paradicsom, uborka",
      "Olívaolaj, citromlé",
      "Só, bors"
    ],
    instructions: [
      "Vágd kockára az avokádót és a zöldségeket.",
      "Keverd össze a csicseriborsóval.",
      "Locsold meg olívaolajjal és citromlével, majd ízesítsd sóval és borssal."
    ]
  },
  {
    id: 14,
    title: "Édesburgonya Saláta",
    image: edesburgonyaSalata,
    description: "Tápláló saláta sült édesburgonyával és friss zöldségekkel.",
    ingredients: [
      "2 közepes édesburgonya",
      "Kelj fodor vagy spenót",
      "Piros hagyma, paprika",
      "Olívaolaj, balzsamecet",
      "Fűszerek, só, bors"
    ],
    instructions: [
      "Süsd meg az édesburgonyát sütőben 200°C-on, amíg puhává válik.",
      "Vágd fel a zöldségeket, és keverd össze egy tálban.",
      "Locsold meg olívaolajjal és balzsamecettel, majd keverd össze a sült édesburgonyát."
    ]
  },
  {
    id: 15,
    title: "Tonhal Saláta",
    image: tonhalSalata,
    description: "Fehérjében gazdag saláta tonhallal és friss zöldségekkel.",
    ingredients: [
      "1 doboz tonhal (vízben)",
      "Vegyes salátalevelek",
      "Paradicsom, uborka, olívabogyó",
      "Olívaolaj, citromlé",
      "Só, bors"
    ],
    instructions: [
      "Öblítsd le a tonhalat, ha szükséges.",
      "Keverd össze a salátaleveleket és a zöldségeket.",
      "Tálald a tonhalat a tetején, locsold meg olívaolajjal és citromlével."
    ]
  },
  {
    id: 16,
    title: "Protein Palacsinta",
    image: proteinPalacsinta,
    description: "Egészséges palacsinta magas fehérjetartalommal, ideális edzés után.",
    ingredients: [
      "2 tojás",
      "30g zabpehely",
      "1 banán",
      "1 kanál proteinpor",
      "Egy kevés fahéj"
    ],
    instructions: [
      "Turmixold össze a hozzávalókat simára tésztává.",
      "Süsd kis serpenyőben mindkét oldalát aranybarnára.",
      "Tálald friss gyümölcsökkel vagy joghurttal."
    ]
  },
  {
    id: 17,
    title: "Banános Zabkása",
    image: bananosZabkasa,
    description: "Egyszerű, tápláló zabkása banánnal és chia maggal.",
    ingredients: [
      "50g zabpehely",
      "200ml víz vagy mandulatej",
      "1 érett banán",
      "1 evőkanál chia mag",
      "Méz ízlés szerint"
    ],
    instructions: [
      "Főzd meg a zabpelyhet a választott folyadékkal.",
      "Vágd fel a banánt, majd keverd össze a zabkásával és a chia maggal.",
      "Édesítsd mézzel, és tálald melegen."
    ]
  },
  {
    id: 18,
    title: "Görög Joghurt Parfait",
    image: gorogJoghurtParafait,
    description: "Rétegezett, tápláló desszert vagy reggeli, tele fehérjével és rostokkal.",
    ingredients: [
      "200g görög joghurt",
      "50g granola",
      "Vegyes bogyós gyümölcsök",
      "Méz a tetejére"
    ],
    instructions: [
      "Rétegezd a joghurtot, granolát és gyümölcsöket egy pohárban.",
      "Locsold meg egy kevés mézzel, majd azonnal fogyaszd."
    ]
  },
  {
    id: 19,
    title: "Csirke Wrap Teljes Kiőrlésű Tortillával",
    image: csirkeWrap,
    description: "Egészséges, fehérjedús wrap csirkével és friss zöldségekkel.",
    ingredients: [
      "150g grillezett csirkemell",
      "Teljes kiőrlésű tortilla",
      "Vegyes salátalevelek",
      "Paradicsom, avokádó",
      "Joghurtszósz (alacsony zsírtartalmú)"
    ],
    instructions: [
      "Szeleteld fel a csirkemellet.",
      "Helyezd a tortilla közepére a salátaleveleket, paradicsomot és avokádót.",
      "Tedd rá a csirkét és locsold meg joghurtszósszal, majd tekerd fel."
    ]
  },
  {
    id: 20,
    title: "Mandulavaj Banános Smoothie",
    image: bananosSmoothie,
    description: "Energia és fehérje egy pohárban, ideális edzés előtt vagy után.",
    ingredients: [
      "1 banán",
      "1 evőkanál mandulavaj",
      "200ml mandulatej",
      "Egy marék spenót",
      "Jégkockák"
    ],
    instructions: [
      "Tedd a hozzávalókat egy turmixgépbe.",
      "Turmixold simára, majd öntsd pohárba és azonnal fogyaszd."
    ]
  },
  {
    id: 21,
    title: "Töltött Paprika",
    image: toltottPapper,
    description: "Egészséges, fehérjében gazdag étel, töltött paprikával és sovány pulykával.",
    ingredients: [
      "4 nagy paprika",
      "200g darált pulykahús",
      "50g barna rizs",
      "1 paradicsom, apróra vágva",
      "Fűszerek (óregano, bazsalikom)",
      "Só, bors"
    ],
    instructions: [
      "Főzd meg a barna rizst előre.",
      "Keverd össze a darált húst, rizst, apróra vágott paradicsomot és fűszereket.",
      "Töltsd meg a paprikákat, és süsd 180°C-on 25-30 percig."
    ]
  },
  {
    id: 22,
    title: "Sült Pulyka és Zöldség Mix",
    image: sultPulykaZoldsegMix,
    description: "Fehérjében gazdag, könnyű étel pulykahússal és szezonális zöldségekkel.",
    ingredients: [
      "200g pulykamell",
      "Brokkoli, sárgarépa, cukkini",
      "Olívaolaj",
      "Fűszerek (rozmaring, kakukkfű)",
      "Só, bors"
    ],
    instructions: [
      "Süsd meg a pulykamellet, majd szeleteld fel.",
      "Párold meg a zöldségeket egy serpenyőben olívaolajjal és fűszerekkel.",
      "Tálald a pulykát a zöldségkeverékkel."
    ]
  },
  {
    id: 23,
    title: "Görög Saláta Csirke Hozzáadásával",
    image: gorogSalataCsirke,
    description: "Friss görög saláta, melyet grillezett csirkehússal egészítünk ki.",
    ingredients: [
      "Vegyes salátalevelek",
      "Paradicsom, uborka, feta sajt",
      "Olívabogyó, vörös hagyma",
      "150g grillezett csirkemell",
      "Olívaolaj, citromlé, oregánó"
    ],
    instructions: [
      "Keverd össze a salátaleveleket és a zöldségeket.",
      "Tálald a szeletelt csirkét a tetején, locsold meg olívaolajjal, citromlével és oregánóval."
    ]
  },
  {
    id: 24,
    title: "Mediterrán Csicseriborsó Saláta",
    image: mediterranCsicseriSalata,
    description: "Ízletes saláta csicseriborsóval, friss zöldségekkel és mediterrán fűszerekkel.",
    ingredients: [
      "400g csicseriborsó",
      "Paradicsom, uborka, vörös hagyma",
      "Feta sajt, olívabogyó",
      "Olívaolaj, citromlé",
      "Oregánó, só, bors"
    ],
    instructions: [
      "Keverd össze a csicseriborsót a felaprított zöldségekkel.",
      "Morzsold rá a feta sajtot, majd locsold meg olívaolajjal és citromlével.",
      "Ízesítsd oregánóval, sóval és borssal."
    ]
  },
  {
    id: 25,
    title: "Édesburgonya Buddha Bowl",
    image: edesburgonyBuddhaBowl,
    description: "Tápláló tál sült édesburgonyával, babbal, avokádóval és zöld salátával.",
    ingredients: [
      "2 édesburgonya",
      "1 avokádó",
      "400g fekete bab",
      "Vegyes saláta",
      "Olívaolaj, lime lé",
      "Só, bors"
    ],
    instructions: [
      "Süsd meg az édesburgonyát kockára vágva 200°C-on 25 percig.",
      "Keverd össze a salátát a babbal és az avokádó szeletekkel.",
      "Tálald a sült édesburgonyával, locsold meg olívaolajjal és lime lével."
    ]
  },
  {
    id: 26,
    title: "Spenótos Feta Csirke Wrap",
    image: spenotosTortilla,
    description: "Egészséges wrap, melyben grillezett csirke, spenót és feta sajt található.",
    ingredients: [
      "150g grillezett csirkemell",
      "Teljes kiőrlésű tortilla",
      "Friss spenót",
      "50g feta sajt",
      "Joghurtszósz, só, bors"
    ],
    instructions: [
      "Szeleteld fel a csirkemellet.",
      "Töltsd meg a tortilla spenóttal, feta sajttal és joghurtszósszal.",
      "Tekerd fel, és fogyaszd azonnal."
    ]
  },
  {
    id: 27,
    title: "Quinoa és Zöldség Burger",
    image: ZoldsegBurger,
    description: "Vegetáriánus burger quinoa és zöldségek felhasználásával, magas rost- és fehérjetartalommal.",
    ingredients: [
      "100g főtt quinoa",
      "Reszelt cukkini és sárgarépa",
      "1 tojás",
      "Teljes kiőrlésű zsemle",
      "Só, bors, fűszerek"
    ],
    instructions: [
      "Keverd össze a quinoát, reszelt zöldségeket és a tojást, ízesítsd fűszerekkel.",
      "Formázz belőle pogácsákat, majd süsd meg egy serpenyőben kevés olívaolajon.",
      "Tálald a burger zsemlében kedvenc salátával és szósszal."
    ]
  },
  {
    id: 28,
    title: "Lencseleves",
    image: lencseLeves,
    description: "Tápláló és fehérjedús leves lencsével és zöldségekkel.",
    ingredients: [
      "200g vöröslencse",
      "1 hagyma, apróra vágva",
      "2 gerezd fokhagyma",
      "2 sárgarépa, felkarikázva",
      "1 paradicsom, kockára vágva",
      "Zöldségalaplé",
      "Só, bors, kömény"
    ],
    instructions: [
      "Pirítsd meg a hagymát és fokhagymát egy nagy fazékban.",
      "Add hozzá a többi zöldséget és a lencsét.",
      "Öntsd fel zöldségalaplével, majd főzd 25-30 percig, amíg a lencse megpuhul.",
      "Ízesítsd sóval, borssal és köménnyel."
    ]
  },
  {
    id: 29,
    title: "Tofu Rántotta",
    image: tofuRantotta,
    description: "Vegan alternatíva a rántottához, tofuval és zöldségekkel.",
    ingredients: [
      "200g tofu",
      "1 kis vöröshagyma",
      "Paprika, spenót",
      "Kurkumapor",
      "Só, bors",
      "Olívaolaj"
    ],
    instructions: [
      "Morzsold össze a tofut egy villával.",
      "Pirítsd meg a vöröshagymát olívaolajon, add hozzá a tofut és a zöldségeket.",
      "Szórd meg kurkumával, sóval és borssal, majd süsd néhány percig."
    ]
  },
  {
    id: 30,
    title: "Vegán Zöldséges Tál",
    image: veganZoldTal,
    description: "Tápanyagokban gazdag vegán étel quinoa, avokádó és friss zöldségek kombinációjával.",
    ingredients: [
      "100g quinoa",
      "1 avokádó",
      "Vegyes zöldségek (paradicsom, uborka, paprika)",
      "Olívaolaj, citromlé",
      "Só, bors"
    ],
    instructions: [
      "Főzd meg a quinoát a csomagolás utasítása szerint.",
      "Vágd fel az avokádót és a zöldségeket.",
      "Keverd össze, majd locsold meg olívaolajjal és citromlével, ízesítsd sóval és borssal."
    ]
  },
  {
    id: 31,
    title: "Protein Energy Bar",
    image: haziProtein,
    description: "Házi készítésű, energiadús rágcsálnivaló edzés előtt vagy után.",
    ingredients: [
      "100g zabpehely",
      "50g mandula",
      "1 kanál méz",
      "1 evőkanál proteinpor",
      "Egy kevés kókuszreszelék"
    ],
    instructions: [
      "Keverd össze az összetevőket egy tálban.",
      "Nyomkodd egy tepsibe, és süsd 180°C-on 15-20 percig.",
      "Hagyd kihűlni, majd szeleteld fel."
    ]
  },
  {
    id: 32,
    title: "Sült Csirke és Brokkoli Stir-Fry",
    image:sultCsirkeBrokoliStirfry,
    description: "Gyors és egészséges stir-fry sült csirkével és brokkolival.",
    ingredients: [
      "150g csirkemell",
      "Brokkoli",
      "Paprika, sárgarépa",
      "Szójaszósz, olívaolaj",
      "Fokhagyma, gyömbér"
    ],
    instructions: [
      "Szeleteld fel a csirkét és süsd meg serpenyőben olívaolajjal.",
      "Add hozzá a felaprított zöldségeket, fokhagymát és gyömbért.",
      "Öntsd rá a szójaszószt, és keverd össze, majd süsd további 5 percig."
    ]
  },
  {
    id: 33,
    title: "Sült Tonhal és Avokádó Saláta",
    image: sultTonhalAvokadoSalata,
    description: "Fehérjedús saláta sült tonhallal és friss avokádóval.",
    ingredients: [
      "200g tonhalfilé",
      "Avokádó",
      "Vegyes salátalevelek",
      "Olívaolaj, citromlé",
      "Só, bors"
    ],
    instructions: [
      "Süsd meg a tonhalat, majd szeleteld fel.",
      "Keverd össze a salátaleveleket és az avokádót.",
      "Tálald a tonhalszeleteket, locsold meg olívaolajjal és citromlével."
    ]
  },
  {
    id: 34,
    title: "Zöldség Spaghetti",
    image: zoldsegSpaghetti,
    description: "Egészséges alternatíva a hagyományos tésztához, cukkini spagettivel és paradicsomszósszal.",
    ingredients: [
      "2 közepes cukkini (spiralizált)",
      "Friss paradicsomszósz",
      "Fokhagyma, bazsalikom",
      "Olívaolaj",
      "Só, bors"
    ],
    instructions: [
      "Készítsd el a cukkini spagettit spiralizátorral.",
      "Melegítsd fel a paradicsomszószt egy serpenyőben, adj hozzá fokhagymát és bazsalikomot.",
      "Keverd össze a spagettivel, majd tálald melegen."
    ]
  },
  {
    id: 35,
    title: "Banános Protein Muffin",
    image: bananosProteinMuffin,
    description: "Egészséges, fehérjében gazdag muffin, ideális reggeli vagy uzsonna.",
    ingredients: [
      "2 érett banán",
      "2 tojás",
      "50g zabpehely",
      "1 kanál proteinpor",
      "Egy kevés fahéj"
    ],
    instructions: [
      "Pürésítsd a banánt, keverd össze a tojással és a zabpelyhekkel.",
      "Add hozzá a proteinport és fahéjat, majd keverd simára a masszát.",
      "Oszlasd el muffin formákba, és süsd 180°C-on 20-25 percig."
    ]
  },
  {
    id: 36,
    title: "Mandula és Gyümölcs Saláta",
    image: mandulaGyumolcs,
    description: "Friss és ropogós saláta, mely mandulával és szezonális gyümölcsökkel készül.",
    ingredients: [
      "Vegyes zöldsaláta",
      "Szezonális gyümölcsök (alma, körte, narancs)",
      "Egy marék mandula",
      "Olívaolaj, balzsamecet",
      "Só, bors"
    ],
    instructions: [
      "Vágd fel a gyümölcsöket és keverd össze a salátával.",
      "Szórd rá a mandulát, locsold meg olívaolajjal és balzsamecettel, majd ízesítsd sóval és borssal."
    ]
  },
  {
    id: 37,
    title: "Rákos Avokádó Saláta",
    image: rakosAvokadoSalata,
    description: "Friss és tápláló saláta rák, avokádó és zöldségek kombinációjával.",
    ingredients: [
      "200g főtt rák",
      "1 érett avokádó",
      "Vegyes saláta",
      "Citromlé, olívaolaj",
      "Só, bors"
    ],
    instructions: [
      "Vágd fel az avokádót és keverd össze a salátával.",
      "Add hozzá a főtt rákot, majd locsold meg citromlével és olívaolajjal.",
      "Ízesítsd sóval és borssal, majd tálald."
    ]
  },
  {
    id: 38,
    title: "Csirke Caesar Saláta Egészséges Változat",
    image: csirkeCeaserSalataEgeszseges,
    description: "Friss saláta grillezett csirkével és könnyített Caesar öntettel.",
    ingredients: [
      "150g grillezett csirkemell",
      "Vegyes saláta",
      "Parmezán sajt (mérsékelt mennyiség)",
      "Teljes kiőrlésű krutonnal",
      "Caesar öntet (joghurt alapú)"
    ],
    instructions: [
      "Keverd össze a salátaleveleket a joghurt alapú Caesar öntettel.",
      "Tedd rá a szeletelt grillezett csirkét és szórd meg parmezán sajttal.",
      "Add hozzá a krutont a ropogós textúráért."
    ]
  },
  {
    id: 39,
    title: "Quinoa és Bab Saláta",
    image: quionaBabSalata,
    description: "Fehérjében gazdag saláta quinoával és vegyes babokkal.",
    ingredients: [
      "100g quinoa",
      "200g vegyes bab (fekete, vörös, fehér)",
      "Paradicsom, uborka",
      "Olívaolaj, citromlé",
      "Só, bors, petrezselyem"
    ],
    instructions: [
      "Főzd meg a quinoát, majd hűtsd le.",
      "Keverd össze a babokat és a felaprított zöldségeket.",
      "Locsold meg olívaolajjal és citromlével, ízesítsd petrezselyemmel, sóval és borssal."
    ]
  },
  {
    id: 40,
    title: "Mediterrán Tofu Bowl",
    image: mediterranTofuBowl,
    description: "Egészséges tál tofuval, olívabogyóval, paradicsommal és quinoával.",
    ingredients: [
      "200g tofu, kockára vágva",
      "100g quinoa",
      "Olívabogyó, paradicsom",
      "Friss bazsalikom",
      "Olívaolaj, citromlé, só, bors"
    ],
    instructions: [
      "Süsd meg a tofut egy serpenyőben enyhén megpirulva.",
      "Főzd meg a quinoát a csomagolás szerint.",
      "Keverd össze a tofut, quinoát, és a felaprított paradicsomot, olívabogyót.",
      "Locsold meg olívaolajjal és citromlével, majd szórd meg friss bazsalikommal."
    ]
  }
];


const ReceptekPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRecipes = recipesData.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      {/* Oldalsó menü – a dashboardból ismert navigáció */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>TestreSzabva</h2>
        </div>
        <nav className="sidebar-nav">
          <button onClick={() => navigate("/dashboard")}>Áttekintés</button>
          <button onClick={() => navigate("/weekly-menu")}>Heti Menü</button>
          <button onClick={() => navigate("/progress")}>Haladás</button>
          <button onClick={() => navigate("/receptek")} className="active">
            Receptek
          </button>
          <button onClick={() => navigate("/onboarding")}>Beállítások</button>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-button" onClick={() => navigate("/")}>
            Kijelentkezés
          </button>
        </div>
      </aside>

      {/* Fő tartalom */}
      <div className="dashboard-content receptek-content">
        <header className="content-header">
          <h1>Receptek</h1>
          <p>
            Fedezd fel a tápláló, ízletes recepteket, melyek nemcsak az egészségedet
            támogatják, de inspirációt adnak a változatos étrendhez!
          </p>
        </header>

        {/* Kereső sáv */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Keresés receptek között..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Kiemelt Receptek Slider */}
        <section className="featured-recipes">
          <h2>Kiemelt Receptek</h2>
          <div className="featured-recipes-slider">
            {filteredRecipes.slice(3, 6).map((recipe) => (
              <div key={recipe.id} className="featured-recipe-card">
                <img src={recipe.image} alt={recipe.title} />
                <div className="featured-recipe-info">
                  <h3>{recipe.title}</h3>
                  <p>{recipe.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Összes Recept rács */}
        <section className="all-recipes">
          <h2>Minden Recept</h2>
          <div className="recipes-grid">
            {filteredRecipes.map((recipe) => (
              <div key={recipe.id} className="recipe-card">
                <img src={recipe.image} alt={recipe.title} className="recipe-image" />
                <div className="recipe-content">
                  <h3 className="recipe-title">{recipe.title}</h3>
                  <p className="recipe-description">{recipe.description}</p>
                  <div className="recipe-details">
                    <div className="ingredients">
                      <h4>Hozzávalók:</h4>
                      <ul>
                        {recipe.ingredients.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="instructions">
                      <h4>Elkészítés:</h4>
                      <ol>
                        {recipe.instructions.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ReceptekPage;



  







  