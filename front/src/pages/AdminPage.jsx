import React, { useEffect, useState } from 'react'

const AdminPage = () => {
  const [name, setName] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setIsAuthenticated(true);
        setIsAdmin(parsedUser.role === 'ADMIN');
        setName(parsedUser.name || '');
      } catch (err) {
        console.error("Erro ao processar usuário do localStorage", err);
      }
    }
  }, []);

  return (
    <div>
      <div className="welcomeAdmin">
        <h1>Bem vindo Admin, <strong>{name}</strong></h1>
      </div>
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
          <a href="/playlist"><img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1766605500/ROSE-1st-Studio-Album-rosie-Concept-Photo-documents-2_yyhheu.jpg" alt="" />
            <h2>Adicionar Playlist</h2></a>
        </div>
        <div className="adminPageBox">
          <a href="/deleteMusicPage"><img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1766874466/avatars-vJG4WT2we6uySowd-yRIFcg-t1080x1080_kzjxet.jpg" alt="" />
            <h2>Deletar Musica</h2></a>
        </div>
        <div className="adminPageBox">
          <a href="/deletePlaylistPage"><img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1766605500/ROSE-1st-Studio-Album-rosie-Concept-Photo-documents-2_yyhheu.jpg" alt="" />
            <h2>Deletar Playlist</h2></a>
        </div>
      </div>
        <div className="space"></div>
    </div>
  )
}

export default AdminPage
