import { chromium } from 'playwright'; // Import chromium from Playwright
import fs from 'fs'; // Import the fs module to work with files

async function getHeadlinesFromPage(pageNumber) {
  const browser = await chromium.launch({
    headless: true, // Set to false to see the browser actions
    args: ['--no-sandbox', '--disable-setuid-sandbox'] // Additional args if needed
  });

  // Create a new page with a specified user agent
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36'
  });
  const page = await context.newPage(); // Open a new page

  const url = `https://boingboing.net/page/${pageNumber}`; // Dynamic URL based on page number
  console.log(`Fetching headlines from: ${url}`);

  // Navigate to the page
  await page.goto(url, {
    waitUntil: 'domcontentloaded', // Wait until the DOM content is loaded
    timeout: 0 // Disable timeout for Cloudflare interception
  });

  // Extract the <a> elements with class "headline"
  const headlines = await page.$$eval('a.headline', (links) =>
    links.map((link) => link.href) // Return an array of href attributes
  );

  console.log(`Found ${headlines.length} headlines on page ${pageNumber}`);

  await browser.close(); // Close the browser after scraping

  return headlines; // Return the array of headlines
}

async function scrapeAllPages() {
  const startingPage = 850;
  const totalPages = startingPage; // Total number of pages to scrape
  let allHeadlines = [];

  for (let currentPage = startingPage; currentPage >= 1; currentPage--) {
    console.log(`Starting to scrape page ${currentPage}...`); // Notify when scraping starts

    try {
      const headlines = await getHeadlinesFromPage(currentPage);
      allHeadlines = allHeadlines.concat(headlines); // Add found headlines to the total list

      // Calculate and log the percentage of completion
      const percentComplete = ((totalPages - currentPage + 1) / totalPages) * 100;
      console.log(`Progress: ${percentComplete.toFixed(2)}% complete`);

      await new Promise((resolve) => setTimeout(resolve, 10000)); // 10-second delay
    } catch (error) {
      console.error(`Error scraping page ${currentPage}:`, error.message);
      break; // Stop the loop if there is an error
    }
  }

  console.log(`Total headlines found: ${allHeadlines.length}`);

  // Save the headlines to a JSON file
  fs.writeFileSync('headlines.json', JSON.stringify(allHeadlines, null, 2)); // Pretty-print JSON
  console.log('Headlines saved to headlines.json');
}

// Start the scraping
scrapeAllPages();
