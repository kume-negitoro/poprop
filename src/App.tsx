import React from 'react'
import SelectMenu from './SelectMenu'
import './App.css'

const App: React.FC = (): JSX.Element => {
    return (
        <div className="App">
            <header className="App-header">
                <SelectMenu />
            </header>
        </div>
    )
}

export default App
