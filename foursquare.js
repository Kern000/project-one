const API_Base_Url = "https://api.foursquare.com/v3"                        
const API_key = "fsq3R1hT9y8NcNogN8uaO/32VvoruReXBXuuIXAEkD2YmGs="
const headers = {
    Accept: 'application/json',
    Authorization: API_key
}

async function search(lat, lng, query, zoom){

    let ll = lat + "," + lng;                                               //mimic ll parameter in foursquare
    let radius = calculateRadius(zoom)
    let response = await axios.get(API_Base_Url + "/places/search", {       //Search for Places endpoint
        headers: {
            ...headers                                                      //Expand object of headers, namely Accept and Authorization
        },
        params: {
            'll': ll,
            'query': query,
            'v': '20210903',                                                // Foursquare API version
            'limit': '40',
            'radius': radius,
        }
    })
    return response.data;
}

function calculateRadius(zoom) {

    const zoomToRadius = {
      11: 15000,
      12: 14000,
      13: 5000,
      14: 4000,
      15: 2000,
      16: 1200,
      17: 500,
    };

    return zoomToRadius[zoom];
}

let searchResultLayer = L.layerGroup();

function foursquareSearch(){
    
    document.querySelector('#search-btn').addEventListener('click', async ()=>{

        let searchBar = document.querySelector("#search-bar")
        searchBar.placeholder = "Search by food or place"
        
        let searchBtn = document.querySelector('#search-btn');
        searchBtn.style.opacity = "1"

        let query = document.querySelector('#search-bar').value
        let zoom = map1.getZoom();
        let bounds = map1.getBounds().getCenter();
        let response = await search(bounds.lat, bounds.lng, query, zoom);
        console.log(response)
        
        searchResultLayer.clearLayers()                                         //clear previous results
        group4.clearLayers()

        backupCounter = 0
        backupSearch.innerText = "Search not working?"

        let searchResultContainer = document.querySelector("#search-results");
        searchResultContainer.innerHTML = ''
        searchResultContainer.scrollTop = 0;

        for (let venue of response.results){
        
            let coordinate = [venue.geocodes.main.latitude, venue.geocodes.main.longitude]
            let marker = L.marker(coordinate)
            marker.bindPopup(`<div><p><h6>${venue.name}</h6></p><p>${venue.location.address}</p></div>`)
            marker.addTo(searchResultLayer)

            let flyToMarker = null
            
            marker.on('click', function() {
                if (flyToMarker === marker) {
                    map1.flyTo(marker.getLatLng(), 16);
                    flyToMarker = null;
                    marker.openPopup();
                } else {
                    flyToMarker = marker;
                }
            })

            let resultItem = document.createElement('div');
            resultItem.className = "search-result"   
            resultItem.innerHTML = `<p><h8>${venue.name}</h8></p><p>${venue.location.address}</p>`
            
            resultItem.addEventListener('click', function(){
                map1.flyTo(coordinate, 14);
                marker.openPopup();               
        })

        searchResultContainer.style.display = "flex";
        searchResultContainer.appendChild(resultItem);

        let closeWindow = document.querySelector("#close-window");
        closeWindow.style.display = "inline";

        closeWindow.addEventListener('click', function(){
            searchResultContainer.innerHTML = ''
            searchResultContainer.style.display = "none";
            closeWindow.style.display = "none";
            searchResultLayer.clearLayers()                                         //clear previous results
            searchResultContainer.scrollTop = 0;
        })
    }

    if (!map1.hasLayer(searchResultLayer)){     //!map is used as a condition to check if map object has searchResultLayer. Code block execute if no layer.
        map1.addLayer(searchResultLayer)
        }
})           
    
}
foursquareSearch()


const provider = new GeoSearch.OpenStreetMapProvider();

//

let backupSearch = document.querySelector("#backup-btn")
let searchBar = document.querySelector("#search-bar")

let backupCounter = 0
let group4 = L.layerGroup()

backupSearch.addEventListener('click', async function(){

    let query1 = searchBar.value

    if (backupCounter == 0){
        backupSearch.innerText = "Use 2nd engine?"
        backupCounter++
    }
    else if (backupCounter == 1){
        backupSearch.innerText = "Search by place (Click Here)"
        searchBar.placeholder = "Search by address"
        searchBar.value = ""

        let searchBtn = document.querySelector('#search-btn')
        searchBtn.style.opacity = "0.2";

        backupCounter++
    }
    else {

        group4.clearLayers()

        map1.eachLayer(layer => {
            if (layer == searchResultLayer) {
                searchResultLayer.clearLayers();
            }
          })

        let closeWindow = document.querySelector("#close-window");
        let searchResultContainer = document.querySelector("#search-results")
        searchResultContainer.innerHTML = ''
        searchResultContainer.style.display = "none";
        closeWindow.style.display = "none";
        searchResultContainer.scrollTop = 0;
        
        const results = await provider.search({query: query1});

        console.log(results)
        if (results){
            for (let result of results){
                let lat = result.y;
                let lng = result.x;
                let coordinates = [lat, lng]
                let marker2 = L.marker(coordinates).addTo(group4)
           
                marker2.on('click', function() {
                        
                    map1.flyTo(marker2.getLatLng(), 14);
                        
                })
            }
            
            if (results.length > 0) {
                let randomIndex = Math.floor(Math.random() * results.length);
                let randomMarker = results[randomIndex];
                let randomCoordinates = [randomMarker.y, randomMarker.x];
                map1.flyTo(randomCoordinates, 13);
              }
        }
    }
    group4.addTo(map1)
})










