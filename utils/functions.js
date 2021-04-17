const fs = require("fs");
const path = require("path");
const resultFolderName = "Results";



function createResultDir(base_dir) {
    let resultFolder = path.join(base_dir, resultFolderName)
    if (fs.existsSync(resultFolder) == false) {
        fs.mkdirSync(resultFolder);
    }
}


function createDir(clientName, base_dir) {
    let folderPath = path.join(base_dir, resultFolderName, clientName);
    if (fs.existsSync(folderPath) == false) {
        fs.mkdirSync(folderPath);
    }
}

function gstr3BDirCreator(clientName, base_dir) {
    let folderPath = path.join(base_dir, resultFolderName, clientName, "GSTR3B");
    if (fs.existsSync(folderPath) == false) {
        fs.mkdirSync(folderPath);
        return folderPath;
    }
    return folderPath;
}

function consoleFn(clientNameSel) {
    let clientName = document.querySelector(clientNameSel);
    clientName = clientName.innerText;
    clientName = clientName.trim();
    return clientName;

}

function gstr2BDirCreator(clientName, base_dir) {
    let folderPath = path.join(base_dir, resultFolderName, clientName, "GSTR2B");
    if (fs.existsSync(folderPath) == false) {
        fs.mkdirSync(folderPath);
        return folderPath;
    }
    return folderPath;
}
function gstr1DirCreator(clientName, base_dir) {
    let folderPath = path.join(base_dir, resultFolderName, clientName, "GSTR1");
    if (fs.existsSync(folderPath) == false) {
        fs.mkdirSync(folderPath);
        return folderPath;
    }
    return folderPath;
}
module.exports = {
    createResultDir:createResultDir,
    gstr2BDirCreator:gstr2BDirCreator,
    consoleFn:consoleFn,
    gstr3BDirCreator:gstr3BDirCreator,
    createDir:createDir,
    gstr1DirCreator:gstr1DirCreator
};