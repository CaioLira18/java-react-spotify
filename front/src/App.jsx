import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ArtistPage from './pages/ArtistPage'
import AppLayout from './components/AppLayout'
import AddMusicPage from './pages/AddMusicPage'
import AddArtistPage from './pages/AddArtistPage'
import AdminPage from './pages/AdminPage'
import NavBar from './components/NavBar'
import AddPlaylistPage from './pages/AddPlaylistPage'
import PlaylistPage from './pages/PlaylistPage'

function App() {
  return (
    <div>

      <NavBar />
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/artists/:id" element={<ArtistPage />} />
          <Route path="/playlists/:id" element={<PlaylistPage />} />
        </Route>
        <Route path="/music" element={<AddMusicPage />} />
        <Route path="/artist" element={<AddArtistPage />} />
        <Route path="/playlist" element={<AddPlaylistPage />} />
        <Route path="/adminPage" element={<AdminPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>

  )
}

export default App
