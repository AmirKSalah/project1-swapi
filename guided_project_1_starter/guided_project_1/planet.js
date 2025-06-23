let nameH1;
let gravitySpan;
let climateSpan;
let terrainSpan;
let filmsDiv;
let planetDiv;
const baseUrl = `http://localhost:9001/api`;
const PLANETS_STORAGE_KEY = 'planets';

// Runs on page load
addEventListener('DOMContentLoaded', () => {
  nameH1 = document.querySelector('h1#name');
  gravitySpan = document.querySelector('span#gravity');
  terrainSpan = document.querySelector('span#terrain');
  climateSpan = document.querySelector('span#climate');
  filmsUl = document.querySelector('#films>ul');
  charactersUl = document.querySelector('#characters>ul');

  const sp = new URLSearchParams(window.location.search)
  const id = sp.get('id')

  getPlanet(id)
});

async function getPlanet(id) {
  let planet;

  const cachedPlanet = localStorage.getItem(`planet_${id}`);
  if (cachedPlanet) {
    // If planet data exists in localStorage, use it
    planet = JSON.parse(cachedPlanet);
    renderPlanet(planet);
  } else {
  try {
    planet = await fetchPlanet(id);
    planet.homeworld = await fetchPlanet(planet);
    planet.films = await fetchFilms(planet);
    planet.characters = await fetchCharacters(planet);

    // Save only the ID and Name of the planet to localStorage
    localStorage.setItem(`planet_${id}`, JSON.stringify(planet));
    renderPlanet(planet);
  } catch (ex) {
    console.error(`Error reading planet ${id} data.`, ex.message);
  }
  
  }
}

async function fetchPlanet(id) {

  let planetUrl = `${baseUrl}/planets/${id}`;
  return await fetch(planetUrl)
    .then(res => res.json())
}

async function fetchCharacters(planet) {
  const url = `${baseUrl}/planets/${planet?.id}/characters`;
  const characters = await fetch(url)
    .then(res => res.json())
  return characters;
}

async function fetchFilms(planet) {
  const url = `${baseUrl}/planets/${planet?.id}/films`;
  const films = await fetch(url)
    .then(res => res.json())
  return films;
}

const renderPlanet = planet => {
  document.title = `SWAPI - ${planet?.name}`;  // Just to make the browser tab say their name
  nameH1.textContent = planet?.name;
  climateSpan.textContent = planet?.climate
  terrainSpan.textContent = planet?.terrain;
  gravitySpan.textContent = planet?.gravity;
  const filmsLis = planet?.films?.map(film => `<li><a href="/film.html?id=${film.id}">${film.title}</li>`);
  const charactersLis = planet?.characters?.map(characters => `<li><a href="/character.html?id=${characters.id}">${characters.name}</a></li>`)
  filmsUl.innerHTML = filmsLis.join("");
  charactersUl.innerHTML = charactersLis ? charactersLis.join("") : "";
}
