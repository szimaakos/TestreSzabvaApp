import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ReceptekPage.css";

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
    image: "https://via.placeholder.com/600x300?text=Csirke+Quinoa+Sal%C3%A1ta",
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
    image: "https://via.placeholder.com/600x300?text=Z%C3%B6d+Turmix",
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
    image: "https://via.placeholder.com/600x300?text=S%C3%BClt+Lazac+%C3%A9s+Z%C3%B6dsz%C3%A9gek",
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
    image: "https://via.placeholder.com/600x300?text=T%C3%A9szt%C3%A1+Z%C3%B6dsz%C3%A9gekkel",
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
    image: "https://via.placeholder.com/600x300?text=Avok%C3%A1d%C3%B3s+Pir%C3%ADt%C3%B3s",
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
    image: "https://via.placeholder.com/600x300?text=Smoothie+Bowl",
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
            {filteredRecipes.slice(0, 3).map((recipe) => (
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



  







  