const gst2BObj = require("./modules/gstr2BFetch.js");
const gst3BObj = require("./modules/gstr3BFetch.js")
const gstR1Obj = require("./modules/gstr1Fetch");
const R1UploadObj = require("./modules/gstr1Upload");
const functionObj = require(__dirname + "\\utils\\functions")
const quesObj = require("./utils/questions");
const inquirer = require('inquirer');
const base_dir = __dirname;
const chalk = require('chalk')
const figlet = require('figlet')


// * The Top art Printer Function Being called
printer();

//Warnung User For Captcha
console.log()
console.log('Please Enter Captcha Manually and Wait For the Script to Continue');
console.log()


// * Prompt for Main Menu
inquirer.prompt(quesObj.mainMenu).then((mainAnswer) => {
    if (mainAnswer.mainModule === 'Download Returns') {

        // * Prompt for Download Return Module
        inquirer.prompt(quesObj.questions1).then((answers1) => {
            if (answers1.DownloadModule === 'Gstr2B') {

                // * prompting user for Selecting Financial year and Month
                inquirer.prompt(quesObj.questions2).then((answers2) => {

                    // * Gstr2 Download Function Being Called
                    gst2BObj.gst2B(answers1.username, answers1.password, answers2.fin_year, answers2.month, base_dir, functionObj);
                })
            } else if (answers1.DownloadModule === 'Gstr3B') {

                // * prompting user for Selecting Financial year and Month
                inquirer.prompt(quesObj.questions2).then((answers2) => {

                    // * Gstr3 Download Function Being Called
                    gst3BObj.gst3B(answers1.username, answers1.password, answers2.fin_year, answers2.month, base_dir, functionObj);
                })
            } else if (answers1.DownloadModule === 'GstR1') {

                // * prompting user for Selecting Financial year and Month
                inquirer.prompt(quesObj.questions2).then((answers2) => {

                    // * Gstr1 Download Function Being Called
                    gstR1Obj.gstr1(answers1.username, answers1.password, answers2.fin_year, answers2.month, base_dir, functionObj);
                })
            } else if (answers1.DownloadModule === 'Exit') {
                process.exit(0);
            } else {
                console.log("Invalid")
            }
        });
        // * Prompt for Upload Return Module
    } else if (mainAnswer.mainModule === 'File Returns') {
        inquirer.prompt(quesObj.UploadModule).then((uploadanswer) => {
            if (uploadanswer.UploadModule === 'GstR1') {

                // * prompting user for Selecting Financial year and Month
                inquirer.prompt(quesObj.questions2).then((answers2) => {
                    // * Gstr1 Upload Function Being Called
                    R1UploadObj.gstr1Upload(uploadanswer.username, uploadanswer.password, answers2.fin_year, answers2.month, base_dir, functionObj);
                })
            } else if (uploadanswer.UploadModule === 'Gstr3B') {

                // * prompting user for Selecting Financial year and Month
                inquirer.prompt(quesObj.questions2).then((answers2) => {
                    console.log("Yet To be Implemented")
                })
            } else if (answers1.DownloadModule === 'Exit') {
                process.exit(0);
            } else {
                console.log("Invalid")
            }
        });
    } else if (mainAnswer.mainModule === 'Exit') {
        process.exit(0);
    } else {
        console.log("Invalid")
    }
})





// * Function to print The Art
function printer() {
    console.log(`${chalk.cyan(
        figlet.textSync(' GST-HELPER ', {
            horizontalLayout: 'full',
        })
    )}\n`)
}