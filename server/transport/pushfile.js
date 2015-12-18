'use strict';

var fs = require('fs');
var formidable = require('formidable');
var path = require('path');

class amfile {
    constructor(req) {
        var form = new formidable.IncomingForm();
        form.encoding = 'utf-8';
        form.keepExtensions = true;
        form.maxFieldsSize = 2 * 1024 * 1024;
        var today = new Date();
        form.uploadDir = path.join('amfiles', 'date-' + today.getFullYear() + today.getMonth());

        form.parse(req, (err, fields, files) => {
                if (err) {
                    return err;
                }
                var extname = path.extname(files.upload.path);
                if (!/^\.am/.test(extname)) {
                    var name = path.basename(files.upload.path);
                }



                var avatarName = Math.random() + '.' + extName;
                var newPath = form.uploadDir + avatarName;

                fs.renameSync(files.fulAvatar.path, newPath); //重命名
            }
        });
}
