const { Builder, By, Key, until } = require('selenium-webdriver');
require('chromedriver');

(async function testXenonstackLogo() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {

    await driver.get('https://www.xenonstack.com/');
    
 
    await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);");
    await driver.sleep(1000); 


    const logo = await driver.findElement(By.xpath("//li[@class='nav-li logo-li']//a"));
    await driver.executeScript("arguments[0].click();", logo);
    await driver.sleep(1000); 


    const scrollPosition = await driver.executeScript("return window.pageYOffset;");
    if (scrollPosition === 0) {
      console.log('Test passed: The logo click scrolled the page to the top.');
    } else {
      console.log('Test failed: The logo click did not scroll the page to the top.');
    }
  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    await driver.quit();
  }
})();
