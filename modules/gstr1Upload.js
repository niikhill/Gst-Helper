const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const gst_url = "https://gst.gov.in";
const resultFolderName = "Results";
const terminalImage = require('terminal-image');
const inquirer = require('inquirer');
const inquirerFileTreeSelection = require('inquirer-file-tree-selection-prompt')
inquirer.registerPrompt('file-tree-selection', inquirerFileTreeSelection)

/**
 *  fin_year    => Financial year, fetched from prompt in main.js during runtime.
 *  month       => Month, fetched from prompt in main.js during runtime.
 *  base_dir    => Base directory where main.js is located.  
 *  functionObj => Contains all helper functions
 **/
async function gstr1Upload(username, password, fin_year, month, base_dir, functionObj) {
    try {

        // * puppeteer being initialized
        let browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized"]
        });

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
        await page.waitForTimeout(3000);
        await page.waitForSelector("input[id='captcha']", {
            visible: true
        });
        
        //* =====================Handling Captcha For Headless Operation==========================
        //* ======================================================================================
        let captcha = await page.$('#imgCaptcha');
        let captcha_path = path.join(base_dir, "utils\\captchas\\")

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
        console.log("Enter the Above Captcha :")

        // * Showing Prompt to user to enter captcha
        inquirer.prompt([{
            name: 'captchaInp',
            message: 'Please Enter Captcha Manually and Wait For the Script to Continue : ',
            type: 'input',
        }])
            // * Handling Promise returned by inquirer
            .then(async answers => {
                await page.type("#captcha", answers.captchaInp);
                await page.waitForTimeout(3000);
                //await page.click("button[type='submit']");
                await page.keyboard.press('Enter')
                //=======================================================================================================
                console.log("Logged In")

                // * Prompting User For File Selection and waiting till user selects a file

                inquirer.prompt([
                    {
                        type: 'file-tree-selection',
                        name: 'file',
                        message: 'Select Json File',
                    }
                ])
                    // * Handling File Selection
                    .then(async answers => {

                        await page.waitForTimeout(3000);
                        // * Pressing Remind me later popup
                        await page.evaluate(() => {
                            let elements = $(".btn.btn-primary").toArray();
                            $(elements[6]).click();
                        });

                        await page.waitForTimeout(3000);

                        //* Pressing Return DashBoard Button
                        await page.evaluate(() => {
                            let elements = $("button[type='button']").toArray();
                            $(elements[1]).click();
                        });

                        // * Handling Selection of Financial Year and month list.
                        await page.waitForTimeout(5000);
                        await page.type("select[name='fin']", fin_year);
                        await page.waitForTimeout(1000);
                        await page.type("select[name='mon']", month);
                        await page.click(".col-sm-3.col-xs-12 .btn.btn-primary.srchbtn");
                        await page.waitForTimeout(5000);

                        // * Pressing R1 Offline Button
                        await page.evaluate(() => {
                            let elements = $('.btn.btn-primary').toArray();
                            $(elements[3]).click();
                        });
                        await page.waitForTimeout(3000);

                        // * Uplaoding File to gst portal
                        const upelementHandle = await page.$("input[type=file]");
                        await upelementHandle.uploadFile(answers.file);

                        await page.waitForTimeout(5000);
                        
                        // * Exit Browser
                        browser.close();


                    });




            });
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    gstr1Upload: gstr1Upload,
};