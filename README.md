# 🎵 Spotify Clone - Full Stack Project

Este projeto é uma réplica funcional do Spotify, desenvolvida para gerenciar e consumir conteúdos musicais. A aplicação utiliza um sistema de autenticação robusto que diferencia usuários comuns de administradores, garantindo que a gestão do catálogo (CRUD) seja restrita a perfis autorizados.

## 🚀 Funcionalidades

### 👤 Usuário Padrão

* **Autenticação:** Cadastro de conta e login seguro.
* **Exploração:** Navegação por artistas, álbuns e músicas.
* **Perfil:** Edição de informações pessoais do usuário.
* **Favoritos:** Funcionalidade de "Músicas Curtidas" para acesso rápido.
* **Playlists:** Criação e gestão de playlists personalizadas.

### 🛡️ Usuário Administrador

* **Acesso Total:** Possui todas as permissões do usuário padrão.
* **Gestão de Catálogo (CRUD):** Painel exclusivo para:
* **Álbuns:** Cadastrar, visualizar, atualizar e deletar.
* **Artistas:** Cadastrar, visualizar, atualizar e deletar.
* **Músicas:** Cadastrar, visualizar, atualizar e deletar.

---

## 🛠️ Tecnologias Utilizadas

### Frontend (React.js)

* **React Router:** Gerenciamento de rotas e navegação entre páginas.
* **CSS Modules:** Estilização organizada e modular por componente.
* **State Management:** Controle de estados para o player de música e autenticação.

### Backend (Spring Boot)

* **Java 17:** Linguagem base para o desenvolvimento da API.
* **Spring Security:** Implementação de segurança e controle de acesso baseado em Roles (`UserEnum`).
* **Spring Data JPA:** Persistência de dados e mapeamento objeto-relacional (ORM).
* **REST API:** Endpoints estruturados para comunicação com o frontend.

---

## 📁 Estrutura de Pastas

O projeto segue uma arquitetura clara e separada por responsabilidades:

```text
├── 💻 FRONT (React)
│   ├── src/components  # Componentes como Header, NavBar e MusicPlayer
│   ├── src/pages       # Páginas de Login, Cadastro, Admin e Visualização
│   ├── src/css         # Arquivos de estilo para páginas e componentes
│   └── src/utils       # Funções utilitárias e auxiliares
│
└── ☕ BACKEND (Spring Boot)
    ├── config          # Configurações de Segurança e Web
    ├── controllers     # Endpoints da API (Album, Artist, Music, User)
    ├── dto             # Objetos de Transferência de Dados (Requests/Responses)
    ├── entities        # Modelagem do banco (Album, Artist, Music, User)
    ├── repositories    # Interfaces para comunicação com o banco de dados
    └── services        # Lógica de negócio da aplicação

```

---

## 🔧 Como Executar o Projeto

### Pré-requisitos

* Node.js e npm/yarn instalados.
* Java JDK 17 ou superior.
* Maven instalado.
* Banco de dados (H2, MySQL ou PostgreSQL).

### 1. Backend

1. Navegue até a pasta do servidor.
2. Certifique-se de configurar o arquivo `application.properties` com suas credenciais de banco.
3. Execute o comando:
```bash
mvn spring-boot:run
```

### 2. Frontend

1. Navegue até a pasta `FRONT`.
2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

---

## 📸 Imagens do Projeto

### Home
![Home](/pages/9.png)

### Artist Page
![Artist Page](/pages/1.png)

### Musics Favorites Page
![Musics Favorites Page](/pages/2.png)

### Album Page
![Album Page](/pages/3.png)

### Info Artists
![Info Artists](/pages/4.png)

### Admin Page
![Admin Page](/pages/5.png)

### Delete Album Page
![Delete Album Page](/pages/6.png)

### Delete Song Page
![Delete Song Page](/pages/7.png)

### Delete Artist Page
![Delete Artist Page](/pages/8.png)
