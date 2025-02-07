import React from 'react'
import Home from './components/Home'
import Upload from './components/Upload'
import ListVideos from './components/ListVidoes'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/upload' element={<Upload/>}/>
        <Route path='/videos' element={<ListVideos/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
