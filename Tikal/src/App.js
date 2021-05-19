import React, { useState, useEffect } from 'react';
import axios from 'axios';

import HomePlanetChart from './components/HomePlanetChart';
import HomPlanetTable from './components/HomePlanetTable';

//resources names
const SWAPI = 'https://swapi.dev/api/';
const PLANETS = 'planets/';
const PEOPLE = 'people/';
const VEHICLE = 'vehicles/';

const vehicles = { meta: {}, vehicles: {} };
const people = { meta: {}, people: {} };
const planets = { meta: {}, planets: {} };

//Index for all the relevant vehicles which have popularity
const topVehicleIndex = new Set();
//Stores all the relevant vehicles which have popularity
const topVehicles = [];

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSwapi = async resource => {
    return new Promise(async (res, rej) => {
      try {
        let next = `${SWAPI}${resource}`;
        let result;
        let firstFetch = true;
        while (next) {
          result = await axios.get(next);
          next = result.data.next;
          switch (resource) {
            case PLANETS:
              firstFetch &&
                (planets.meta.count = result.data.count) &&
                (firstFetch = false);
              result.data.results.forEach(planet => {
                planets.planets[planet['url']] = {
                  name: planet['name'],
                  population: Number.isNaN(+planet['population'])
                    ? 0
                    : +planet['population']
                };
              });
              break;
            case PEOPLE:
              firstFetch &&
                (people.meta.count = result.data.count) &&
                (firstFetch = false);
              result.data.results.forEach(person => {
                people.people[person['url']] = {
                  name: person['name'],
                  homeworld: person['homeworld'],
                  vehicles: person['vehicles']
                };
              });
              break;
            case VEHICLE:
              firstFetch &&
                (vehicles.meta.count = result.data.count) &&
                (firstFetch = false);
              result.data.results.forEach(vehicle => {
                vehicles.vehicles[vehicle['url']] = {
                  name: vehicle['name'],
                  pilots: vehicle['pilots'],
                  planets: {}
                };
              });
              break;
            default:
              rej('An error occured');
          }
        }
        res();
      } catch (e) {
        rej(e.message);
      }
    });
  };

  function setVehiclePopulationByPlanet() {
    for (const key of Object.keys(people.people)) {
      const personHomeworld = people.people[key]['homeworld'];
      const homeworldPopulation =
        planets.planets[personHomeworld]['population'];
      people.people[key]['vehicles'].forEach(vehicle => {
        vehicles.vehicles[vehicle]['planets'][
          personHomeworld
        ] = homeworldPopulation;
        topVehicleIndex.add(vehicle);
      });
    }
  }

  function setTopVehiclesForTableDisplay() {
    topVehicleIndex.forEach(vehicle => {
      const vehicleForDisplay = {};
      vehicleForDisplay.id = vehicle;
      vehicleForDisplay.Name = vehicles.vehicles[vehicle]['name'];
      vehicleForDisplay.summ = 0;
      vehicleForDisplay.homePlanetsPopulation = '';
      for (const key of Object.keys(vehicles.vehicles[vehicle]['planets'])) {
        const currentPlanet = planets.planets[key];
        vehicleForDisplay.summ =
          +vehicleForDisplay.summ + +currentPlanet['population'];
        vehicleForDisplay.homePlanetsPopulation =
          currentPlanet['name'] + ' : ' + currentPlanet['population'];
      }

      vehicleForDisplay.pilots = vehicles.vehicles[vehicle]['pilots']
        .map(pilot => {
          return people['people'][pilot]['name'];
        })
        .join(', ');
      topVehicles.push(vehicleForDisplay);
    });
  }
  function dataIsReady() {
    setVehiclePopulationByPlanet();
    setTopVehiclesForTableDisplay();
    setIsLoading(false);
  }

  useEffect(() => {
    Promise.all([fetchSwapi(PLANETS), fetchSwapi(PEOPLE), fetchSwapi(VEHICLE)])
      .then(() => {
        dataIsReady();
      })
      .catch(error => {
        setError(error.message);
      });
  }, []);

  let content = (
    <div>
      <HomPlanetTable vehicles={topVehicles} />
      <HomePlanetChart planets={planets.planets} />
    </div>
  );

  if (error) {
    content = <p>{error}</p>;
  }
  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return <React.Fragment>{content}</React.Fragment>;
}

export default App;
