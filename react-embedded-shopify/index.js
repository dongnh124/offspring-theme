import ReactDOM from 'react-dom'
import React from 'react'
import App from './src/app.jsx'
import './style.css'

const rootEl = document.getElementById('react-embedded-shopify')
rootEl && ReactDOM.render(<App />, rootEl)
