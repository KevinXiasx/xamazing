var path = require('path');
var fs = require('fs');
var co = require('co');
var events = require('events');
var emitter = new events.EventEmitter();
var logger = require('log4js').getLogger("filework");
const assert = require('assert');

var toPro = function(...argus) {
    return new Promise(function(resolve, reject) {
        var func = argus.pop();
        argus.push(function() {
            resolve(Array.from(arguments));
        });
        func.apply(this, argus);
    });
}

class FileWorker{
	constructor(fromidFiles){
		this.oldAddr = path.parse(fromidFiles.upload.name);
		this.oldAddr.path = fromidFiles.upload.name;
		this.tmpAddr = path.parse(fromidFiles.upload.path);
		this.tmpAddr.path = fromidFiles.upload.path;
	} 

	isExists(checkpath){
		var self = this;
		return new Promise((resolve, reject)=>{
			co(function* () {
				var isDirexist = yield toPro(path.dirname(checkpath), fs.exists);
				if(!isDirexist[0]){
					var fail = yield toPro(path.dirname(checkpath), fs.mkdir);
					if(fail)
						reject(fail);
					else
						resolve(checkpath);
				}
				fs.exists(checkpath, exi=>{
					if(!exi)
						resolve(checkpath);
					else
						resolve(self.isExists(checkpath.replace(/\/(?=[^\/]+$)/, '/T-')));
				});
			})
		})
	}

	moveTo(dir){
		var self = this;
		return new Promise((resolve, reject)=>{
			co(function* () {
				var newPath = yield self.isExists(path.join(dir,self.oldAddr.base));
				var ret = yield toPro(self.tmpAddr.path, newPath, fs.rename);
				if(ret[0])
					reject(ret);
				else{
					self.newAddr = path.parse(newPath);
					self.newAddr.path = newPath;
					resolve(true);
				}
			})
		})
	}

	on(eventname, callback){
		emitter.on(eventname, callback);
	}

	emit(eventname, argu){
		emitter.emit(eventname, argu);
	}

	removeListener(eventname, func){
		emitter.removeListener(eventname, func);
	}
}

module.exports = FileWorker;