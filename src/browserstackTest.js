const { Builder, By } = require('selenium-webdriver');
require('chromedriver');
require('dotenv').config();
const assert = require('assert');

const capabilities = [
  {
    os: 'Windows',
    osVersion: '10',
    browserName: 'Chrome',
    browserVersion: 'latest',
  },
  {
    os: 'OS X',
    osVersion: 'Ventura',
    browserName: 'Safari',
    browserVersion: '16.0',
  },
  {
    os: 'Windows',
    osVersion: '11',
    browserName: 'Edge',
    browserVersion: 'latest',
  },
  {
    device: 'Samsung Galaxy S22',
    osVersion: '12.0',
    realMobile: true,
    browserName: 'Chrome'
  },
  {
    device: 'iPhone 14',
    osVersion: '16',
    realMobile: true,
    browserName: 'Safari'
  }
];

async function runTest(caps, index) {
  const capabilitiesConfig = {
    browserName: caps.browserName,
    'bstack:options': {
      os: caps.os,
      osVersion: caps.osVersion,
      deviceName: caps.device,
      realMobile: caps.realMobile,
      local: false,
      seleniumVersion: '4.0.0',
      buildName: 'ElPais Parallel Test',
      sessionName: `ParallelTest-${index + 1}`,
    },
  };

  if (caps.browserVersion) capabilitiesConfig.browserVersion = caps.browserVersion;

  const driver = await new Builder()
    .usingServer(`https://${process.env.BROWSERSTACK_USERNAME}:${process.env.BROWSERSTACK_ACCESS_KEY}@hub-cloud.browserstack.com/wd/hub`)
    .withCapabilities(capabilitiesConfig)
    .build();

  try {
    await driver.get('https://elpais.com');
    const title = await driver.getTitle();
    assert.ok(title.includes('EL PAÍS') || title.includes('El País'));
    await driver.executeScript('browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Title is valid"}}');
  } catch (e) {
    await driver.executeScript(`browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "${e.message}"}}`);
    throw e;
  } finally {
    await driver.quit();
  }
}

(async () => {
  await Promise.all(capabilities.map((caps, i) => runTest(caps, i)));
})();