const fs = require('fs')
const csvToJson = require('csvtojson')
const axios = require('axios')
const apiKey = "0300b47c212e442f8556dabde905c5b8"

const openCsv = fs.readFileSync('./list-of-hawker-centres.csv', 'utf8')

// can't use axios since downloaded csv file. Axios is http request though it works for local json.

async function convertCsvToJson(dataSource){
    let convertedData = await csvToJson().fromString(dataSource)
    return convertedData
}

convertCsvToJson(openCsv).then((jsonObj) => {
    const jsonString = JSON.stringify(jsonObj);   //convert the array of json object to string because fs.writeFileSync expects a string
    fs.writeFileSync('hawkerlist.json', jsonString);
})
  .catch((error) => {
    console.error('Error:', error);
  });

// because csvToJson is asynchonous - it return promise. So use .then to handle promise.then(onFulfilled, onRejected);
// use await in function to make it synchronous. Don't need .then here actually. But will do for learning.

// massage data for geocoding

function filtering() {
    try {
      const jsonPath = './hawkerlist.json';
      const jsonContent = fs.readFileSync(jsonPath, 'utf8');
      const data = JSON.parse(jsonContent);
    

      for (let entry of data){
        entry["location_of_centre"] = entry["location_of_centre"].replace(/S\(/g, 'Singapore ');                       // regex to replace S(, globally
        entry["location_of_centre"] = entry["location_of_centre"].replace(/\)/g, '');                                  // regex
        entry["location_of_centre"] = entry["location_of_centre"].replace(/\/[^,]*/, '');
        entry["location_of_centre"] = entry["location_of_centre"].replace(/\/.*$/, "");
        entry["location_of_centre"] = entry["location_of_centre"].replace(/\,/g, '');
        entry["location_of_centre"] = entry["location_of_centre"].replace(/Blk/g, '');


        console.log(entry["location_of_centre"])

        }    
  
      const updatedJsonOutput = JSON.stringify(data, null, 2);
      fs.writeFileSync(jsonPath, updatedJsonOutput);
  
      console.log('JSON data updated successfully.');
      
      } catch (error) {
        console.error('An error occurred:', error.message);
      }
  }
  
filtering()

//Drawback of using regex and fs is that will overwrite the file, so if regex wrong it will overwrite with wrong regex, keep a file at hand to undo changes

// // Get coordinates

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
      const jsonPath = 'hawkerlist.json';
      const jsonContent = fs.readFileSync(jsonPath, 'utf8');
      const data = JSON.parse(jsonContent);
  
      const promises = data.map(async (entry) => {
  
        entry.coordinates = await getCoordinates(entry.name_of_centre)
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
  
// error rate of No geocoding results found and incorrect geocoding seems moderately for hawker centre locations

