import React from 'react'
import SelectMenu from './SelectMenu'
import './App.css'
import { BrowserRouter as Router } from 'react-router-dom'

const App: React.FC = (): JSX.Element => {
    return (
        <div className="App">
            <header className="App-header">
                <Router>
                    <SelectMenu />
                </Router>
            </header>
        </div>
    )
}

export default App
