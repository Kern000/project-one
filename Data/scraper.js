const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')

let baseUrl = "https://sethlui.com/top-hawker-2022/?category"

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function scrapePage1(){

    try{
        let response = await axios.get(baseUrl)
        
        let $ = cheerio.load(response.data);      // Parsing HTML content
        
        let listingElements = $('.description-listing.my-3, .description-listing.my-3 *')

        const filename = 'content.html';        // Specify filename and extension tt will be created
        fs.writeFileSync(filename, $.html(listingElements));       // $.html generates the HTML content from the parsed document. 
        console.log(`Content saved to ${filename}`);
    }
        catch(error) {
        console.error(`Error: ${error}`);
    };
}

scrapePage1()

async function scrapePage2(){

    let pageNumber = 2

    for (let i=0; i < 9; i++){

            let derivUrl = `https://sethlui.com/top-hawker-2022/page/${pageNumber}/?category`
            
        try {
            let response = await axios.get(derivUrl)

            let $ = cheerio.load(response.data);      // Parsing HTML content

            let listingElements = $('.description-listing.my-3, .description-listing.my-3 *')

            const filename = 'content.html';        // Specify filename and extension tt will be created
            fs.appendFileSync(filename, $.html(listingElements));       // $.html generates the HTML content from the parsed document. 
            console.log(`Content saved to ${filename}`);
            }

            catch(error) {
            console.error(`Error: ${error}`);
            };

            pageNumber++

            await delay(6000);

            if (pageNumber == 11){
                pageNumber = 0;
                break;
            }
    }
}

scrapePage2();

