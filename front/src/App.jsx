import Header from './components/Header'
import NavBar from './components/NavBar'
import ArtistPage from './pages/ArtistPage'
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function App() {

  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/artists/:id" element={<ArtistPage />} />
      </Routes>
    </div>
  )
}

export default App