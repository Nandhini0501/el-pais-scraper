const scrapeArticles = require('./src/scraper');
const translateTitles = require('./src/translator');
const analyzeHeaders = require('./src/analyzer');
const { exec } = require('child_process');

(async () => {
  const articles = await scrapeArticles(); //1.Scrape Articles from the Opinion Section:
  console.log('\n * Articles in Spanish:');
  articles.forEach((a, i) => console.log(`${i + 1}. ${a.title}\n`));

//2.translating titles
  const translations = await translateTitles(articles);

 //3.Repeated words
  const repeated = analyzeHeaders(translations);
  console.log('\n * Repeated Words:');
  repeated.forEach(([word, count]) => console.log(`${word}: ${count}`));

  //4.Cross_browser testing
  exec('node src/browserstackTest.js', (error, stdout, stderr) => {
    if (error) {
      console.error(` Error running BrowserStack test: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(` Stderr: ${stderr}`);
      return;
    }
    console.log(` * BrowserStack Output:\n${stdout}`);
  });

})();