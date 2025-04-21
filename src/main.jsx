import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './output.css' // Add this line
// Should import the CSS file with directives (input.css)
import './input.css'; // Not output.css!

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)