import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'

const rootElement = document.getElementById('root')
const root = ReactDOM.createRoot(rootElement)

root.render(
    <Router><App /></Router>
)
