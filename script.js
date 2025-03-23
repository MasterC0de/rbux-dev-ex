const map = L.map("map").setView([39.8283, -98.5795], 4); // Center of the U.S.

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

let marker;

document.getElementById("calculate").addEventListener("click", () => {
  const state = document.getElementById("destinationState").value.trim();

  if (!state) {
    alert("Please enter a state name.");
    return;
  }

  if (marker) {
    map.removeLayer(marker);
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const currentLat = position.coords.latitude;
      const currentLng = position.coords.longitude;

      document.getElementById("currentLocation").value = `${currentLat.toFixed(
        2
      )}, ${currentLng.toFixed(2)}`;

      fetch(
        `https://nominatim.openstreetmap.org/search?state=${state}&country=United States&format=json`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.length === 0) {
            alert("State not found.");
            return;
          }

          const destLat = parseFloat(data[0].lat);
          const destLng = parseFloat(data[0].lon);

          marker = L.marker([destLat, destLng]).addTo(map);
          map.setView([destLat, destLng], 6);

          const distance = calculateDistance(
            currentLat,
            currentLng,
            destLat,
            destLng
          );

          const averageSpeed = 60; // Assuming speed in miles per hour
          const travelTimeHours = distance / averageSpeed;
          const travelTimeSeconds = travelTimeHours * 3600;
          const arrivalTime = new Date(Date.now() + travelTimeSeconds * 1000);

          document.getElementById("distance").textContent = `${distance.toFixed(
            2
          )} miles`;
          document.getElementById("travelTime").textContent = `${travelTimeHours.toFixed(
            2
          )} hours`;
          document.getElementById("arrivalTime").textContent =
            arrivalTime.toLocaleTimeString();
        })
        .catch(() => alert("Error fetching state information."));
    },
    () => {
      alert("Unable to retrieve your current location.");
    }
  );
});

function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 3958.8; // Radius of Earth in miles
  const dLat = degreesToRadians(lat2 - lat1);
  const dLng = degreesToRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(degreesToRadians(lat1)) *
      Math.cos(degreesToRadians(lat2)) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}
