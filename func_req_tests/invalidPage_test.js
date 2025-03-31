const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

async function invalidPageTest() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.get('https://www.xenonstack.com/invalid-page');
    await driver.sleep(1000);

    let errorMessage;
    try {
      errorMessage = await driver.findElement(By.tagName('h1')).getText();
    } catch (err) {
     
      errorMessage = await driver.findElement(By.tagName('body')).getText();
    }


    if (errorMessage.includes('404') || errorMessage.includes('Page Not Found') || errorMessage.includes('error')) {
      console.log('Invalid page handling test passed: Correct error message displayed');
    } else {
      console.log('Invalid page handling test failed: Unexpected message displayed');
    }

  } catch (err) {
    console.log(`Error encountered: ${err.message}`);
  } finally {
    await driver.quit();
  }
}

invalidPageTest();
