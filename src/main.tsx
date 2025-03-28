// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Désactivation temporaire du StrictMode pour le débogage
ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
)

// Ajouter un gestionnaire d'erreurs global
window.onerror = function(msg, url, lineNo, columnNo, error) {
  console.log('Erreur globale:', {
    message: msg,
    url: url,
    line: lineNo,
    column: columnNo,
    error: error
  });
  return false;
};

// Ajouter un gestionnaire pour les erreurs non gérées des Promises
window.addEventListener('unhandledrejection', function(event) {
  console.log('Promesse non gérée:', event.reason);
});
