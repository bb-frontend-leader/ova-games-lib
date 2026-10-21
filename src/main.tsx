/* eslint-disable simple-import-sort/imports */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';

import App from './App';
import { Header } from './components';

import 'books-ui/styles';

import './styles/global.css';
import 'virtual:uno.css';
import '@shared/styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter basename="/">
      <Header />
      <App />
    </HashRouter>
  </StrictMode>
);
