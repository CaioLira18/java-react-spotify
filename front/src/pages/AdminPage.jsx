import React from 'react'

const AdminPage = () => {
  return (
    <div>
      <div className="adminPageContainer">
        <div className="headerAdminPage">
            <h1>Bem-vindo à Página de Admin</h1>
        </div>
        <div className="adminPageBox">
           <a href="/artist"><img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1766527332/SaveClip.App_465080237_1281646189520923_29121891168446998_n_v8bvcs.jpg" alt="" />
           <h2>Adicionar Artistas</h2></a>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
