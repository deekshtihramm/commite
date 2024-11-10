const express = require('express');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const router = express.Router();

// Function to read and scrape data from a local HTML file
async function scrapeLocalFile(filePath) {
  try {
    // Read the HTML file
    const html = fs.readFileSync(filePath, 'utf-8');
    // Load the HTML into Cheerio
    const $ = cheerio.load(html);

    const scrapedData = {
      title: $('title').text(),
      navigationLinks: [],
      uploadCardText: $('#upload-card .p1').text(),
      descriptionTexts: $('div[style*="margin-left: 300px"]').find('pre').map((i, el) => $(el).text()).get(),
    };

    // Extract all navbar button text
    $('nav .nav-item button').each((index, element) => {
      const linkText = $(element).text();
      scrapedData.navigationLinks.push(linkText);
    });

    return scrapedData; // Return scraped data
  } catch (error) {
    console.error('Error reading or scraping file:', error);
    throw error; // Throw the error for handling later
  }
}

// Serve the HTML file directly from this route
router.get('/', (req, res) => {
  const filePath = path.join(__dirname, '..', 'frontend', 'about.html'); // Adjust the path as needed
  res.sendFile(filePath);
});

// Example route for scraping the file
router.get('/scrape', async (req, res) => {
  try {
    const filePath = path.join(__dirname, '..', 'frontend', 'about.html'); // Update this path to your HTML file
    const data = await scrapeLocalFile(filePath);
    res.json(data); // Send the scraped data as JSON response
  } catch (error) {
    res.status(500).send('Error occurred while scraping the file.'); // Handle errors
  }
});

// Export the router
module.exports = router;
