const { Builder, By, Key, until } = require('selenium-webdriver');
require('chromedriver');

(async function loadTimeTest() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    let startTime = new Date().getTime();
    await driver.get('https://www.xenonstack.com/');
    let endTime = new Date().getTime();
    let loadTime = endTime - startTime;

    console.log(`Page Load Time: ${loadTime} ms`);
    console.log("Test case Passed successfuly")

  } finally {
    await driver.quit();
  }
})();
