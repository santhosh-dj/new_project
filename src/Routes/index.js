import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Note from '../Pages/Note'


export default function Routers() {
    return (
        <Router>
            <Routes>               
                <Route  path='/' element={<Note />} />
            </Routes>
        </Router>
    )
}
