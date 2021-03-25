import 'mocha';
import webdriver from 'selenium-webdriver';
import browser from '../src/MainPage/mainPage.js';
import { runCycle } from '../src/Config/config.js';
import fs from 'fs';

//command to run tests without report:npm test
//command in terminal to produce report : npm run test:awesome
//open report in file mochawesome.html with Live Server

describe('get console and performance logs', function(){

    this.timeout(4000);
    let instance_webdriver;

    before(() => {
        instance_webdriver = browser.getDriver(webdriver);
        browser.navigateToBasicUrl(instance_webdriver);
        browser.sleepOnLoading(instance_webdriver);
    })
    after(() => {
        browser.driverQuit(instance_webdriver);
    })

    it('should be getting console log', (done) => {

        for (let i = 0; i < runCycle; i++)//varaiable runCycle defines amount of cycles, default set to 1.
        {

            const consoleEnteries = instance_webdriver.manage().logs().get('browser').then((varr) => {
                let data = "[";

                varr && varr.length && varr.forEach(async (element) => {
                    let m = JSON.stringify(element) + ",";
                    data += m;
                })
                data = data.substring(0, data.length - 1);
                data += "]"

                fs.writeFileSync('./test/Logs/Consolelog/' + Date.now() + ".json", data, function (err) {
                    if (err) return console.log(err);
                });
            }).catch(done);
        }

        done();
        });


    it('should be getting performance logs', async (done) => {

        for (let i = 0; i < runCycle; i++)//it will run only if in config defined. reducing first cycle
        {
            const testNetworkLogs = instance_webdriver.manage().logs().get('performance').then((browserLogs) => {
                let data = "[";
                browserLogs.forEach(async (browserLog) => {
                    let m = JSON.stringify(JSON.parse(browserLog.message).message) + ",";
                    data += m;
                });

                data = data.substring(0, data.length - 1);
                data += "]"

                fs.writeFileSync('./test/Logs/Performancelog/' + Date.now() + '.json', data, function (err) {
                    if (err) return console.log(err);
                });

            }).catch(done);
        }

        done();
        });
}); 
