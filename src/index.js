import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// -------------------- Google Analytics --------------------
const GA_MEASUREMENT_ID = 'G-J2PFQF4155';

// Cargar el script externo
const script = document.createElement('script');
script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
script.async = true;
document.head.appendChild(script);

// Inicializar gtag
window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
window.gtag = gtag; // lo dejamos global
gtag('js', new Date());
gtag('config', GA_MEASUREMENT_ID);
// -----------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
