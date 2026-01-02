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
          <a href="/deleteArtist"><img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1766977176/Ed-Sheeran-performs-Rockefeller-Plaza-Today-Show-New-York-2023_gxjjx3.webp" alt="" />
            <h2>Deletar Artistas</h2></a>
        </div>
        <div className="adminPageBox">
          <a href="/updateArtist"><img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1766978742/sabrina-carpter-make-beleza-harpers-bazaar-brasil-1-768x941_unfse4.jpg" alt="" />
            <h2>Atualizar Artistas</h2></a>
        </div>
        <div className="adminPageBox">
          <a href="/viewArtists"><img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1766978848/Luke-Combs-Press-Photo-2024-Credit-Zack-Massey_iqyxm1.jpg" alt="" />
            <h2>Visualizar Artistas</h2></a>
        </div>
        <div className="adminPageBox">
          <a href="/music"><img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1766547850/apt.-rose-bruno-mars_rj3brh.jpg" alt="" />
            <h2>Adicionar Musicas</h2></a>
        </div>
        <div className="adminPageBox">
          <a href="/deleteMusic"><img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1766874466/avatars-vJG4WT2we6uySowd-yRIFcg-t1080x1080_kzjxet.jpg" alt="" />
            <h2>Deletar Musicas</h2></a>
        </div>
        <div className="adminPageBox">
          <a href="/updateMusic"><img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1766979072/Alan-Walker_zqaitv.webp" alt="" />
            <h2>Atualizar Musicas</h2></a>
        </div>
        <div className="adminPageBox">
          <a href="/viewMusics"><img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1766981926/N43RAAQISFIR5NEXHQAQB5WDYM_ozsmfp.jpg" alt="" />
            <h2>Visualizar Musicas</h2></a>
        </div>
        <div className="adminPageBox">
          <a href="/album"><img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1766605500/ROSE-1st-Studio-Album-rosie-Concept-Photo-documents-2_yyhheu.jpg" alt="" />
            <h2>Adicionar Álbums</h2></a>
        </div>
        <div className="adminPageBox">
          <a href="/deleteAlbum"><img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1766977100/1900x1900-000000-81-0-0_raklbt.jpg" alt="" />
            <h2>Deletar Álbums</h2></a>
        </div>
        <div className="adminPageBox">
          <a href="/updateAlbum"><img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1766985811/240628-babymonster-x-wwd-japan-magazine-v0-kps35qkhc89d1_hfs2k2.webp" alt="" />
            <h2>Atualizar Álbums</h2></a>
        </div>
        <div className="adminPageBox">
          <a href="/viewAlbums"><img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1766985896/1728448268079vlcsnap-2024-10-09-12h19m57s120_s2ied3.avif" alt="" />
            <h2>Visualizar Álbums</h2></a>
        </div>
        <div className="adminPageBox">
          <a href="/playlist"><img src="https://res.cloudinary.com/dthgw4q5d/image/upload/v1767326460/Guns-N-Roses-anuncia-turne-no-Brasil-e-confirma-show-em-Curitiba-Incheon-14-scaled_cvdsp7.jpg" alt="" />
            <h2>Adicionar Playlist</h2></a>
        </div>
      </div>
      <div className="space"></div>
    </div>
  )
}

export default AdminPage
