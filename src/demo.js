import React, { StrictMode } from 'react';
import JsonViewer from './JsonViewer';

export default function DemoJsonViewer() {
  const [exampleData, setExampleData] = React.useState({
    addressLine1: '33 Nightmare Street',
    postCode: '7BQ 918',
    city: 'Edinburgh',
  });

  return (
    <div>
      <JsonViewer
        title={'Venue Address'}
        data={exampleData}
        onChange={(result) => {
          console.log("back")
          setExampleData(result);
        }}
      />
      <br />
      <br />
      Return data from JsonViewer
      <pre>{JSON.stringify(exampleData, null, 2)}</pre>
    </div>
  );
}
