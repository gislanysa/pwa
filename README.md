# Diário de Viagem PWA

[![Deploy to Netlify](https://img.shields.io/badge/Deploy-Netlify-brightgreen)](https://diariodeviagem.netlify.app/)

Este é um Progressive Web App (PWA) criado para funcionar como um diário de viagens digital. Ele permite que os usuários registrem suas localizações, tirem uma foto do local e salvem tudo em um diário pessoal que pode ser visualizado em uma lista ou em um mapa interativo.

## 🚀 Como Usar a Aplicação

A maneira mais fácil e rápida de usar o Diário de Viagem é acessando a versão ao vivo (deploy) que está hospedada no Netlify. Não é preciso instalar nada!

-   **[Clique aqui para Acessar o App](https://diariodeviagem.netlify.app/)**

Você também pode instalar o aplicativo em seu celular ou computador diretamente pelo navegador para uma experiência offline.

## ✨ Funcionalidades Principais

-   **Check-in Inteligente:** Detecta automaticamente a localização do usuário usando a Geolocation API do navegador.
-   **Busca de Dados do País:** Utiliza a API RestCountries para buscar informações como a bandeira e a capital do país.
-   **Registro Fotográfico:** Acessa a câmera do dispositivo para que o usuário possa tirar uma foto do local visitado.
-   **Diário Pessoal:** Salva todos os check-ins no `localStorage` do navegador, exibindo-os em uma grade responsiva.
-   **Gerenciamento de Registros:** Permite ao usuário excluir registros do diário.
-   **Mapa Interativo:** Exibe todos os locais de check-in em um mapa usando a biblioteca Leaflet.js.
-   **Slideshow de Fotos no Mapa:** Para locais com múltiplos check-ins, um slideshow de fotos é ativado quando o mouse passa sobre o marcador no mapa.
-   **Funcionalidade PWA:** O aplicativo pode ser "instalado" em dispositivos móveis ou desktop para uma experiência mais próxima a de um app nativo, com suporte a cache para acesso mais rápido.

## 🛠️ Tecnologias Utilizadas

-   **Linguagens:** HTML5, CSS3, JavaScript 
-   **APIs e Bibliotecas:**
    -   [Leaflet.js](https://leafletjs.com/): Para a criação do mapa interativo.
    -   [RestCountries API](https://restcountries.com/): Para obter dados dos países.
    -   [Nominatim API (OpenStreetMap)](https://nominatim.org/): Para geocodificação reversa.
    -   Geolocation API: Para obter a localização do usuário.
    -   MediaDevices (getUserMedia) API: Para acesso à câmera.
-   **Armazenamento:**
    -   Browser Local Storage: Para salvar os dados do diário de forma persistente no navegador.
-   **PWA (Progressive Web App):**
    -   Service Worker
    -   Web App Manifest

## 💻 Como Executar Localmente

Para executar o projeto em sua máquina local e fazer modificações, siga os passos abaixo.

**Pré-requisitos:**
-   Um navegador web moderno (Chrome, Firefox, etc.).
-   Um servidor local para servir os arquivos (o acesso a recursos como câmera e geolocalização exige um contexto seguro como `localhost` ou `https`).

**Passos:**
1.  Clone o repositório:
    ```sh
    git clone https://github.com/gislanysa/pwa.git
    ```
2.  Navegue até a pasta do projeto:
    ```sh
    cd PWA
    ```
3.  Inicie um servidor local. Uma maneira fácil de fazer isso é usando a extensão **Live Server** no Visual Studio Code. Basta clicar com o botão direito no arquivo `index.html` e selecionar "Open with Live Server".

