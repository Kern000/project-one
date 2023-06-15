const fs = require('fs');
const openHtml = fs.readFileSync('content.html', 'utf8'); //read html file
const cheerio = require('cheerio');
const axios = require('axios')
const apiKey = "0300b47c212e442f8556dabde905c5b8"

const $ = cheerio.load(openHtml)

let container = []

$('h6').each((index, element) => {

    const title = $(element).text().trim();

    const uniqueTitle = container.every(item => item['title'] !== title);

    // check if it is unique entry in the container that we push into

    if (uniqueTitle) {
        const entry = {
            'title': title,
            'address': '',
            'link': '',
          };

        // Find the first <h6> element after the current <h4>

        const $nextH4 = $(element).nextUntil('h4').addBack('h4');

        if ($nextH4.length > 0) {

          const $addressElement = $nextH4.nextUntil('h4').addBack('h4');
    
          const $pElement = $addressElement.find('p');
          const $spanElement = $addressElement.find('p').find('span[data-sheets-value]');
    
          if ($spanElement.length > 0) {
            entry.address = $spanElement.attr('data-sheets-value');
          } else if ($pElement.length > 0) {
            entry.address = $pElement.text().trim();
          }
    
            const $nextA = $nextH4.nextUntil('.d-flex.flex-wrap.pt-5.custom-new-icon')
            .addBack('.d-flex.flex-wrap.pt-5.custom-new-icon')
            .find('a')
            .first();

            if ($nextA.length >= 0) {
                entry.link = $nextA.attr('href');
            }
        }
        
        container.push(entry);
      }
});

const jsonOutput = JSON.stringify(container, null, 2);

fs.writeFileSync('filteredContent.json', jsonOutput);

console.log('JSON data output to .json file.')

function filtering() {
  try {
    const jsonPath = 'filteredContent.json';
    const jsonContent = fs.readFileSync(jsonPath, 'utf8');
    const data = JSON.parse(jsonContent);

    for (let entry of data){
      entry.address = entry.address.replace(/\{\"1\":2,\"2\":\"/, '');          // regex
      entry.address = entry.address.replace(/\"}/, '');                         // regex
      entry.address = entry.address.replace(/Our ReviewVideoOrder Now/, '');    // regex

      }    

    const updatedJsonOutput = JSON.stringify(data, null, 2);
    fs.writeFileSync(jsonPath, updatedJsonOutput);

    console.log('JSON data updated successfully.');
    
    } catch (error) {
      console.error('An error occurred:', error.message);
    }
}

filtering()

// Now to get the Lat Lng using a free Geocoder

const axiosInstance = axios.create({
  baseURL: "https://api.geoapify.com/v1",
  params: {
    apiKey: apiKey
  }
})

async function getCoordinates(address) {

  try {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodedAddress}&apiKey=${apiKey}`;

    const response = await axios.get(url);

    if (response.data && response.data.features && response.data.features.length > 0) {

      const { lat, lon } = response.data.features[0].properties;

      return [parseFloat(lat), parseFloat(lon)];

    } else {

      console.log('No geocoding results found.');

    }
  } catch (error) {
    console.error('Error during geocoding', error.message);
  }
}

async function getLatLng (){
  
  try {
    const jsonPath = 'filteredContent.json';
    const jsonContent = fs.readFileSync(jsonPath, 'utf8');
    const data = JSON.parse(jsonContent);

    const promises = data.map(async (entry) => {

      entry.coordinates = await getCoordinates(entry.address)
      return entry
    })

    const updatedData = await Promise.all(promises)
    const updatedJsonOutput = JSON.stringify(updatedData, null, 2);
    fs.writeFileSync(jsonPath, updatedJsonOutput);

    console.log('JSON data updated successfully.');

  }
  catch(error){
    console.error("Error inserting lat lng", error.message)
}
}

getLatLng()
