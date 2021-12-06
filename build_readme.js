// index.js
require('dotenv').config();
const Mustache = require('mustache');
const fetch = require('node-fetch');
const fs = require('fs');

const MUSTACHE_MAIN_DIR = './main.mustache';

/**
 * DATA is the object that contains all
 * the data to be provided to Mustache
 * Notice the "name" and "date" property.
 */
let DATA = {
  city: {
    tampa_fl: {
      temperature: null,
      weather_description: null,
      sunrise: null,
      sunset: null,
      instagram: 'visittampabay',
      images: [],
    },
    rochester_ny: {
      temperature: null,
      weather_description: null,
      sunrise: null,
      sunset: null,
      instagram: 'rochesterny',
      images: [],
    },
  },
  refresh_date: new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
    timeZone: 'America/New_York',
  }),
};

async function setWeatherInformation() {
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/New_York',
  };

  await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?id=4174757&appid=${process.env.OPEN_WEATHER_MAP_KEY}&units=imperial`
  )
    .then(r => r.json())
    .then(r => {
      DATA.city.tampa_fl.temperature = Math.round(r.list[0].main.temp);
      DATA.city.tampa_fl.weather_description = r.list[0].weather[0].description;
      DATA.city.tampa_fl.sunrise = new Date(r.city.sunrise * 1000).toLocaleString('en-US', options);
      DATA.city.tampa_fl.sunset = new Date(r.city.sunset * 1000).toLocaleString('en-US', options);
    });

  await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?id=5134086&appid=${process.env.OPEN_WEATHER_MAP_KEY}&units=imperial`
  )
    .then(r => r.json())
    .then(r => {
      DATA.city.rochester_ny.temperature = Math.round(r.list[0].main.temp);
      DATA.city.rochester_ny.weather_description = r.list[0].weather[0].description;
      DATA.city.rochester_ny.sunrise = new Date(r.city.sunrise * 1000).toLocaleString('en-US', options);
      DATA.city.rochester_ny.sunset = new Date(r.city.sunset * 1000).toLocaleString('en-US', options);
    });
}

async function generateReadMe() {
  await fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
    if (err) throw err;
    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync('README.md', output);
  });
}

async function action() {
  /**
   * Fetch Weather
   */
  await setWeatherInformation();

  /**
   * Generate README
   */
  await generateReadMe();

  console.log(DATA);
}

action();
