import React from 'react'
import { Outlet } from 'react-router-dom'

const AdminPageHeader = () => {
  return (
    <div>
      <div className="headerAdminPageOptions">
       <a href="/"><button><i className="fa-solid fa-house"></i></button></a>
       <a href="/adminpage"><button><i className="fa-brands fa-black-tie"></i></button></a> 
      </div>
      <Outlet />
    </div>
  )
}

export default AdminPageHeader