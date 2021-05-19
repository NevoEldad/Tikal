import React, { Fragment } from 'react';

const PlanetLegend = props => {
  let a;
  console.log(props);

  if (props.planets) {
    a = props.planets.map(planet => {
      let height = 0;

      Number.isNaN(+planet.population) != NaN &&
        (height = Math.floor((planet.population * 100) / props.highest) / 100);
      return (
        <div
          key={planet.name}
          style={{
            height: height,
            backgroundColor: 'black',
            width: '3%'
          }}
        ></div>
      );
    });
  }
  return (
    <Fragment>
      <div style={{ height: '100px', display: 'flex' }}>{a}</div>
    </Fragment>
  );
};

export default PlanetLegend;
