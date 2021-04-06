
const { browserName, basicUrl, platformName } = require('../Config/config.js');
const fs = require('fs');

module.exports = {
    
    initDriver(instance_webdriver,webdriver){

        instance_webdriver = this.getDriver(webdriver);
        this.maximizeWindow(instance_webdriver);
        this.navigateToBasicUrl(instance_webdriver);
        this.sleepOnLoading(instance_webdriver);
        return instance_webdriver;
    },
    getDriver(webdriver) {
        return new webdriver.Builder()
            .withCapabilities({
                browserName: browserName,
                platformName: platformName,
                chromeOptions: {
                    args:[],
                    perfLoggingPrefs: {
                        enableNetwork: true
                    },
                }, 
                'goog:loggingPrefs': {
                    performance: 'ALL',
                    browser: 'ALL'
                },
                w3c: false,
            }).build();
    },
    maximizeWindow(webdriver){
        webdriver.manage().window().maximize();
    },
    navigateToBasicUrl(webdriver) {
        return webdriver.get(basicUrl);
    },
    sleepOnLoading(webdriver) {
        return (webdriver).sleep(30000);
    },
    async getSessionId(instance_webdriver){
        sessionId= await instance_webdriver.getSession();
        return sessionId;
    },
    reuseWebdriver(webdriver, sessionId) {
        instance_webdriver2 = this.getDriver(webdriver);
        instance_webdriver2.session_ = sessionId;
        this.navigateToBasicUrl(instance_webdriver2);
        this.sleepOnLoading(instance_webdriver2);
        return instance_webdriver2;
    },
    async setEnteries(webdriver, getName ,path) {

        let result;
        await webdriver.manage().logs().get(getName).then((varr) => {
            let data;
            // let perfData=[];//nested data message -problem 
            // getName === 'browser'? (data = JSON.stringify(varr,null,4),result = this.saveData(data, path)):
            // ( varr.forEach((varr) => {
            //     perfData.push(JSON.stringify(JSON.parse(varr.message).message,null,4));
            // }))
            // result = this.saveData(JSON.stringify(perfData,null,4), path);
            getName === 'browser'? data=this.formatConsoleData(varr) : data=this.formatPerformanceData(varr)
            result = this.saveData(data, path);
        });
        return result;
    },
    formatConsoleData(varr) {
        let data = "[";

        varr && varr.length && varr.forEach((element) => {
            let m = JSON.stringify(element) + ",";
            data += m;
        })

        data = data.substring(0, data.length - 1);
        data += "]"
        return data;
    },
    formatPerformanceData(browserLogs) {
        let data = "[";
        browserLogs.forEach((browserLog) => {
            let m = JSON.stringify(JSON.parse(browserLog.message).message) + ",";
            data += m;
        });

        data = data.substring(0, data.length - 1);
        data += "]";
        return data;
    },
    saveData(data, path) {
        if (data != ']')
            fs.writeFileSync(path + Date.now() + ".json", data, function (err) {
                if (err) return console.log(err);
            });
        return true;
    },
    driverQuit(webdriver) {
        return webdriver.quit();
    }
}