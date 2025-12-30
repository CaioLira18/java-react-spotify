import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './css/Home.css'
import './css/Header.css'
import './css/Artistas.css'
import './css/ArtistIndividual.css'
import './css/navBar.css'
import './css/LoginPage.css'
import './css/MusicPlayer.css'
import './css/AppLayout.css'
import './css/AdminPage.css'
import './css/AddArtistPage.css'
import './css/ModalMusic.css'
import './css/Album.css'
import './css/deletePages.css'
import './css/ViewPages.css'
import './utils/Fonts.css'

import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <App />
    </StrictMode>
  </BrowserRouter>
)