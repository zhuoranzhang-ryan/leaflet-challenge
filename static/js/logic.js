path = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});

var myMap = L.map("map", {
  center: [36.7, -119,41],
  zoom: 4,
});

var colors = d3.scaleLinear()
  .domain(d3.ticks(0, 5, 10))
  .range(["#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598", 
  "#FFFFBF", "#FEE08B", "#FDAE61", "#F46D43", "#D53E4F"]);

light.addTo(myMap);
d3.json(path, function(data) {
      L.geoJson(data, {
          pointToLayer: function(feature, latlng) {
              return L.circleMarker(latlng, {
                radius: feature.properties.mag *4,
                fillColor: colors(feature.properties.mag),
                color: "#000",
                weight: 0.2,
                opacity: 7,
                fillOpacity: 0.7
            });
          },
          onEachFeature: function(feature, layer) {
            layer.bindPopup(feature.properties.mag);
          },
      }).addTo(myMap);

      var legend = L.control({position: 'bottomright'});

      legend.onAdd = function(map) {

          var div = L.DomUtil.create('div', 'info legend'),
              mags = [0,1,2,3,4,5];

          for (var i = 0; i < mags.length; i++) {
;              if (i < mags.length - 1) {
                  div.innerHTML +=
                    '<ul style="background-color: ' + colors(mags[i] + 1) + '">'+ mags[i] + '-' + mags[i+1] + '</ul>';
              } else {
                  div.innerHTML +=
                  '<ul style="background-color: ' + colors(mags[i] + 1) + '">'+ mags[i] + '+' + '</ul>';
              }
          };
          return div;
      };
      legend.addTo(myMap);

  });