require('mocha');
const webdriver = require('selenium-webdriver');
const browser = require('../src/MainPage/mainPage.js');
const { basicUrl, runCycle, pathToConsoleLog, pathToPerformanceLog } = require('../src/Config/config.js');
const fs = require('fs');
const _http = require('selenium-webdriver/http');
const { doesNotMatch } = require('assert');

//command to run tests without report:npm test
//command in terminal to produce report : npm run test:awesome
//open report in file mochawesome.html with Live Server

describe('get console and performance logs', function () {

    this.timeout(0);//130000
    let instance_webdriver;
    let instance_reuse_webdriver;
    let sessionId;
    let quit = false;

    before(async() => {
        instance_webdriver = browser.getDriver(webdriver);
        browser.navigateToBasicUrl(instance_webdriver);
        browser.sleepOnLoading(instance_webdriver);
        sessionId= await instance_webdriver.getSession();

    })
    after(() => {
        // quit && browser.driverQuit(instance_webdriver);
    })

    it('should be creating console log files', async () => {

        for (let i = 0; i < runCycle; i++)//varaiable runCycle defines amount of cycles, default set to 1.
        {
            console.log("My i is:" + i);

            if (i > 0) {
                instance_reuse_webdriver = browser.reuseWebdriver(browser, webdriver, sessionId);
                await browser.setConsoleEnteries(instance_reuse_webdriver, pathToConsoleLog);
            }
            else
                await browser.setConsoleEnteries(instance_webdriver, pathToConsoleLog);    
        }
    });

    it('should be creating performance logs files', async () => {

        for (let i = 0; i < runCycle; i++)//varaiable runCycle defines amount of cycles, default set to 1.
        {
            console.log("My i is:" + i);

            if (i > 0) {
                instance_reuse_webdriver = browser.reuseWebdriver(browser, webdriver, sessionId);
                await browser.setPerformanceEnteries(instance_reuse_webdriver, pathToPerformanceLog);
            }
            else
                await browser.setPerformanceEnteries(instance_webdriver, pathToPerformanceLog);
        }
        quit = true;

    });
});
