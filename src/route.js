window.CESIUM_BASE_URL = './static/Cesium/';
const Cesium = require('cesium');

const start = Cesium.JulianDate.fromDate(new Date(parseInt(1613893161)))
const stop  = Cesium.JulianDate.fromDate(new Date(parseInt(1616956633)))

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
    
    viewer._cesiumWidget._creditContainer.style.display = "none"; //remove logo
    // Add Cesium OSM Buildings, a global 3D buildings layer. (optional, non-free)
    //const buildingTileset = viewer.scene.primitives.add(Cesium.createOsmBuildings());   
    
    setViewer(viewer);

    $.getJSON( "./static/planes.json", function( data, status ) {
        let routes = getRoutes(data);

        for(let route of Object.keys(routes)){
            const positionProperty = new Cesium.SampledPositionProperty();
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
                    point: { pixelSize: 1, color: Cesium.Color.RED }
                  });
            }

            loadAirplane(viewer, positionProperty, color, Cesium.JulianDate.fromDate(new Date(parseInt(flightData[0].Timestamp))), Cesium.JulianDate.fromDate(new Date(parseInt(flightData[flightData.length - 1].Timestamp))));
        }
        
    });

}

function getRoutes(data){
    const groupBy = (key) => data.reduce((rv, x) => { (rv[x[key]] = rv[x[key]] || []).push(x); return rv}, {})
    return groupBy("Callsign");
}

function setViewer(viewer){

    viewer.clock.startTime = start.clone();
    viewer.clock.stopTime = stop.clone();
    viewer.clock.currentTime = start.clone();
    viewer.timeline.zoomTo(start, stop);

    // Speed up the playback speed 50x.
    viewer.clock.multiplier = 50;
    // Start playing the scene.
    viewer.clock.shouldAnimate = true;
}

async function loadAirplane(viewer, positionProperty, color, start, stop){
    const airplaneUri = await Cesium.IonResource.fromAssetId(478494);
    const airplaneEntity = viewer.entities.add({
        availability: new Cesium.TimeIntervalCollection([ new Cesium.TimeInterval({ start: start, stop: stop }) ]),
        position: positionProperty,
        point: { pixelSize: 30, color: Cesium.Color.BLUEVIOLET },
        path: new Cesium.PathGraphics({ width: 4, material: color }),
        model: {uri: airplaneUri},
        orientation : new Cesium.VelocityOrientationProperty(positionProperty)
    });
    viewer.trackedEntity = airplaneEntity;
}