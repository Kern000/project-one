// Login option
const apiKey = "0300b47c212e442f8556dabde905c5b8"


let loginCoordinates = [];
let defaultCoordinates = [1.33433, 103.821833];
let setCoordinates = defaultCoordinates;

if (loginCoordinates.length !== 0){
    setCoordinates = loginCoordinates
};

// initialize the map and layers

let map1 = L.map('map1').setView(setCoordinates, 11);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map1);

let group1 = L.markerClusterGroup();
let group2 = L.layerGroup();

// map settings

map1.setMinZoom(11);

let maxBounds = map1.getBounds();
map1.setMaxBounds(maxBounds)

// load layers

async function loadCriticData() {

    let response = await axios.get("./Data/filteredContent.json")
    return (response.data)
}


const customIcon = L.icon({
    iconUrl: './picture/icon.jpg',
    iconSize: [30, 30],
    popupAnchor:  [0, -25]
  });

window.addEventListener('DOMContentLoaded', async function(){

    let loadedData = await loadCriticData()
    let flyToMarker = null;

    for (let entry of loadedData){

            if (entry.coordinates){

                let marker1 = L.marker((entry.coordinates),{ icon: customIcon }).addTo(group1)

                marker1.bindPopup(`
                <div class='popup-container'>
                <p><h6 class='popup-title'>${entry["title"]}</h6></p>
                <p><h7 class='popup-address'>${entry["address"]}</h7></p>
                <p><h7 class='popup-link'><a href=${entry["link"]} target="_blank"> Critic Review Here </a></h7></p>
                </div>`
                )
            
                marker1.on('click', function() {
                    if (flyToMarker === marker1) {
                        map1.flyTo(marker1.getLatLng(), 16);
                        flyToMarker = null;
                        marker1.openPopup();
                    } else {
                        flyToMarker = marker1;
                    }
                });
            }
        }
        group1.addTo(map1)
    }
)

group2.addTo(map1)

let group3 = L.layerGroup()

const customIcon2 = L.icon({
    iconUrl: './picture/icongreen.png',
    iconSize: [12, 20],
  });

async function loadHawker(){
    let response = await axios.get("./Data/hawkerlist.json") 
    return response.data    
}

window.addEventListener('DOMContentLoaded', async function(){

    let loadedData = await loadHawker()
    let flyToMarker = null;

    for (let entry of loadedData){

            if (entry.coordinates){

                let marker1 = L.marker((entry.coordinates),{ icon: customIcon2 }).addTo(group3)

                marker1.bindPopup(`
                <div class='popup-container'>
                <p><h6 class='popup-title'> Food Centre: ${entry["name_of_centre"]}</h6></p>
                <p><h7 class='popup-address'> Location: ${entry["location_of_centre"]}</h7></p>
                <p><h7 class='popup-link'> Stall count: ${entry["no_of_cooked_food_stalls"]}</h7></p>
                </div>`
                )

                marker1.on('click', function() {
                    if (flyToMarker === marker1) {
                        map1.flyTo(marker1.getLatLng(), 16);
                        flyToMarker = null;
                        marker1.openPopup();
                    } else {
                        flyToMarker = marker1;
                    }
                });
            }
        }
    }
)

let baselayer = {
    'clearmap': group2,
    'critics': group1,
}

L.control.layers(baselayer).addTo(map1)

//

let hawkerToggle = document.querySelector("#hawker-btn")

let hawkerCounter = 0;
hawkerToggle.addEventListener("click", function(){

    hawkerCounter++
    if (hawkerCounter == 1){
        group3.addTo(map1);
    }

    else if (hawkerCounter == 2){
        map1.removeLayer(group3);
        hawkerCounter = 0;
    }
})

//


L.control.scale().addTo(map1);

let options1 = {
    flyTo: true,
    initialZoomLevel: 16,
    drawCircle: false,
    returnToPrevBounds: true,

};

let locateControl = L.control.locate(options1)
locateControl.addTo(map1)

let myLocation = document.querySelector("#geolocate-btn")

let locateClickCount = 0;

myLocation.addEventListener("click", function() {

    locateClickCount ++

    if (locateClickCount % 2 !== 0){

        locateControl.start()
        myLocation.innerText = "Reset View"
    }
    else if (locateClickCount % 2 == 0){

        locateControl.stop()
        map1.setView(setCoordinates, 11.5)
        locateClickCount = 0
        myLocation.innerText = "My Location"
    }
})

//

let geoLocation = document.querySelector('.leaflet-bar-part.leaflet-bar-part-single')

geoLocation.addEventListener("click", function() {

    locateClickCount ++

    if (locateClickCount % 2 !== 0){

        myLocation.innerText = "Reset View"
           
    }

    else if (locateClickCount % 2 == 0){
        map1.setView(setCoordinates, 11.5)
        locateClickCount = 0
        myLocation.innerText = "My Location"
    }
})






