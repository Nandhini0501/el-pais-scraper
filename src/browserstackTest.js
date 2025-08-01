const { Builder } = require('selenium-webdriver');
require('dotenv').config();

const capabilities = [
  { os: 'Windows', os_version: '10', browserName: 'Chrome', browser_version: 'latest' },
  { os: 'OS X', os_version: 'Monterey', browserName: 'Safari', browser_version: 'latest' },
  { os: 'Windows', os_version: '11', browserName: 'Edge', browser_version: 'latest' },
  { device: 'Samsung Galaxy S22', realMobile: true, os_version: '12.0', browserName: 'Chrome' },
  { device: 'iPhone 14', realMobile: true, os_version: '16', browserName: 'Safari' },
];

async function runParallelTests() {
  await Promise.all(capabilities.map(async (cap, index) => {
    const driver = new Builder()
      .usingServer(`http://${process.env.BROWSERSTACK_USERNAME}:${process.env.BROWSERSTACK_ACCESS_KEY}@hub-cloud.browserstack.com/wd/hub`)
      .withCapabilities({
        ...cap,
        name: `CrossBrowserTest-${index + 1}`,
        build: 'browserstack-assignment',
        project: 'CE Assignment',
      }).build();

    try {
      await driver.get('https://elpais.com');
      console.log(`Test ${index + 1} executed successfully`);
    } finally {
      await driver.quit();
    }
  }));
}

runParallelTests();