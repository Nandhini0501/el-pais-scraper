const axios = require('axios');
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function translateTitles(articles) {
  for (const article of articles) {
    try {
      // console.log(`Translating: "${article.title}"`);

      const response = await axios.get('https://api.mymemory.translated.net/get', {
        params: {
          q: article.title,
          langpair: 'es|en'
        }
      });

      article.translatedTitle = response.data.responseData.translatedText || 'Translation failed';
      await sleep(1000); 

    } catch (error) {
      console.error(` Error translating title: ${error.message}`);
      article.translatedTitle = 'Translation failed';
    }
  }

  console.log(`\n* Translated Titles:`);
  articles.forEach((article, index) => {
    console.log(`${index + 1}. ${article.translatedTitle}`);
  });

  return articles;
}
module.exports = translateTitles;