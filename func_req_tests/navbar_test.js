const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

(async function navbarTest() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.get('https://www.xenonstack.com/');

    async function clickAndCheckRedirection(xpath, linkName) {
      const oldUrl = await driver.getCurrentUrl();
      await driver.findElement(By.xpath(xpath)).click();
      await driver.sleep(1000);
      const newUrl = await driver.getCurrentUrl();
      if (newUrl !== oldUrl) {
        console.log(`Clicked on '${linkName}' and redirected to a new page.`);
      } else {
        console.log(`Clicked on '${linkName}' but not redirected to a new page.`);
      }
    }

    await clickAndCheckRedirection("//p[normalize-space()='Foundry']", "Foundry");
    await clickAndCheckRedirection("//p[normalize-space()='Neural AI']", "Neural AI");
    await clickAndCheckRedirection("//p[contains(text(),'NexaStack')]", "NexaStack");
    await clickAndCheckRedirection("//p[contains(text(),'ElixirData')]", "ElixirData");
    await clickAndCheckRedirection("//p[contains(text(),'MetaSecure')]", "MetaSecure");
    await clickAndCheckRedirection("//li[@class='nav-li item']//p[contains(text(),'Akira AI')]", "Akira AI");
    await clickAndCheckRedirection("//p[normalize-space()='XAI']", "XAI");

    console.log("Test case completed successfully");

  } finally {
    await driver.quit();
  }
})();

