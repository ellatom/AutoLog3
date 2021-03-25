
import {browserName,basicUrl} from '../Config/config.js';

export default {

    getDriver(webdriver){
        return  new webdriver.Builder()
            .withCapabilities({
            browserName: browserName,
            chromeOptions:{
                perfLoggingPrefs:{
                    enableNetwork:true
                }
            },loggingPrefs:{
                performance: 'ALL',
                browser:'ALL'
            }}).build();
    },
    navigateToBasicUrl(webdriver){
        return webdriver.get(basicUrl);
    },
    sleepOnLoading(webdriver){
        return ( webdriver).sleep(30000);
    },
    driverQuit(webdriver){
        return  webdriver.quit();
    }
}


