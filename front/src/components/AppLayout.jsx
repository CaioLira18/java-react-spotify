import { Outlet } from 'react-router-dom'
import Header from './Header'
import NavBar from './NavBar'

const AppLayout = () => {
  return (
    <>
      <NavBar />

      <div className="app-layout">
        <Header />
        <Outlet /> 
      </div>
    </>
  )
}

export default AppLayout
