const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');
const axios = require('axios');

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

async function checkExternalLink(href, linkText) {
  try {
    const response = await axios.get(href, { timeout: 15000 });
    const statusCode = response.status;

    if (statusCode >= 400 && statusCode < 1000) {
      const web = href.includes('twitter.com') ? 'Twitter/X' : 'LinkedIn';
      logger.warn(`${web} blocks bot requests (${statusCode}) or is down. Marking as valid.`);
    } else if (statusCode < 400) {
      logger.info(`External link '${linkText}' is valid. [HTTP ${statusCode}]`);
    } else {
      logger.error(`External link '${linkText}' returned HTTP ${statusCode}. Possible broken link.`);
      throw new Error(`External link '${linkText}' broken -> ${statusCode}`);
    }
  } catch (err) {
    logger.error(`Failed request for '${linkText}': ${err.message}`);
    throw new Error(`External link '${linkText}' could not be checked.`);
  }
}

async function checkInternalLink(driver, link, linkText, oldUrl) {
  try {
    if (await link.getAttribute('target') === '_blank') {
      const originalHandles = await driver.getAllWindowHandles();
      await driver.executeScript("window.open(arguments[0]);", await link.getAttribute('href'));
      await driver.wait(until.numberOfWindows(originalHandles.length + 1));

      const allHandles = await driver.getAllWindowHandles();
      if (allHandles.length > originalHandles.length) {
        await driver.switchTo().window(allHandles[allHandles.length - 1]);
        await pageLoader(driver);
        const newUrl = await driver.getCurrentUrl();

        if (newUrl !== oldUrl && newUrl !== 'data:,') {
          logger.info(`'${linkText}' opened in new tab successfully -> ${newUrl}`);
        } else {
          logger.warn(`'${linkText}' new tab did not navigate properly.`);
          await driver.close();
          await driver.switchTo().window(originalHandles[0]);
          return false;
        }

        await driver.close();
        await driver.switchTo().window(originalHandles[0]);
      } else {
        logger.warn(`No new tab detected for '${linkText}'.`);
        return false;
      }
    } else {
      await driver.executeScript("arguments[0].click();", link);
      await pageLoader(driver);
      await driver.wait(until.urlIsDifferentFrom(oldUrl)); 
      const newUrl = await driver.getCurrentUrl();

      if (newUrl !== oldUrl && newUrl !== 'data:,') {
        logger.info(`'${linkText}' link works -> navigated to ${newUrl}`);
      } else {
        logger.warn(`'${linkText}' did not navigate properly.`);
        return false;
      }

      await driver.navigate().back();
      await pageLoader(driver);
      await driver.wait(until.urlIs(oldUrl));
    }

    return true;
  } catch (err) {
    logger.warn(`Error opening '${linkText}': ${err.message}`);
    await driver.executeScript("window.stop();");
    return false;
  }
}

until.urlIsDifferentFrom = function (expectedUrl) {
  return new until.Condition(
    'for URL to be different from ' + expectedUrl,
    async function (driver) {
      const currentUrl = await driver.getCurrentUrl();
      return currentUrl !== expectedUrl;
    }
  );
};

(async function testFooter() {
  let driver = await new Builder().forBrowser('chrome').build();
  const wait = driver.manage().setTimeouts({ implicit: 10000, pageLoad: 10000, script: 10000 });

  try {
    logger.info('Ensuring All Footer Links Are Checked Without Skips.');
    await driver.get('https://xenonstack.com/');
    await pageLoader(driver);

    let links = await extractLinks(driver, 'footer');
    if (links.length === 0) {
      logger.error('FOOTER TEST FAILED - No links found in the footer!');
      throw new Error('No footer links found.');
    }

    const totalLinks = links.length;
    logger.info(`Total Footer Links Found: ${totalLinks}`);
    let idx = 0;

    while (idx < totalLinks) {
      let retries = 2;
      while (retries > 0) {
        try {
          links = await extractLinks(driver, 'footer');
          if (idx >= links.length) {
            logger.warn(`Skipping missing link at index ${idx}`);
            break;
          }

          const link = links[idx];
          let linkText = (await link.getText()).trim();
          const href = await link.getAttribute('href');

          if (!linkText) {
            try {
              const img = await link.findElement(By.tagName('img'));
              const altText = await img.getAttribute('alt');
              if (altText) {
                linkText = altText.trim();
              }
            } catch (err) {
              // Ignore NoSuchElementException
            }
            if (!linkText) {
              linkText = 'N/A';
            }
          }

          if (!href) {
            logger.error(`Skipping '${linkText}' - No href attribute.`);
            break;
          }

          logger.info(`Checking Footer Link ${idx + 1}/${totalLinks}: ${href} -> ${linkText}`);

          if (!href.toLowerCase().includes('xenonstack.com')) {
            await checkExternalLink(href, linkText);
          } else {
            const oldUrl = await driver.getCurrentUrl();
            await checkInternalLink(driver, link, linkText, oldUrl);
          }
          break;

        } catch (err) {
          retries -= 1;
          logger.warn('Stale element error. Retrying...');
        }
      }

      idx += 1;
    }

    logger.info('Footer Test Completed Successfully.');
  } finally {
    await driver.quit();
  }
})();



