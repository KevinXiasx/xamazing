'use strict';

var fs = require('fs');
var formidable = require('formidable');
var path = require('path');
var co = require('co');
var unam = require('./lib/parsefile');
var PicFile = require('./lib/picfile');
var BlogFile = require('./lib/blogfile');

var logger = require('log4js').getLogger("transport");

const savepath = path.join(__dirname, './files');

const tmpdir = path.join(__dirname, './tmpfiles');
if(!fs.existsSync(tmpdir))
    fs.mkdirSync(tmpdir);

var toPro = function(...argus) {
    return new Promise(function(resolve, reject) {
        var func = argus.pop();
        argus.push(function() {
            resolve(Array.from(arguments));
        });
        func.apply(this, argus);
    });
}

var recvfile = function(req){
    return new Promise((resolve, reject)=>{
        co(function* () {
            var form = new formidable.IncomingForm();
            form.encoding = 'utf-8';
            form.keepExtensions = true;
            form.maxFieldsSize = 2 * 1024 * 1024;
            
            form.uploadDir = tmpdir;
            form.parse(req, (err, fields, files)=>{
                if (err)
                    reject(err);
                var extname = path.extname(files.upload.path);
                switch (extname) {
                    case '.png':
                    case '.jpg':
                        var picfile = new PicFile(files);
                        resolve(picfile.deal());
                        break;
                    case '.amblog':
                        var blogfile = new BlogFile(files);
                        resolve(blogfile.deal());
                        break;
                    default:
                        break;
                }
            });
        });      
    });
}

exports.recvfile = recvfile;