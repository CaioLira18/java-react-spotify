import React from 'react'

const AdminPage = () => {
  return (
    <div>
      <div className="adminPageContainer">
        <div className="adminPageBox">
           <a href="/artist"><img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1766527332/SaveClip.App_465080237_1281646189520923_29121891168446998_n_v8bvcs.jpg" alt="" />
           <h2>Adicionar Artistas</h2></a>
        </div>
        <div className="adminPageBox">
           <a href="/music"><img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1766547850/apt.-rose-bruno-mars_rj3brh.jpg" alt="" />
           <h2>Adicionar Musicas</h2></a>
        </div>
        <div className="adminPageBox">
           <a href="/music"><img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1766605500/ROSE-1st-Studio-Album-rosie-Concept-Photo-documents-2_yyhheu.jpg" alt="" />
           <h2>Adicionar Playlist</h2></a>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
