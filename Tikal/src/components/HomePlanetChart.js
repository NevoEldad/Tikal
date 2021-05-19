import React, { Fragment } from 'react';

import PlanetLegend from './PlanetLegend';

const HomePlanetChart = props => {
  let highestPopulation = 0;
  const planetsArray = [];
  for (const key of Object.keys(props.planets)) {
    if (
      !(props.planets[key]['population'] === 'unknown') &&
      highestPopulation < +props.planets[key]['population']
    )
      highestPopulation = +props.planets[key]['population'];
    planetsArray.push({
      name: props.planets[key]['name'],
      population: props.planets[key]['population']
    });
  }
  return (
    <Fragment>
      <PlanetLegend planets={planetsArray} highest={highestPopulation} />
    </Fragment>
  );
};

export default HomePlanetChart;
