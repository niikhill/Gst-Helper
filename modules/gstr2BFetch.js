const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const gst_url = "https://gst.gov.in";
const resultFolderName = "Results";
const terminalImage = require('terminal-image');
const inquirer = require('inquirer');

/**
 *  fin_year    => Financial year, fetched from prompt in main.js during runtime.
 *  month       => Month, fetched from prompt in main.js during runtime.
 *  base_dir    => Base directory where main.js is located.  
 *  functionObj => Contains all helper functions
 **/

async function gstr2B(username, password, fin_year, month, base_dir, functionObj) {
    try {

        // * puppeteer being initialized
        let browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized"]
        });

        // * Create Result Directory 
        functionObj.createResultDir(base_dir);

        // * Handling tabs in puppeteer
        let pageArr = await browser.pages();
        let page = pageArr[0];
        await page.goto(gst_url);

        // * Clicking Login Page Button
        await page.click(".list-inline.mlinks a[target='_self']")

        // * Waiting For username feild selector
        await page.waitForSelector("input[id='username']", {
            visible: true
        });

        // * Entering username which is received from user in username field
        await page.type("input[id='username']", username, {
            delay: 100
        });

        // * Entering Password which is received from user in password field
        await page.type("input[id='user_pass']", password, {
            delay: 100
        });

        /*
         * Waiting For captcha Selector to show up because it shows up when something is entered
         * in username or password field.
         */
        await page.waitForSelector("input[id='captcha']", {
            visible: true
        });

        // * =====================Handling Captcha For Headless Operation=============
        // * ======================================================================================
        let captcha = await page.$('#imgCaptcha');
        let captcha_path = path.join(base_dir, "utils\\captchas\\")
        console.log(captcha_path);

        // *Taking a screenshot of captcha and saving it in captcha dir
        await captcha.screenshot({
            path: captcha_path + "captcha.png"
        });

        // * Displaying captcha on terminal and waiting for user to enter it
        console.log(await terminalImage.file(captcha_path + "captcha.png", {
            width: 70
        }));
        await page.waitForSelector("#captcha", {
            visible: true
        });
        console.log("Please Enter Captcha Manually and Wait For the Script to Continue :")

        // * Showing Prompt to user to enter captcha 
        inquirer.prompt([{
                name: 'captchaInp',
                message: 'Enter Above Captcha ',
                type: 'input',
            }])
            // * Handling Promise returned by inquirer
            .then(async answers => {
                await page.type("#captcha", answers.captchaInp);
                //await page.click("button[type='submit']");
                await page.keyboard.press('Enter')
                await page.waitForTimeout(3000);

                // * Pressing Remind me later popup
                await page.evaluate(() => {
                    let elements = $(".btn.btn-primary").toArray();
                    $(elements[6]).click();
                    console.log("Return Dash Clicked")
                });

                await page.waitForTimeout(3000);

                // * Receving Return Dashboard Selector Array and clicking 7th Element in it
                await page.evaluate(() => {
                    let elements = $("button[type='button']").toArray();
                    $(elements[1]).click();
                    console.log("Return Dash Clicked")
                });

                // * Handling Selection of Financial Year and month list.
                await page.waitForTimeout(5000);
                //await page.select("select[data-ng-model='finyr']", "object:140");
                await page.type("select[data-ng-model='finyr']", fin_year);
                await page.waitForTimeout(1000);
                //await page.select("select[data-ng-model='reqmonth']", "object:151");
                await page.type("select[data-ng-model='reqmonth']", month);

                // * Pressing Search Button
                await page.click(".col-sm-3.col-xs-12 .btn.btn-primary.srchbtn");
                await page.waitForTimeout(5000);


                // * pressing Gstr 2B Button
                await page.evaluate(() => {
                    let elements = $('.btn.btn-primary').toArray();
                    $(elements[6]).click();
                });

                await page.waitForTimeout(5000);

                // * Fetching Client Name
                let clientName = await page.evaluate(functionObj.consoleFn, ".dropdown-toggle.lang-dpwn")
                //console.log(clientName);

                // * Creating Directory with Client Name
                functionObj.createDir(clientName, base_dir);
                let TwoBFPath = functionObj.gstr2BDirCreator(clientName, base_dir);

                //* Setting custom Download Path in puppeteer    
                let dlpath = path.join(base_dir, resultFolderName, clientName, "GSTR2B");
                await page._client.send('Page.setDownloadBehavior', {
                    behavior: 'allow',
                    downloadPath: dlpath,
                });


                // * Pressing Gstr2B Button Download Button 
                await page.evaluate(() => {
                    let elements = $('.btn.btn-primary').toArray();
                    $(elements[0]).click();
                });

                //alert("File Saved in Result Directory")
                await page.waitForTimeout(5000);
                console.log(`File Saves in ${TwoBFPath} Directory `)
                // * Exit from Browser
                browser.close();
            });
        //=======================================================================================================


    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    gst2B: gstr2B,
};