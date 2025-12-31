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
import AddAlbumPage from './pages/AddAlbumPage'
import DeleteAlbumPage from './pages/DeleteAlbumPage'
import AlbumPage from './pages/AlbumPage'
import SearchPage from './pages/SearchPage'
import DeleteMusicPage from './pages/DeleteMusicPage'
import DeleteArtistPage from './pages/DeleteArtistPage'
import UpdateArtistPage from './pages/UpdateArtistPage'
import UpdateMusicPage from './pages/UpdateMusicPage'
import UpdateAlbumPage from './pages/UpdateAlbumPage'
import ViewArtistsPage from './pages/ViewArtistsPage'
import ViewMusicPage from './pages/ViewMusicPage'
import ViewAlbumPage from './pages/ViewAlbumPage'
import LikedSongsPage from './pages/LikedSongsPage'

function App() {
  return (
    <div>

      <NavBar />
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/artists/:id" element={<ArtistPage />} />
          <Route path="/albums/:id" element={<AlbumPage />} />
          <Route path="/likedSongs" element={<LikedSongsPage />} />
        </Route>
        <Route path="/music" element={<AddMusicPage />} />
        <Route path="/artist" element={<AddArtistPage />} />
        <Route path="/album" element={<AddAlbumPage />} />
        <Route path="/adminPage" element={<AdminPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/deleteAlbum" element={<DeleteAlbumPage />} />
        <Route path="/deleteArtist" element={<DeleteArtistPage />} />
        <Route path="/deleteMusic" element={<DeleteMusicPage />} />
        <Route path="/updateArtist" element={<UpdateArtistPage />} />
        <Route path="/updateMusic" element={<UpdateMusicPage />} />
        <Route path="/updateAlbum" element={<UpdateAlbumPage />} />
        <Route path="/viewArtists" element={<ViewArtistsPage />} />
        <Route path="/viewMusics" element={<ViewMusicPage />} />
        <Route path="/viewAlbums" element={<ViewAlbumPage />} />
      </Routes>
    </div>

  )
}

export default App
