import Header from './components/Header'
import ArtistPage from './pages/ArtistPage'
import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'

function App() {

  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/artists/:id" element={<ArtistPage />} />
      </Routes>
    </div>
  )
}

export default App