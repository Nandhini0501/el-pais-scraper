# El País Opinión Scraper & Translator

##  What This Script Does

1. Navigates to the **Opinión** section of [elpais.com](https://elpais.com/opinion/)
2. Extracts the **first 5 article titles and content**
3. Downloads each **cover image** (if available)
4. Translates all **titles into English** using the `@vitalets/google-translate-api`
5. Analyzes the **translated headers** for repeated words (appearing more than twice)
6. Runs **cross-browser testing** using **BrowserStack** on 5 parallel threads

##  Run the Project

