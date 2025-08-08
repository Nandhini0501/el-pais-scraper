const { Builder, By, until } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

async function scrapeArticles() {
  const driver = await new Builder().forBrowser('chrome').build();
  const results = [];

  try {
    // Navigate to the website
    await driver.get('https://elpais.com');
    await driver.wait(until.elementLocated(By.css('body')), 10000);

    // Accept cookies if prompted
    try {
      const agreeButton = await driver.wait(
        until.elementLocated(By.id('didomi-notice-agree-button')),
        5000
      );
      await agreeButton.click();
      console.log('Accepted the Didomi notice.');
    } catch (e) {
      console.log('ℹ️ No popup found or already accepted');
    }

    // Navigate to the Opinion section
    await driver.wait(until.elementLocated(By.linkText('Opinión')), 10000);
    const opinionLink = await driver.findElement(By.linkText('Opinión'));
    await opinionLink.click();
    await driver.wait(until.elementsLocated(By.css('article')), 10000);
    const articleLinks = [];

    // Extract the hrefs of the first five articles
    const articles = await driver.findElements(By.css('article a[href*="/opinion/"]'));
    for (let i = 0; i < articles.length && articleLinks.length < 5; i++) {
      const href = await articles[i].getAttribute('href');
      if (href && !articleLinks.includes(href)) {
        articleLinks.push(href);
      }
    }

    // Ensure the images directory exists
    const imagesDir = path.join(__dirname, '../images');
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    // Visit each article and scrape data
    for (let i = 0; i < articleLinks.length; i++) {
      const link = articleLinks[i];
      try {
        await driver.get(link);
        await driver.wait(until.elementLocated(By.css('h1')), 10000);
        const title = await driver.findElement(By.css('h2','h1')).getText();
        const content = await driver.findElement(By.css('p')).getText();

        let imageUrl = '';
        try {
          const image = await driver.wait(
            until.elementLocated(By.css('img.c_m_e')), 
            10000
          );
          imageUrl = await image.getAttribute('src');
          console.log(`Image URL for article ${i + 1}: ${imageUrl}`);
          if (imageUrl.startsWith('/')) {
            imageUrl = `https://elpais.com${imageUrl}`;
          }
          const imageRes = await axios.get(imageUrl, { responseType: 'arraybuffer' });
          const imagePath = path.join(imagesDir, `article_${i + 1}.jpg`);
          fs.writeFileSync(imagePath, imageRes.data);
          console.log(`✅ Image saved for article ${i + 1}`);
        } catch {
          console.log(` No image found for article ${i + 1}`);
        }

        console.log(`\nArticle ${i + 1}:\nTitle: ${title}\nContent: ${content}\n`);
        results.push({ title, content, imageUrl });
      } catch (e) {
        console.log(`Error scraping article ${i + 1}: ${e.message}`);
      }
    }
    return results;
  } finally {
    await driver.quit();
  }
}
module.exports = scrapeArticles;