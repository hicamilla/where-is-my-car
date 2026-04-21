const map = L.map('map').setView([51.2328, 6.8467], 15);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

const btnCheckin = document.getElementById('btn-checkin');
const btnNavigate = document.getElementById('btn-navigate');
const btnCheckout = document.getElementById('btn-checkout');
const statusMessage = document.getElementById('status-message');

let parkedMarker = null;

btnCheckin.addEventListener('click', function () {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      localStorage.setItem('parkedLat', lat);
      localStorage.setItem('parkedLng', lng);

      if (parkedMarker) {
        map.removeLayer(parkedMarker);
      }
      parkedMarker = L.marker([lat, lng]).addTo(map);
      map.setView([lat, lng], 17);

      statusMessage.textContent = 'Spot saved! Lat: ' + lat.toFixed(5) + ', Lng: ' + lng.toFixed(5);

      btnNavigate.disabled = false;
      btnCheckout.disabled = false;
      btnCheckin.disabled = true;
    },
    function (error) {
      statusMessage.textContent = 'Could not get location:' + error.message;
    }
  );
});

btnNavigate.addEventListener('click', function () {
  const lat = localStorage.getItem('parkedLat');
  const lng = localStorage.getItem('parkedLng');

  if (lat && lng) {
    const url = 'https://www.google.com/maps/dir/?api=1&destination=' + lat + ',' + lng;
    window.open(url, '_blank');
  }
});

function loadSavedSpot() {
  const lat = localStorage.getItem('parkedLat');
  const lng = localStorage.getItem('parkedLng');

  if (lat && lng) {
    statusMessage.textContent = 'Spot saved! Lat: ' + parseFloat(lat).toFixed(5) + ', Lng: ' + parseFloat(lng).toFixed(5);
    btnNavigate.disabled = false;
    btnCheckout.disabled = false;
    btnCheckin.disabled = true;

    if (parkedMarker) {
      map.removeLayer(parkedMarker);
    }

    parkedMarker = L.marker([parseFloat(lat), parseFloat(lng)]).addTo(map);
    map.setView([parseFloat(lat), parseFloat(lng)], 17);
  }

}

loadSavedSpot();

