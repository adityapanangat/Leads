import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';

const baseUrl = 'https://globalvoices.org/';
const articlesByDate = {};
let totalLinksFound = 0; // Counter for total links found

async function scrapePage(year, pageNumber) {
  try {
    const response = await axios.get(`${baseUrl}${year}/${pageNumber > 1 ? `page/${pageNumber}/` : ''}`);
    const html = response.data;
    const $ = cheerio.load(html);

    // Find all articles on the page
    $('h3.post-title a').each((index, element) => {
      const link = $(element).attr('href');
      const date = extractDateFromLink(link);

      if (date) {
        // Store the link under the corresponding date
        if (!articlesByDate[date]) {
          articlesByDate[date] = [];
        }
        articlesByDate[date].push(link);
        totalLinksFound++; // Increment the counter
      }
    });
  } catch (error) {
    console.error(`Error fetching page ${pageNumber}:`, error.message);
    throw new Error();
  }
}

function extractDateFromLink(link) {
  const match = link.match(/\/(\d{4})\/(\d{2})\/(\d{2})\//);
  return match ? `${match[1]}-${match[2]}-${match[3]}` : null;
}

async function scrapeAllPages() {
  for (let year = 2024; year >= 2023; year--) { // Loop through years
    let pageNumber = 1;
    while (true) {
      console.log(`Scraping ${year} page ${pageNumber}...`);

      try {
        await scrapePage(year, pageNumber);
      }
      catch(error) {
        break;
      }

      // Delay between requests
      await new Promise(resolve => setTimeout(resolve, 10000)); // 10-second delay

      // Check if no articles were found, indicating end of pages for that year
      if (Object.keys(articlesByDate).length > 0 && !articlesByDate[Object.keys(articlesByDate).at(-1)]) {
        break;
      }

      pageNumber++;
    }
  }

  // Save the scraped data to a JSON file
  saveToJsonFile();
  console.log('Scraping completed!');
  console.log(`Total links found: ${totalLinksFound}`);
}

function saveToJsonFile() {
  const filePath = 'articles.json'; // Path to save the JSON file
  const jsonData = JSON.stringify(articlesByDate, null, 2); // Format the data with 2-space indentation

  try {
    fs.writeFileSync(filePath, jsonData); // Write the data to a JSON file
    console.log(`Data successfully saved to ${filePath}`);
  } catch (error) {
    console.error(`Error writing to file: ${error.message}`);
  }
}

// Start scraping
scrapeAllPages();
