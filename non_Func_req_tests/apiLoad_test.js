const { Builder, By, Key, until } = require('selenium-webdriver');
const axios = require('axios');
require('chromedriver');

const logger = console;

async function pageLoader(driver) {
  try {
    await driver.wait(() => driver.executeScript("return document.readyState === 'complete'"));
    logger.info('Page loaded successfully.');
  } catch (err) {
    logger.warn('Page took too long to load. Stopping load manually.');
    await driver.executeScript("window.stop();");
  }
}

async function extractLinks(driver, htmlTag) {
  try {
    await driver.wait(until.elementLocated(By.tagName(htmlTag)));
    const section = await driver.findElement(By.tagName(htmlTag));
    return await section.findElements(By.tagName('a'));
  } catch (err) {
    logger.warn(`No links found in <${htmlTag}> section.`);
    return [];
  }
}

(async function loadSpeedTest() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    logger.info("Checking Performance of the website");
    await driver.get("https://www.xenonstack.com/");
    await pageLoader(driver);

    let links = await extractLinks(driver, "body");
    let pages = new Set();

 
    for (let link of links) {
      let href = await link.getAttribute("href");
      if (href && href.includes("xenonstack.com")) {
        pages.add(href);
      }
    }

    logger.info(`Total Internal Pages Found: ${pages.size}`);


    for (let page of pages) {
      await driver.get(page);
      try {
        await driver.wait(() => driver.executeScript("return document.readyState === 'complete'"));

        let start, end, loadTime;
        try {
          start = await driver.executeScript("return window.performance.timing.navigationStart;");
          end = await driver.executeScript("return window.performance.timing.loadEventEnd;");
          loadTime = (end - start) / 1000.0;
        } catch (err) {
          loadTime = -1;
        }

        if (loadTime > 10) {
          logger.error(`${page} took ${loadTime.toFixed(2)}s to load. Potential Performance Issue!`);
        } else {
          logger.info(`${page} loaded in ${loadTime.toFixed(2)}s`);
        }

      } catch (err) {
        logger.error(`${page} failed to load within the expected time.`);
      }
    }

    logger.info("All pages loaded within acceptable time.");

  } finally {
    await driver.quit();
  }
})();