import React from 'react'
import Home from './components/Home'
import Upload from './components/Upload'
import ListVideos from './components/ListVidoes'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <div>
      <Toaster/>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/upload' element={<Upload/>}/>
          <Route path='/videos' element={<ListVideos/>}/>
           <Route path="/upload/:id" element={<Upload />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App


