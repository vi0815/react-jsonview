import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import JsonViewer from './JsonViewer';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

const exampleData = {
  addressLine1: "33 Nightmare Street",
  postCode: "7BQ 918",
  city: "Edinburgh"
}

root.render(
  <StrictMode>
    <JsonViewer
      title={"Venue Address"}
      data={exampleData}
      />
  </StrictMode>
);
