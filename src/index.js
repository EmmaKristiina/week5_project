/* Lähteinä käytetty kurssimateriaalien lisäksi: 
https://stackoverflow.com/questions/59193983/leaflet-show-popup-on-hover-with-the-location-of-the-mouse
*/

import "./styles.css";

if (document.readyState !== "loading") {
  console.log("valmis");
  initialize();
} else {
  document.addEventListener("DOMContetntLoaded", function () {
    console.log("else valmis");
    initialize();
  });
}

function initialize() {
  const getData = async () => {
    const url =
      "https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326";
    const dataPromise = await fetch(url);
    const data = await dataPromise.json();

    InputToMap(data);
  };

  const InputToMap = (data) => {
    let map = L.map("map", {
      minZoom: -3,
    });

    let geoJson = L.geoJSON(data, {
      onEachFeature: getName,
    }).addTo(map);

    let osm = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 15,
        attribution: "© OpenStreetMap",
      }
    ).addTo(map);

    map.fitBounds(geoJson.getBounds());
  };

  const getName = (feature, layer) => {
    const name = feature.properties.nimi;

    layer.bindPopup(name);
    layer.on("mouseover", function (e) {
      this.openPopup();
    });
    layer.on("mouseout", function (e) {
      this.closePopup();
    });
  };

  getData();
}
