//

let random = document.querySelector("#cycle-marker-btn")

let group5 = L.layerGroup()

random.addEventListener('click', async function(){

    if (map1.getZoom() < 12){
        map1.setView(setCoordinates, 12)    
        
    }
    
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

        await map1.eachLayer(function (layer) {
            if (layer instanceof L.MarkerCluster){
            layer.spiderfy();
        }})
    
        map1.setView(selectedMarker.getLatLng(), 17)

        let circle = L.circle(selectedMarker.getLatLng(), {
                radius: 100,
                color: 'green',
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

    let geoLocation = document.querySelector('.leaflet-bar-part.leaflet-bar-part-single')
    geoLocation.addEventListener("click", function() {
    
        if(group5){    
            group5.clearLayers()
            group5.removeFrom(map1)        
        }
    })
})

let phrases = [                                         
    "Foodie bliss, let's indulge together!",
    "Cravings calling, let's eat!",
    "Hungry hearts unite, let's feast!",
    "Tempting treats, let's dig in.",
    "Savoring flavors, creating tasty memories.",
    "Food adventure, let's embark!",
    "Let's makan, Singaporean food extravaganza!",
    "Culinary escapade, let's dive in.",
    "Food lovers unite, let's indulge!",
    "Let's gather and enjoy.",
    "Mouthwatering journey, let's devour!",
    "Epicurean delight, let's savor.",
    "Let's eat, chat, and relish.",
    "Flavors galore, let's indulge.",
    "Tantalizing bites, let's enjoy.",
    "Foodie's dream, let's feast.",
    "Let's indulge, savor, repeat.",
    "Let's eat and make memories.",
    "Deliciousness awaits, let's sate.",
    "Food festivity, let's celebrate.",
    "Let's gather and savor.",
    "Let's munch, laugh, and enjoy.",
    "Gourmet gathering, let's relish.",
    "Let's eat and create.",
    "Flavorful feast, let's enjoy.",
    "Let's gather, eat, and celebrate.",
    "Let's makan, flavors await.",
    "Tasty treasures, let's discover.",
    "Let's gather and devour together.",
    "Flavor exploration, let's dive.",
    "Let's feast, chat, indulge.",
    "Food lovers' haven, let's indulge.",
    "Let's savor, delight, enjoy.",
    "Let's indulge in culinary.",
    "Gather, eat, and relish."
]

const toast1 = document.getElementById('toast1');
const toastInstance1 = new bootstrap.Toast(toast1);

random.addEventListener("click", function() {

    let toastWords = document.querySelector(".toast-words")

    const randomIndex2 = Math.floor(Math.random() * phrases.length);
    let textContent = phrases[randomIndex2];

    toastWords.innerText = textContent     

    toastInstance1.show()

})



