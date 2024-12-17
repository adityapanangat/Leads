import express from 'express';
import { fetchArticle } from './boingboingArticleScraper.mjs';
import cors from 'cors';

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

import fs from 'fs';

const newsArticleLinks = readJsonFile('backend/newsArticles.json'); // Read and parse the JSON file

const weightedArray = newsArticleLinks.map((item, index) => ({
  item,
  weight: index + 1 // Higher index means higher weight
}));

const totalWeight = weightedArray.reduce((sum, obj) => sum + obj.weight, 0);


// Function to read JSON file into a list
function readJsonFile(filePath) {
  const data = fs.readFileSync(filePath, 'utf-8'); // Read the file synchronously
  return JSON.parse(data); // Parse the JSON data
}

// Function to select random items with a bias towards higher indexes
function getRandomLinksWeighted(count) {
  const selectedLinks = [];

  for (let i = 0; i < count; i++) {
    const random = Math.random() * totalWeight;
    let cumulativeWeight = 0;

    for (const obj of weightedArray) {
      cumulativeWeight += obj.weight;
      if (random < cumulativeWeight) {
        selectedLinks.push(obj.item);
        break;
      }
    }
  }

  return selectedLinks;
}

app.get('/newsArticles', async (req, res) => { //returns random article links that will be process on the client side
  console.log("HI");

  let articles = getRandomLinksWeighted(20);
  let articleInformation = [];
  let currentArticle;

  for(let i = 0; i < 20; i++) {
    currentArticle = await fetchArticle(articles[i])
    articleInformation.push(currentArticle);
  }
  
  res.json(articleInformation);
});

app.get("/", (req, res) => {
  res.json(1);
});

app.listen(PORT, () => {``
  console.log(`Server is running on port ${PORT}`);
});

