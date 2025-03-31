const { Builder, By, Key, until } = require('selenium-webdriver');
require('chromedriver');

(async function validInputTest() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {

    await driver.get('https://www.xenonstack.com/');
    await driver.findElement(By.xpath("//span[normalize-space()='Get Started']")).click();
    await driver.sleep(1000);
    await driver.findElement(By.xpath("//input[@id='Firstname']")).sendKeys('Varun');
    await driver.findElement(By.xpath("//input[@id='Lastname']")).sendKeys('Verma');
    await driver.findElement(By.xpath("//input[@id='emailid']")).sendKeys('varunverma823@gmail.com');
    let contactNumber = await driver.findElement(By.xpath("//input[@id='contactnumber']"));
    await contactNumber.click();
    await contactNumber.sendKeys('1234567890');
    await driver.findElement(By.xpath("//input[@id='companyname']")).sendKeys('xenon');
    await driver.findElement(By.xpath("//select[@id='enterpriseIndustry']")).sendKeys('Software Development');
    await driver.findElement(By.xpath("//p[normalize-space()='Proceed Next']")).click();
    let stepTwo = await driver.findElement(By.xpath("//div[@id='form-step-two']"));
    await stepTwo.click();

    await driver.findElement(By.xpath("//p[normalize-space()='Akira AI - Agentic AI Platform Multi Agent System']")).click();
    await driver.findElement(By.xpath("//p[normalize-space()='Startup']")).click();
    await driver.findElement(By.xpath("//p[normalize-space()='Data and Analytics']")).click();
    await driver.findElement(By.xpath("//p[normalize-space()='POC Completed']")).click();
    await driver.findElement(By.xpath("//p[normalize-space()='Aligning AI with business goals']")).click();
    await driver.findElement(By.xpath("//p[normalize-space()='AWS']")).click();
    await driver.findElement(By.xpath("//p[normalize-space()='SnowFlake']")).click();
    await driver.findElement(By.xpath("//p[normalize-space()='Assisted Intelligence Agents as Co-Pilot']")).click();
    await driver.findElement(By.xpath("//p[normalize-space()='Internal Organization']")).click();

    await driver.executeScript("arguments[0].scrollIntoView(true);", driver.findElement(By.xpath("//p[contains(text(),'Internal Organization')]")));
    await driver.findElement(By.xpath("//p[normalize-space()='Submit']")).click();
    console.log("Valid input test completed successfully");

  } finally {
    await driver.quit();
  }
})();

