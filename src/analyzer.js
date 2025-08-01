function analyzeHeaders(translatedArticles) {
  const wordCount = {};
  // Combine all translated titles and split into words
  translatedArticles.forEach(article => {
    const words = article.translatedTitle.toLowerCase().match(/\b\w+\b/g);
    if (words) {
      words.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1;
      });
    }
  });
  // Filter for words with count > 2
  const repeatedWords = Object.entries(wordCount).filter(([word, count]) => count > 2);

  return repeatedWords;
}
module.exports = analyzeHeaders;