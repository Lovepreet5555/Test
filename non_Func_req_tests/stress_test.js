const { Builder } = require('selenium-webdriver');
require('chromedriver');

async function stressTest(iterations) {
  for (let i = 0; i < iterations; i++) {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
    
      await driver.get('https://www.xenonstack.com/');
      await driver.sleep(1000); 
       
     
      await driver.executeScript("window.scrollBy(0, window.innerHeight);");
      await driver.sleep(500); 

      console.log(`Iteration ${i + 1}: Stress test completed successfully`);

    } catch (err) {
      console.log(`Iteration ${i + 1}: Error encountered - ${err.message}`);
    } finally {
      await driver.quit();
    }
  }
}


const numberOfIterations = 10;
stressTest(numberOfIterations);


