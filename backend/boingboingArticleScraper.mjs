import { chromium } from 'playwright';
import axios from 'axios';


  // Method to fetch article details from the link
export async function fetchArticle(link) {

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
});

const context = await browser.newContext({
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
  timeout:0,
});

    const page = await context.newPage();
    // Navigate to the article link
    await page.goto(link, { waitUntil: 'domcontentloaded'});


    // Extract the required details
    const articleInformation = await page.evaluate(() => {
        return {
          headline: document.querySelector('.entry-title')?.innerText || null,
          author: document.querySelector('.byline')?.innerText || null,
          date: document.querySelector('.post-date')?.innerText || null,
          time: document.querySelector('.post-time')?.innerText || null,
          text: document.querySelector('[itemprop="text"]')?.innerText || null,
          imageUrl: document.querySelector('[itemprop="image"]')?.getAttribute('src') || null,
        };
      });


    // Return the article details
    console.log(`fetched ${articleInformation.headline}`);

    browser.close();
    return articleInformation;
}


