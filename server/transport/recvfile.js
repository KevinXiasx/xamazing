'use strict';

var fs = require('fs');
var formidable = require('formidable');
var path = require('path');
var co = require('co');
var toPro = function(...argus) {
    return new Promise(resolve, reject) {
        var func = argus.pop();
        argus.push(function() {
            resolve(arguments);
        })
        func.apply(this, ...argus);
    }
}

var form = new formidable.IncomingForm();
form.encoding = 'utf-8';
form.keepExtensions = true;
form.maxFieldsSize = 2 * 1024 * 1024;
var today = new Date();
form.uploadDir = path.join('./filetmp', 'date-' + today.getFullYear() + today.getMonth());

form.parse(req, (err, fields, files) => {
    if (err) {
        return err;
    }
    var amFile = {};
    var extname = path.extname(files.upload.path);
    switch (extname) {
        case '.png':
        case '.jpg':
            amFile = new
    }
    if (!/^\.am/.test(path.extname(path);)) {
        var name = path.basename(files.upload.path);
    }

    var avatarName = Math.random() + '.' + extName;
    var newPath = form.uploadDir + avatarName;

    fs.renameSync(files.fulAvatar.path, newPath); //重命名*/

});
