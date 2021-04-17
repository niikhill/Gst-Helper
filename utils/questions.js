let mainMenu = [{
    name: "mainModule",
    type: "list",
    message: "Choose Your Action :",
    choices: ["Download Returns", "File Returns", "Exit"],
}, ];
let UploadModulr = [{
        type: "input",
        name: "username",
        message: "What's your username :",
    },
    {
        type: "password",
        message: "Enter a password :",
        name: "password",
        mask: "*",
    },
    {
        name: "UploadModule",
        type: "list",
        message: "Choose your Module:",
        choices: ["Gstr3B", "GstR1", "Exit"],
    },
];
let questions1 = [{
        type: "input",
        name: "username",
        message: "What's your username :",
    },
    {
        type: "password",
        message: "Enter a password :",
        name: "password",
        mask: "*",
    },

    {
        name: "DownloadModule",
        type: "list",
        message: "Choose your Module:",
        choices: ["Gstr2B", "Gstr3B", "GstR1", "Exit"],
    },
];

let questions2 = [{
        type: "list",
        name: "fin_year",
        message: "Select the Fin Year: ",
        choices: ["2017-18", "2018-19", "2019-20", "2020-21", "2021-22"],
    },
    {
        type: "list",
        name: "month",
        message: "Select the month :",
        choices: [
            "January",
            "Feburary",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ],
    },
];

module.exports = {
    questions1: questions1,
    questions2: questions2,
    mainMenu: mainMenu,
    UploadModule: UploadModulr,
};