window.CESIUM_BASE_URL = './static/Cesium/';
const Cesium = require('cesium');

let apikey;
fetch('../../cesium.api').then(response => response.text()).then(text => {apikey = text; init()})

function init(){
    Cesium.Ion.defaultAccessToken = apikey;

    // Initialize the Cesium Viewer in the HTML element with the "cesiumContainer" ID.
    const viewer = new Cesium.Viewer('cesiumContainer', {
        terrainProvider: Cesium.createWorldTerrain()
      }); 

    // Add Cesium OSM Buildings, a global 3D buildings layer. (optional)
    const buildingTileset = viewer.scene.primitives.add(Cesium.createOsmBuildings());   
    // Fly the camera to San Francisco at the given longitude, latitude, and height.
    viewer.camera.flyTo({
        destination : Cesium.Cartesian3.fromDegrees(-122.4175, 37.655, 400),
        orientation : {
            heading : Cesium.Math.toRadians(0.0),
            pitch : Cesium.Math.toRadians(-15.0),
        }
    });
}
