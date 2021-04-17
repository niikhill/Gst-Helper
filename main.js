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


//The Top art Printer Function Being called
printer();

//Warnung User For Captcha
console.log()
console.log('Please Enter Captcha Manually and Wait For the Script to Continue');
console.log()


//Prompt for Main Menu
inquirer.prompt(quesObj.mainMenu).then((mainAnswer) => {
    if (mainAnswer.mainModule === 'Download Returns') {
        //Prompt for Download Return Module
        inquirer.prompt(quesObj.questions1).then((answers1) => {
            if (answers1.DownloadModule === 'Gstr2B') {
                inquirer.prompt(quesObj.questions2).then((answers2) => {
                    gst2BObj.gst2B(answers1.username, answers1.password, answers2.fin_year, answers2.month, base_dir, functionObj);
                })
            } else if (answers1.DownloadModule === 'Gstr3B') {
                inquirer.prompt(quesObj.questions2).then((answers2) => {
                    gst3BObj.gst3B(answers1.username, answers1.password, answers2.fin_year, answers2.month, base_dir, functionObj);
                })
            } else if (answers1.DownloadModule === 'GstR1') {
                inquirer.prompt(quesObj.questions2).then((answers2) => {
                    gstR1Obj.gstr1(answers1.username, answers1.password, answers2.fin_year, answers2.month, base_dir, functionObj);
                })
            } else if (answers1.DownloadModule === 'Exit') {
                process.exit(0);
            } else {
                console.log("Invalid")
            }
        });
        //Prompt for Upload Return Module
    } else if (mainAnswer.mainModule === 'File Returns') {
        console.log("Yet To Be Implemented")
        inquirer.prompt(quesObj.UploadModule).then((uploadanswer) => {
            if (uploadanswer.UploadModule === 'GstR1') {
                inquirer.prompt(quesObj.questions2).then((answers2) => {
                    R1UploadObj.gstr1Upload(uploadanswer.username, uploadanswer.password, answers2.fin_year, answers2.month, base_dir, functionObj);
                })
            } else if (uploadanswer.UploadModule === 'Gstr3B') {
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





//Function to print The Art
function printer() {
    console.log(`${chalk.cyan(
        figlet.textSync(' GST-HELPER ', {
            horizontalLayout: 'full',
        })
    )}\n`)
}