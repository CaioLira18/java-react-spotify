import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import Header from './Header'
import MusicPlayer from './MusicPlayer'

const AppLayout = () => {
  const [playlist, setPlaylist] = useState([])
  const [currentIndex, setCurrentIndex] = useState(null)

  return (
    <>
      <div className="app-layout">
        <Header
          setPlaylist={setPlaylist}
          setCurrentIndex={setCurrentIndex}
        />

        <Outlet context={{ setPlaylist, setCurrentIndex }} />

        <MusicPlayer
          playlist={playlist}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      </div>
    </>
  )
}

export default AppLayout
