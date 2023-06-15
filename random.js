//

let random = document.querySelector("#cycle-marker-btn")

let group5 = L.layerGroup()

random.addEventListener('click', async function(){

    if(group5){    
        group5.clearLayers()
        group5.removeFrom(map1)        
    }

    await map1.eachLayer(function (layer) {
        if (layer instanceof L.MarkerCluster){
        layer.spiderfy();
    }})

    let boundary = map1.getBounds();

    let visibleMarkers = [];

    map1.eachLayer(function (layer) {
      if (layer instanceof L.Marker && boundary.contains(layer.getLatLng())) {    //in leaflet, each marker is add layer, can get their LatLng and push into array to get random later
        visibleMarkers.push(layer);
      }
    });
   
    const randomIndex = Math.floor(Math.random() * visibleMarkers.length);
    let selectedMarker = visibleMarkers[randomIndex];
    
    if (selectedMarker) {
        
        map1.setView(selectedMarker.getLatLng(), 17)
    
        let circle = L.circle(selectedMarker.getLatLng(), {
                radius: 100,
                color: 'red',
                fillOpacity: 0.1,
            }).addTo(group5);

        group5.addTo(map1)

        selectedMarker.openPopup()       
    }

    let myLocation = document.querySelector("#geolocate-btn")
    myLocation.innerText = "Reset View"
    
    myLocation.addEventListener("click", function(){

        if(group5){    
            group5.clearLayers()
            group5.removeFrom(map1)        
        }
    
        map1.setView(setCoordinates, 11.5)
        myLocation.innerText = "My Location"
    })
})







