'use strict';

var fs = require('fs');
var formidable = require('formidable');
var path = require('path');
var co = require('co');
var unam = require('./parsefile');

var events = require('events');
var emitter = new events.EventEmitter();

const savepath = path.join(__dirname, './files');

var toPro = function(...argus) {
    return new Promise(function(resolve, reject) {
        var func = argus.pop();
        argus.push(function() {
            resolve(Array.from(arguments));
        });
        func.apply(this, argus);
    });
}

var dealblog = function (files) {
    return new Promise((resolve, reject)=>{
        co(function* () {
            var blog = yield unam(files.upload.path);
            var imgReg = 
            var eventcallback = function (imgfile){
                if(blog.contentfunc().indexOf(imgfile.upload.name) == -1)
                    return;
                const savePath = path.join(__dirname, "../../client/images/blog/");
                var oldname = path.basename(imgfile.upload.name);
                var savename = oldname;
                while(1){
                    var exist = yield toPro(path.join(savePath, savename ), fs.exists);
                    if(exist[0]){
                        savename = 'T-'+savename;
                        continue;
                    }else{
                        var ret = yield toPro(files.upload.path, path.join(savePath, savename), fs.rename);
                        if(ret[0])
                            reject(ret);
                        break;
                    }
                }
                var imgurl = path.join('/images/blog/', savename);
                var reg = new RegExp(imgfile.upload.name, "g");
                blog.contentfunc(blog.contentfunc().replace(reg, imgurl));
            });

            var saveblogfile = function () {
                blog.save();
                var today = new Date();
                var newfilepath = path.join(savepath, 'date-' + today.getFullYear() + today.getMonth());
                var exist = yield toPro(newfilepath, fs.exists);
                if(!exist[0]){
                    var fail = yield toPro(newfilepath, fs.mkdir);
                    if(fail)reject(fail);
                }

                var newname = path.join(newfilepath, files.upload.name);
                var ret = yield toPro(files.upload.path, newname, fs.rename);
                if(ret[0])
                    reject(ret);
                resolve('ok');
            }

            if(/(\[!\S*?\])\(\S*?\)/.test(blog.contentfunc())){
                emitter.on('comepic',eventcallback);
            }
            else
                saveblogfile();
        });
    });
};

var dealimg = function (files) {
    return new Promise((resolve, reject)=>{
        co(function* () {
            emitter('comipic', files);
        })
    });
}

var recvfile = function(req){
    return new Promise((resolve, reject)=>{
        co(function* () {
            var form = new formidable.IncomingForm();
            form.encoding = 'utf-8';
            form.keepExtensions = true;
            form.maxFieldsSize = 2 * 1024 * 1024;
            
            form.uploadDir = path.join(__dirname, './tmpfiles');

            form.parse(req, (err, fields, files)=>{
                console.log(files);
                if (err)
                    reject(err);
                var extname = path.extname(files.upload.path);
                switch (extname) {
                    case '.png':
                    case '.jpg':
                        dealimg(files).then(doc=>{
                            resolve('ok');
                        });
                        break;
                    case '.amblog':
                        dealblog(files).then(doc=>{
                            resolve('ok');
                        });
                        break;
                    default:
                        break;
                }
            });
        });      
    });
}

exports.recvfile = recvfile;