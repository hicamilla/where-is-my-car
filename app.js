const map = L.map('map').setView([51.2328, 6.8467], 15);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

const btnCheckin = document.getElementById('btn-checkin');
const btnNavigate = document.getElementById('btn-navigate');
const btnCheckout = document.getElementById('btn-checkout');
const statusMessage = document.getElementById('status-message');
const statusSub = document.getElementById('status-sub');
const statusDot = document.getElementById('status-dot');
const headerSub = document.getElementById('header-sub');
const placeBubbles = document.getElementById('place-bubbles');
const toast = document.getElementById('toast');

let parkedMarker = null;
let selectedPlace = null;
let toastTimer = null;

document.querySelectorAll('.bubble').forEach(function (bubble) {
  bubble.addEventListener('click', function () {
    document.querySelectorAll('.bubble').forEach(function (b) {
      b.classList.remove('selected');
    });
    bubble.classList.add('selected');
    selectedPlace = bubble.dataset.value;
  });
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toast.classList.add('hidden');
  }, 3000);
}

btnCheckin.addEventListener('click', function () {
  if (!selectedPlace) {
    showToast('Please choose a spot type first');
    return;
  }

  statusMessage.textContent = 'Finding your location...';

  navigator.geolocation.getCurrentPosition(
    function (position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      localStorage.setItem('parkedLat', lat);
      localStorage.setItem('parkedLng', lng);
      localStorage.setItem('parkedName', selectedPlace);

      if (parkedMarker) {
        map.removeLayer(parkedMarker);
      }
      parkedMarker = L.marker([lat, lng]).addTo(map);
      map.setView([lat, lng], 17);

      statusMessage.textContent = 'Your car is parked at the ' + selectedPlace;
      statusSub.textContent = 'Time to go back?';
      statusDot.classList.add('active');
      headerSub.textContent = 'Parked at ' + selectedPlace;

      placeBubbles.classList.add('hidden');

      btnCheckin.classList.add('hidden');
      btnNavigate.classList.remove('hidden');
      btnNavigate.disabled = false;
      btnCheckout.classList.remove('hidden');
      btnCheckout.disabled = false;
    },
    function (error) {
      statusMessage.textContent = 'Could not find your location. Please try again.';
    },
    {
      timeout: 10000,
      enableHighAccuracy: true,
      maximumAge: 0
    }
  );
});

btnNavigate.addEventListener('click', function () {
  const lat = localStorage.getItem('parkedLat');
  const lng = localStorage.getItem('parkedLng');

  if (lat && lng) {
    const isApple = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    const url = isApple
      ? 'maps://?daddr=' + lat + ',' + lng
      : 'https://www.google.com/maps/dir/?api=1&destination=' + lat + ',' + lng;
    
    window.open(url, '_blank');
  }
});

btnCheckout.addEventListener('click', function () {
  localStorage.removeItem('parkedLat');
  localStorage.removeItem('parkedLng');
  localStorage.removeItem('parkedName');

  if (parkedMarker) {
    map.removeLayer(parkedMarker);
    parkedMarker = null;
  }

  selectedPlace = null;

  map.setView([51.2328, 6.8467], 15);

  statusMessage.textContent = 'No spot saved yet';
  statusSub.textContent = 'Choose a type and tap Park here';
  statusDot.classList.remove('active');
  headerSub.textContent = 'Select a spot type then tap Park here';

  document.querySelectorAll('.bubble').forEach(function (b) {
    b.classList.remove('selected');
  });

  placeBubbles.classList.remove('hidden');

  btnCheckin.classList.remove('hidden');
  btnCheckin.disabled = false;
  btnNavigate.classList.add('hidden');
  btnNavigate.disabled = true;
  btnCheckout.classList.add('hidden');
  btnCheckout.disabled = true;
});

function loadSavedSpot() {
  const lat = localStorage.getItem('parkedLat');
  const lng = localStorage.getItem('parkedLng');
  const name = localStorage.getItem('parkedName');

  if (lat && lng) {
    if (parkedMarker) {
      map.removeLayer(parkedMarker);
    }
    parkedMarker = L.marker([parseFloat(lat), parseFloat(lng)]).addTo(map);
    map.setView([parseFloat(lat), parseFloat(lng)], 17);

    statusMessage.textContent = 'Your car is parked at the ' + (name || 'saved spot');
    statusSub.textContent = 'Time to go back?';
    statusDot.classList.add('active');
    headerSub.textContent = 'Parked at ' + (name || 'saved spot');

    placeBubbles.classList.add('hidden');

    btnCheckin.classList.add('hidden');
    btnNavigate.classList.remove('hidden');
    btnNavigate.disabled = false;
    btnCheckout.classList.remove('hidden');
    btnCheckout.disabled = false;
  }
}

loadSavedSpot();