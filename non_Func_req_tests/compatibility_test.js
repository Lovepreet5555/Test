const { Builder, By } = require('selenium-webdriver');
require('chromedriver');

async function compatibilityTest(device) {
  let driver;
  
  const devices = {
    desktop: { width: 1920, height: 1080 },
    tablet: { width: 768, height: 1024 },
    mobile: { width: 375, height: 667 }
  };

  try {
    driver = await new Builder().forBrowser('chrome').build();
    

    await driver.manage().window().setRect(devices[device]);
    

    await driver.get('https://www.xenonstack.com/');
    console.log(`${device}: Website loaded successfully at ${devices[device].width}x${devices[device].height} resolution`);

    
    await driver.executeScript("window.scrollBy(0, 1000);");
    console.log(`${device}: Scrolled down the webpage successfully`);
    
  } catch (err) {
    console.log(`${device}: Error encountered - ${err.message}`);
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}


async function runTests() {
  const devices = ['desktop', 'tablet', 'mobile'];

  for (const device of devices) {
    await compatibilityTest(device);
  }

  console.log('Compatibility testing for different devices completed.');
}

runTests();