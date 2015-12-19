'use strict';

var express = require('express');
var router = express.Router();
var fs = require('fs');
var formidable = require('formidable');
var path = require('path');
var inputCheck = require('../server/safe/inputcheck');


router.post('/', (req, res, next) => {

    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.keepExtensions = true;
    form.maxFieldsSize = 2 * 1024 * 1024;
    var today = new Date();
    form.uploadDir = 'server/transport/filetmp/'; //path.join('server/transport/filetmp/', 'date-' + today.getFullYear() + today.getMonth());

    form.parse(req, (err, fields, files) => {
        if (err) {
            return err;
        }
        res.send(files.upload.path + '\n');
        /* var extname = path.extname(files.upload.path);
            if (!/^\.am/.test(path.extname(path);)) {
            var name = path.basename(files.upload.path);
        }

        var avatarName = Math.random() + '.' + extName;
        var newPath = form.uploadDir + avatarName;

        fs.renameSync(files.fulAvatar.path, newPath); //重命名*/
    });
})

module.exports = router;
