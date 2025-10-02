document.addEventListener('DOMContentLoaded', () => {
    const checkinBtn = document.getElementById('checkin-btn');
    const resultArea = document.getElementById('result-area');
    const cameraContainer = document.getElementById('camera-container');
    const videoFeed = document.getElementById('camera-feed');
    const captureBtn = document.getElementById('capture-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const canvas = document.getElementById('photo-canvas');

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
            resultArea.innerHTML = `<p class="info-message">Não foi possivel identificar um país para essa localização</p>`;
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
                <div id="preview-area"></div>
            </div>`;
        resultArea.innerHTML = html;
        document.getElementById('take-photo-btn').addEventListener('click', startCamera);
    }

    async function startCamera() {
        cameraContainer.classList.remove('visible');
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            videoFeed.srcObject = stream;
        } catch (err) {
            cameraContainer.classList.add('visible');
            alert("Não foi possível acessar a câmera.");
        }
    }
    
    captureBtn.addEventListener('click', () => {
        canvas.width = videoFeed.videoWidth;
        canvas.height = videoFeed.videoHeight;
        canvas.getContext('2d').drawImage(videoFeed, 0, 0, canvas.width, canvas.height);
        const photoData = canvas.toDataURL('image/jpeg');
        stopCamera();
        
        const previewArea = document.getElementById('preview-area');
        previewArea.innerHTML = `
            <img src="${photoData}" alt="Foto capturada" style="max-width: 100%; margin-top: 15px; border-radius: 4px;">
            <button id="save-btn" class="main-button" style="margin-top: 10px;">Salvar Check-in</button>
        `;
        document.getElementById('save-btn').addEventListener('click', () => saveCheckin(photoData));
    });

    cancelBtn.addEventListener('click', stopCamera);

    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        cameraContainer.classList.add('visible');
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