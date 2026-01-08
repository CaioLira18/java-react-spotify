import { Outlet } from 'react-router-dom'
import Header from './Header'
import MusicPlayer from './MusicPlayer'
import NavBar from './NavBar'

const AppLayout = () => {
  return (
    <div className="app-layout">
      <NavBar />
      <Header />
      <Outlet /> 
      <MusicPlayer />
    </div>
  )
}

export default AppLayout;