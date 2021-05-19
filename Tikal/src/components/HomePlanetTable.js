import * as React from 'react';
import { DataGrid, GRID_CELL_EDIT_PROPS_CHANGE } from '@material-ui/data-grid';

const HomePlanetTable = props => {
  const columns = [
    { field: 'Name', headerName: 'Vehicle Name', width: 300 },
    {
      field: 'homePlanetsPopulation',
      headerName: 'Relate home planets and their respective population',
      width: 500
    },
    { field: 'pilots', headerName: 'Related pilots names', width: 300 },
    { field: 'summ', headerName: 'Summ', width: 300 }
  ];

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={props.vehicles} columns={columns} pageSize={5} />
    </div>
  );
};

export default HomePlanetTable;
