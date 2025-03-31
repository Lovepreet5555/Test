const { Builder, By, Key, until } = require('selenium-webdriver');
require('chromedriver');

(async function responseTimeTest() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
 
    await driver.get('https://www.xenonstack.com/');

    
    let getStartedButton = await driver.findElement(By.xpath("//span[normalize-space()='Get Started']"));
    
    let startTime = new Date().getTime();
    await getStartedButton.click();
    await driver.wait(until.urlContains('https://www.xenonstack.com/'), 10000); 
    let endTime = new Date().getTime();
    
    let responseTime = endTime - startTime;
    console.log(`Button Click Response Time: ${responseTime} ms`);
    
  
    startTime = new Date().getTime();
    await getStartedButton.click();
    await driver.wait(until.urlContains('https://www.xenonstack.com/'), 10000); 
    endTime = new Date().getTime();
    
    responseTime = endTime - startTime;
    console.log(`Second Button Click Response Time: ${responseTime} ms`);

  } finally {
    await driver.quit();
  }
})();

