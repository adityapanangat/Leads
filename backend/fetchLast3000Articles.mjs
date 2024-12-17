import fs from 'fs';
import { fetchArticle } from './boingboingArticleScraper.mjs'; // Assuming you have a fetchArticle function

// Function to read JSON file
function readJsonFile(filePath) {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

// Function to write JSON file
function writeJsonFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Main function to fetch articles and save data with progress percentage
async function fetchArticlesAndSave() {
  const newsArticleLinks = readJsonFile('backend/newsArticles.json'); // Load your article links
  const last3000Links = newsArticleLinks.slice(-3000); // Take the last 3000 links

  let articleInformation = {}; // Object to store { link: articleData }
  const chunkSize = 100; // Save every 100 links
  const totalArticles = last3000Links.length; // Total number of articles (3000)
  
  for (let i = 0; i < totalArticles; i++) {
    const link = last3000Links[i];
    
    try {
      const currentArticle = await fetchArticle(link); // Fetch the article
      
      // Use the link as the key, and the fetched article data as the value
      articleInformation[link] = currentArticle;

      // Calculate and log the progress percentage
      const progressPercentage = ((i + 1) / totalArticles * 100).toFixed(2); // Progress as a percentage
      console.log(`Progress: ${progressPercentage}% (${i + 1} of ${totalArticles} articles fetched)`);

      // Every 100 articles, save to file
      if ((i + 1) % chunkSize === 0) {
        console.log(`Saving ${i + 1} articles...`);
        writeJsonFile('backend/newsArticleInformation.json', articleInformation); // Save to file
      }

    } catch (error) {
      console.error(`Error fetching article for link ${link}:`, error);
    }
  }

  // Final save if any remaining articles
  console.log('Saving the final batch of articles...');
  writeJsonFile('backend/newsArticleInformation.json', articleInformation);

  console.log('Finished fetching and saving articles.');
}

// Run the function
fetchArticlesAndSave();
