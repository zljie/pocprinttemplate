import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import PrintTemplateManager from './PrintTemplateManager';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <PrintTemplateManager />
    </BrowserRouter>
  );
}

export default App;
