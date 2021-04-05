require('mocha');
require('chai');
const webdriver = require('selenium-webdriver');
const browser = require('../src/MainPage/mainPage.js');
const { runCycle, pathToConsoleLog, pathToPerformanceLog } = require('../src/Config/config.js');
const { assert } = require('chai');

//command to run tests without report:npm test
//command in terminal to produce report : npm run test:awesome
//open report in file mochawesome.html with Live Server

describe('get console and performance logs', function () {

    this.timeout(0);//or 130000
    let instance_webdriver;
    let instance_reuse_webdriver;
    let sessionId;
    let quit = false;

    before(async() => {
        instance_webdriver = browser.initDriver(instance_webdriver,webdriver);
        sessionId= await browser.getSessionId(instance_webdriver);
    })
    after(() => {
        quit && browser.driverQuit(instance_webdriver);
    })

    it('should be creating console log files', async () => {

        let result;
        let counter =0;
        
        for (let i = 0; i < runCycle; i++)//varaiable runCycle defines amount of cycles, default set to 1.
        {
            if (i > 0) {
                instance_reuse_webdriver = browser.reuseWebdriver( webdriver, sessionId);
                resultConsole= await browser.setEnteries(instance_reuse_webdriver, 'browser',pathToConsoleLog);
                resultPerformance = await browser.setEnteries(instance_reuse_webdriver,'performance',pathToPerformanceLog);
            }
            else{
                resultConsole = await browser.setEnteries(instance_webdriver,'browser', pathToConsoleLog); 
                resultPerformance = await browser.setEnteries(instance_webdriver,'performance', pathToPerformanceLog); 
            } 
            resultConsole||resultPerformance ? counter += 1 : "";
        }
        assert.equal(counter,runCycle,"not all console log files were created");
    });

});
