var mapbox = require('mapbox.js')

module.exports.buildOptionObject = function(optionsJSON, lineItem) {
  var newObj = {}
  optionsJSON.forEach(function(option) {
    newObj[option] = lineItem[option]
  })
  return newObj
}

// for geocoding: http://mapbox.com/tilemill/docs/guides/google-docs/#geocoding
// create geoJSON from your spreadsheet's coordinates
module.exports.createGeoJSON = function(data, optionsJSON) {
  var geoJSON = []
  data.forEach(function(lineItem){
    // skip if there are no coords
    if (!lineItem.long || !lineItem.lat) return
    if (optionsJSON) var optionObj = Sheetsee.buildOptionObject(optionsJSON, lineItem)
    var feature = {
      type: 'Feature',
      "geometry": {"type": "Point", "coordinates": [lineItem.long, lineItem.lat]},
      "properties": {
        "marker-size": "small",
        "marker-color": lineItem.hexcolor
      },
      "opts": optionObj,
    }
    geoJSON.push(feature)
  })
  return geoJSON
}

// load basic map with tiles
module.exports.loadMap = function(mapDiv) {
  var map = L.mapbox.map(mapDiv)
  // map.setView(, 4)
  // map.addLayer(L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png'))
  map.touchZoom.disable()
  map.doubleClickZoom.disable()
  map.scrollWheelZoom.disable()
  return map
}

module.exports.addTileLayer = function(map, tileLayer) {
 var layer = L.mapbox.tileLayer(tileLayer)
 layer.addTo(map)
}

module.exports.addMarkerLayer = function(geoJSON, map, zoomLevel) {
  var viewCoords = [geoJSON[0].geometry.coordinates[1], geoJSON[0].geometry.coordinates[0]]
  var markerLayer = L.mapbox.markerLayer(geoJSON)
  markerLayer.setGeoJSON(geoJSON)
  map.setView(viewCoords, zoomLevel)
  // map.fitBounds(geoJSON)
  markerLayer.addTo(map)
  return markerLayer
}