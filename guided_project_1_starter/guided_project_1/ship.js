let title;
let speedSpan;
let heightSpan;
let massSpan;
let filmsDiv;
let planetDiv;
let captain;
const baseUrl = `http://localhost:9001/api`;

// Runs on page load
addEventListener('DOMContentLoaded', () => {
  title = document.querySelector('h1#title');
  speedSpan = document.querySelector('span#speed');
  costSpan = document.querySelector('span#cost');
  manufacturerSpan = document.querySelector('span#manufacturer');

  crewUl = document.querySelector('#characters>ul');
  captainUl = document.querySelector('#planets>ul')
  const sp = new URLSearchParams(window.location.search)
  const id = sp.get('id')
  getShip(id)
});

async function getShip(id) {
  let ship;
  try {
    ship = await fetchShip(id)
    console.log(ship);
    ship.crew = await fetchCrew(ship)
    ship.transports = await fetchTransports(ship);
    console.log(ship.transports)
    const captainMap = new Map();
    captainMap.set(2, 5);
    captainMap.set(15, 4);
    captainMap.set(10, 14);
    captainMap.set(21, 22);
    captainMap.set(12, 1);
    console.log(ship)
    captainId = captainMap.get(ship.id)
    ship.captain = await fetchCaptain(captainId)
    console.log(ship.captain)

  }
  catch (ex) {
    console.error(`Error reading film ${id} data.`, ex.message);
  }
  renderShip(ship);


}
async function fetchShip(id) {
  let shipUrl = `${baseUrl}/starships/${id}`;
  return await fetch(shipUrl)
    .then(res => res.json())
}

async function fetchTransports(ship) {
    const url = `${baseUrl}/transports/${ship?.id}`;
    const transports = await fetch(url)
    .then(res => res.json())
return transports
}

async function fetchCrew(ship) {
    const url = `${baseUrl}/starships/${ship?.id}/characters`;
    const crew = await fetch(url)
        .then(res => res.json())
    return crew


}

async function fetchPlanets(film) {
  const url = `${baseUrl}/films/${film?.id}/planets`;
  const planets = await fetch(url)
    .then(res => res.json())
  return planets;
}

async function fetchCaptain(captainId) {
    const captain = await fetch(`${baseUrl}/characters/${captainId}`)
    .then(res => res.json())
    return captain
  }

async function fetchCharacters(film) {
  const url = `${baseUrl}/films/${film?.id}/characters`;
  const characters = await fetch(url)
    .then(res => res.json())
  return characters;
}

const renderShip = ship => {
  document.title = `SWAPI - ${ship.transports.name}`;  // Just to make the browser tab say their name
  title.textContent = ship.transports.name;
  speedSpan.textContent = ship.transports.max_atmosphering_speed;
  costSpan.textContent = ship.transports.cost_in_credits;
  manufacturerSpan.textContent = ship.transports.manufacturer;
//   homeworldSpan.innerHTML = `<a href="/planet.html?id=${character?.homeworld.id}">${character?.homeworld.name}</a>`;

  const crewLis = ship?.crew?.map(character => `<li><a href="/character.html?id=${character.id}">${character.name}</li>`)
  crewUl.innerHTML = crewLis.join("");

    console.log(ship.captain)


  captainUl.innerHTML = `<li><a href="/character.html?id=${ship.captain?.id}">${ship.captain?.name}</a></li>`;
//   captainUl.innerHTML = captainMap.get(ship.id)
}
