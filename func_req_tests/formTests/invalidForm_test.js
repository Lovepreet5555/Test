const { Builder, By, until } = require('selenium-webdriver');
require('chromedriver');

(async function invalidInputTest() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
  
    await driver.get('https://www.xenonstack.com/');
    await driver.findElement(By.xpath("//div[@class='nav-button']//a")).click();
    await driver.sleep(1000);
    await driver.findElement(By.xpath("//input[@id='Firstname']")).sendKeys('#2456sd');
    await driver.findElement(By.xpath("//input[@id='Lastname']")).sendKeys('@9u7t');
    await driver.findElement(By.xpath("//div[@class='form-field-outer-wrapper']//div[1]")).click();
    await driver.findElement(By.xpath("//input[@id='emailid']")).sendKeys('Varybv098');
    await driver.findElement(By.xpath("//div[@class='form-field-outer-wrapper']//div[1]")).click();
    await driver.findElement(By.xpath("//input[@id='contactnumber']")).sendKeys('12343');
    await driver.findElement(By.xpath("//div[@class='form-field-outer-wrapper']//div[1]")).click();
    await driver.findElement(By.xpath("//input[@id='companyname']")).sendKeys('23e');
    await driver.findElement(By.xpath("//select[@id='enterpriseIndustry']")).sendKeys('Financial Services');
    await driver.findElement(By.xpath("//div[@id='form-step-one']//div[@class='next-step-button-wrapper']")).click();
    await driver.sleep(1000);
    let validationPassed = true;

    try {
      let firstNameValidation = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Please enter a valid First Name')]")), 5000);
      console.log('Invalid input test for first name validation passed.');
    } catch (err) {
      validationPassed = false;
      console.log('Invalid input test for first name validation failed.');
    }

    try {
      let lastNameValidation = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Please enter a valid Last Name')]")), 5000);
      console.log('Invalid input test for last name validation passed.');
    } catch (err) {
      validationPassed = false;
      console.log('Invalid input test for last name validation failed.');
    }

    try {
      let emailValidation = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Please enter a valid Business Email ID')]")), 5000);
      console.log('Invalid input test for email validation passed.');
    } catch (err) {
      validationPassed = false;
      console.log('Invalid input test for email validation failed.');
    }

    try {
      let contactNumberValidation = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Please enter a valid Contact Number')]")), 5000);
      console.log('Invalid input test for contact number validation passed.');
    } catch (err) {
      validationPassed = false;
      console.log('Invalid input test for contact number validation failed.');
    }

    try {
      let companyNameValidation = await driver.wait(until.elementLocated(By.xpath("//*[contains(text(),'Please enter a valid Company Name')]")), 5000);
      console.log('Invalid input test for company name validation passed.');
    } catch (err) {
      validationPassed = false;
      console.log('Invalid input test for company name validation failed.');
    }
    if (validationPassed) {
      console.log('Invalid input test validation passed.');
    } else {
      console.log('Invalid input test validation failed.');
    }

  } finally {
    await driver.quit();
  }
})();
