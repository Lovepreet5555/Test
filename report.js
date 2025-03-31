require('events').setMaxListeners(20); // Increase max listeners to avoid warnings
const Mocha = require('mocha');
const path = require('path');
const fs = require('fs');

// Clean the mochawesome-report directory
const reportDir = path.join(__dirname, 'mochawesome-report');
if (fs.existsSync(reportDir)) {
  fs.rmSync(reportDir, { recursive: true, force: true });
  console.log('Cleaned mochawesome-report directory.');
}

// Create a new Mocha instance with the mochawesome reporter
const mocha = new Mocha({
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'mochawesome-report', // Directory for the report
    reportFilename: 'mochawesome',  // Report file name
    quiet: false,                   // Show output in the console
    overwrite: true,                // Overwrite existing reports
    html: true,                     // Generate an HTML report
    json: true                      // Generate a JSON report
  }
});

// Directories containing test files
const testDirectories = [
  './func_req_tests', 
  './func_req_tests/formTests', // Functional requirement tests
  './non_Func_req_tests'        // Non-functional requirement tests
];

// Add all test files from the specified directories
testDirectories.forEach((dir) => {
  if (fs.existsSync(dir)) {
    console.log(`Scanning directory: ${dir}`);
    fs.readdirSync(dir).forEach((file) => {
      if (file.endsWith('_test.js')) {
        const filePath = path.join(dir, file);
        console.log(`Adding test file: ${filePath}`); // Log the test file being added

        // Wrap standalone scripts in a Mocha-compatible structure
        const wrappedTest = `
          const path = require('path');
          const testFile = path.resolve('${filePath}');
          describe('${file}', function () {
            it('should execute the script without errors', async function () {
              require(testFile);
            });
          });
        `;

        // Write the wrapped test to a temporary file
        const tempTestFile = path.join(__dirname, 'temp', `${path.basename(file, '.js')}_wrapped_test.js`);
        fs.mkdirSync(path.dirname(tempTestFile), { recursive: true });
        fs.writeFileSync(tempTestFile, wrappedTest);

        // Add the temporary file to Mocha
        mocha.addFile(tempTestFile);
      }
    });
  } else {
    console.warn(`Directory not found: ${dir}`);
  }
});

// Run the tests
mocha.run((failures) => {
  console.log(`Total tests executed: ${mocha.suite.total()}`); // Log total tests executed
  if (failures) {
    console.error(`${failures} test(s) failed.`);
  } else {
    console.log('All tests passed successfully.');
  }
  process.exitCode = failures ? 1 : 0; // Exit with non-zero code if there are failures
});