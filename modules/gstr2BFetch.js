const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const gst_url = "https://gst.gov.in";
const resultFolderName = "Results";
const terminalImage = require('terminal-image');
const inquirer = require('inquirer');

async function gstr2B(username, password, fin_year, month, base_dir, functionObj) {
    try {
        let browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized"]
        });
        //Create Result Directory 
        functionObj.createResultDir(base_dir);

        let pageArr = await browser.pages();
        let page = pageArr[0];
        await page.goto(gst_url);
        await page.click(".list-inline.mlinks a[target='_self']")
        await page.waitForSelector("input[id='username']", {
            visible: true
        });
        await page.type("input[id='username']", username, {
            delay: 100
        });
        await page.type("input[id='user_pass']", password, {
            delay: 100
        });
        await page.waitForSelector("input[id='captcha']", {
            visible: true
        });

        //=====================Handling Captcha For Headless Operation=============
        //======================================================================================
        let captcha = await page.$('#imgCaptcha');
        let captcha_path = path.join(base_dir, "utils\\captchas\\")
        console.log(captcha_path);
        await captcha.screenshot({
            path: captcha_path + "captcha.png"
        });
        console.log(await terminalImage.file(captcha_path + "captcha.png", {
            width: 70
        }));
        await page.waitForSelector("#captcha", {
            visible: true
        });
        console.log("Please Enter Captcha Manually and Wait For the Script to Continue :")

        inquirer.prompt([{
                name: 'captchaInp',
                message: 'Enter Above Captcha ',
                type: 'input',
            }])
            .then(async answers => {
                await page.type("#captcha", answers.captchaInp);
                //await page.click("button[type='submit']");
                await page.keyboard.press('Enter')
                await page.waitForTimeout(3000);

                await page.evaluate(() => {
                    let elements = $(".btn.btn-primary").toArray();
                    $(elements[6]).click();
                    console.log("Return Dash Clicked")
                });

                await page.waitForTimeout(3000);

                //To Press ReturnDashBoardButton
                await page.evaluate(() => {
                    let elements = $("button[type='button']").toArray();
                    $(elements[1]).click();
                    console.log("Return Dash Clicked")
                });

                //INPUT BLOCK
                await page.waitForTimeout(5000);
                //await page.select("select[data-ng-model='finyr']", "object:140");
                await page.type("select[data-ng-model='finyr']", fin_year);
                await page.waitForTimeout(1000);
                //await page.select("select[data-ng-model='reqmonth']", "object:151");
                await page.type("select[data-ng-model='reqmonth']", month);
                await page.click(".col-sm-3.col-xs-12 .btn.btn-primary.srchbtn");
                await page.waitForTimeout(5000);


                //press Gstr 2B Button
                await page.evaluate(() => {
                    let elements = $('.btn.btn-primary').toArray();
                    $(elements[6]).click();
                });

                await page.waitForTimeout(5000);

                //Get Client name 
                let clientName = await page.evaluate(functionObj.consoleFn, ".dropdown-toggle.lang-dpwn")
                //console.log(clientName);
                functionObj.createDir(clientName, base_dir);
                let TwoBFPath = functionObj.gstr2BDirCreator(clientName, base_dir);

                //set custom DlPath in puppeteer    
                let dlpath = path.join(base_dir, resultFolderName, clientName, "GSTR2B");
                await page._client.send('Page.setDownloadBehavior', {
                    behavior: 'allow',
                    downloadPath: dlpath,
                });


                //press Gstr2B Button Download Button 
                await page.evaluate(() => {
                    let elements = $('.btn.btn-primary').toArray();
                    $(elements[0]).click();
                });

                //alert("File Saved in Result Directory")
                await page.waitForTimeout(5000);
                console.log(`File Saves in ${TwoBFPath} Directory `)
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