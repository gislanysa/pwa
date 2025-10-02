document.addEventListener('DOMContentLoaded', () => {
    const checkinBtn = document.getElementById('checkin-btn');
    const resultArea = document.getElementById('result-area');

    let currentCountryData = null;
    let currentLocation = null;
    let currentCity = null;
    let stream = null;

    checkinBtn.addEventListener('click', () => {
        resultArea.innerHTML = `<p class="info-message">Obtendo sua localização...</p>`;
        navigator.geolocation.getCurrentPosition(success, error);
    });

    async function success(position) {
        currentLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };
        const locationDetails = await getLocationDetails(currentLocation);
        if (locationDetails && locationDetails.countryCode) {
            currentCity = locationDetails.city;
            searchCountryByCode(locationDetails.countryCode);
        } else {
            resultArea.innerHTML = `<p class="info-message">Não foi possível identificar um país para essa localização</p>`;
        }
    }

    function error() {
        resultArea.innerHTML = `<p class="info-message">Não foi possível obter a localização.</p>`;
    }

    async function getLocationDetails(location) {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            const addr = data.address;
            const city = addr.city || addr.town || addr.village || addr.suburb || "Cidade não encontrada";
            return {
                countryCode: addr.country_code,
                city: city
            };
        } catch (err) {
            resultArea.innerHTML = `<p class="info-message">Não foi possível identificar o país.</p>`;
            return null;
        }
    }
    
    async function searchCountryByCode(code) {
        const url = `https://restcountries.com/v3.1/alpha/${code}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            currentCountryData = data[0];
            displayCountryInfo(currentCountryData, currentCity);
        } catch (err) {
            resultArea.innerHTML = `<p class="info-message">Não foi possível buscar dados do país.</p>`;
        }
    }

    function displayCountryInfo(country, city) {
        const html = `
            <div class="country-card">
                <h2>${country.name.common}</h2>
                <img src="${country.flags.svg}" alt="Bandeira de ${country.name.common}">
                <p><strong>Cidade:</strong> ${city}</p>
                <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>

                <button id="take-photo-btn" class="main-button">Tirar Foto do Local</button>

                <div id="camera-container" class="hidden">
                    <video id="camera-feed" autoplay playsinline></video>
                    <div class="camera-controls">
                        <button id="capture-btn">Capturar Foto</button>
                        <button id="cancel-btn">Cancelar</button>
                    </div>
                </div>
                <canvas id="photo-canvas" class="hidden"></canvas>
                <div id="preview-area"></div>
            </div>`;
        resultArea.innerHTML = html;
        
        document.getElementById('take-photo-btn').addEventListener('click', startCamera);
    }

    async function startCamera() {
        const cameraContainer = document.getElementById('camera-container');
        const videoFeed = document.getElementById('camera-feed');
        const takePhotoButton = document.getElementById('take-photo-btn');
        
        cameraContainer.classList.remove('hidden');
        takePhotoButton.classList.add('hidden');

        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            videoFeed.srcObject = stream;
            
            document.getElementById('capture-btn').addEventListener('click', capturePhoto);
            document.getElementById('cancel-btn').addEventListener('click', () => stopCamera(true));

        } catch (err) {
            cameraContainer.classList.add('hidden');
            takePhotoButton.classList.remove('hidden');
            alert("Não foi possível acessar a câmera.");
        }
    }

    function capturePhoto() {
        const canvas = document.getElementById('photo-canvas');
        const videoFeed = document.getElementById('camera-feed');
        const previewArea = document.getElementById('preview-area');
        
        canvas.width = videoFeed.videoWidth;
        canvas.height = videoFeed.videoHeight;
        canvas.getContext('2d').drawImage(videoFeed, 0, 0, canvas.width, canvas.height);
        const photoData = canvas.toDataURL('image/jpeg');
        
        stopCamera(false);
        
        previewArea.innerHTML = `
            <img src="${photoData}" alt="Foto capturada" style="max-width: 100%; margin-top: 15px; border-radius: 4px;">
            <div class="preview-controls">
                <button id="retake-btn">Refazer Foto</button>
                <button id="save-btn">Salvar Check-in</button>
            </div>
        `;
        document.getElementById('save-btn').addEventListener('click', () => saveCheckin(photoData));
        document.getElementById('retake-btn').addEventListener('click', () => {
            startCamera();
        });
    }

    function stopCamera(isCancel) {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        
        const cameraContainer = document.getElementById('camera-container');
        if (cameraContainer) {
            cameraContainer.classList.add('hidden');
        }

        if (isCancel) {
            const takePhotoButton = document.getElementById('take-photo-btn');
            if (takePhotoButton) {
                takePhotoButton.classList.remove('hidden');
            }
        }
    }

    function saveCheckin(photoData) {
        const checkin = {
            date: new Date().toISOString(),
            location: currentLocation,
            country: currentCountryData,
            city: currentCity,
            photo: photoData
        };
        const checkins = JSON.parse(localStorage.getItem('travelCheckins')) || [];
        checkins.push(checkin);
        localStorage.setItem('travelCheckins', JSON.stringify(checkins));
        resultArea.innerHTML = `<p class="info-message">Check-in salvo com sucesso!</p>`;
    }
});