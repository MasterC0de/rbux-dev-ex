const map = L.map("map").setView([39.8283, -98.5795], 4); // Center of the U.S.

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

let marker;

document.getElementById("calculate").addEventListener("click", () => {
  const latitude = parseFloat(document.getElementById("latitude").value);
  const longitude = parseFloat(document.getElementById("longitude").value);

  if (!latitude || !longitude) {
    alert("Please enter valid coordinates.");
    return;
  }

  if (marker) {
    map.removeLayer(marker);
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const currentLat = position.coords.latitude;
      const currentLng = position.coords.longitude;

      marker = L.marker([latitude, longitude]).addTo(map);
      map.setView([latitude, longitude], 7);

      const distance = calculateDistance(
        currentLat,
        currentLng,
        latitude,
        longitude
      );

      const averageSpeed = 60; // Assuming average speed in miles per hour.
      const travelTime = distance / averageSpeed;
      const estimatedArrival = new Date(
        Date.now() + travelTime * 60 * 60 * 1000
      );

      document.getElementById("results").innerHTML = `
        <p>Distance: ${distance.toFixed(2)} miles</p>
        <p>Estimated Travel Time: ${travelTime.toFixed(2)} hours</p>
        <p>Estimated Arrival: ${estimatedArrival.toLocaleTimeString()}</p>
      `;
    },
    () => {
      alert("Unable to retrieve your location.");
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
