window.CESIUM_BASE_URL = './static/Cesium/';
const Cesium = require('cesium');

let apikey;
fetch('../../cesium.api').then(response => response.text()).then(text => {apikey = text; init()})

function init(){
    Cesium.Ion.defaultAccessToken = apikey;

    // Initialize the Cesium Viewer in the HTML element with the "cesiumContainer" ID.
    const viewer = new Cesium.Viewer('cesiumContainer', {
        terrainProvider: Cesium.createWorldTerrain(),
        //imageryProvider: false,
        //baseLayerPicker: false, //these are from ion. you should remove them and find something else (i.e. mapbox for completely free use)
      }); 
    
    viewer._cesiumWidget._creditContainer.style.display = "none";
    // Add Cesium OSM Buildings, a global 3D buildings layer. (optional, non-free)
    //const buildingTileset = viewer.scene.primitives.add(Cesium.createOsmBuildings());   
    // Fly the camera to San Francisco at the given longitude, latitude, and height.
    
    $.getJSON( "./static/planes.json", function( data, status ) {
        const positionProperty = new Cesium.SampledPositionProperty();

        let routes = getRoutes(data);

        Object.keys(routes).forEach((route) => {
            let flightData = routes[route]
            let color = Cesium.Color.fromRandom();
            for(let i = 0; i < flightData.length; i++){
                const dataPoint = flightData[i];
                const time = Cesium.JulianDate.fromDate(new Date(parseInt(dataPoint.Timestamp)))
                const position = Cesium.Cartesian3.fromDegrees(dataPoint.Lon, dataPoint.Lat, dataPoint.Altitude);
                positionProperty.addSample(time, position);

                viewer.entities.add({
                    description: `Location: (${dataPoint.Lon}, ${dataPoint.Lat}, ${dataPoint.Altitude})`,
                    position: position,
                    point: { pixelSize: 10, color: color }
                  });
            }

        })
        
    });

}

function getRoutes(data){
    const groupBy = (key) => data.reduce((rv, x) => { (rv[x[key]] = rv[x[key]] || []).push(x); return rv}, {})
    return groupBy("Callsign");
}
