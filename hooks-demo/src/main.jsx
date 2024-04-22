import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import uniq from 'lodash-es/uniq.js'

const arr = [1, 2, 2, 3, 3, 4]
console.log(uniq(arr));

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
