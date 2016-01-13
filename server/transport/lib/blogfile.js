var path = require('path');
var fs = require('fs');
var co = require('co');
var FileWorker = require('./filework');
var logger = require('log4js').getLogger("blogfile");
var unam = require('./parsefile');

const movetodir = path.join(__dirname, './amfiles');

if(!fs.existsSync(movetodir))
	fs.mkdirSync(movetodir);

var toPro = function(...argus) {
    return new Promise(function(resolve, reject) {
        var func = argus.pop();
        argus.push(function() {
            resolve(Array.from(arguments));
        });
        func.apply(this, argus);
    });
}

class BlogFile extends FileWorker{
	constructor(fromidFiles){
		super(fromidFiles);
	}

	waitWho(){
		const self = this;
		return new Promise((resolve, reject)=>{
			co(function* () {
				if(!self.content){
					var result = yield toPro(self.tmpAddr.path, fs.readFile);
					if(result[0]){
						logger.error(result[0]);
						resolve(null);
					}else
						self.content = result[1].toString();
					self.waitArray = self.content.match(/!\[.+\]\((?!\/images\/).*?\)/g);
					resolve(self.waitArray);
				}else
					resolve(self.waitArray);
			});
		})
	}

	deal(){
		const self = this;
		return new Promise((resolve, reject)=>{
			co(function* () {
				var waitfile = yield self.waitWho();
				self.begingWait();
				resolve(true);
			})
		})
	}

	begingWait(){
		this.on('comepic', this.callback);
	}

	callback(picfile){
		console.log(this);
		logger.debug('3');
		var index = this.waitArray.findIndex(x=>{
			return x === picfile.oldAddr.path;
		});
		logger.debug(this.waitArray[index]);
		if(!this.waitArray[index])
			return ;
		else{
			var regext = new RegExt(`/${waitArray[index].match(/\((.+)\)/)[1]}/`);
			logger.debug(regext);
			this.content.replace(regext, picfile.url);
			picfile.fileComplete();
			this.waitArray[index] = undefined;
			logger.debug(this.waitArray);
			logger.debug(this.waitArray.find(x=>{return x}));
			if( !this.waitArray.find(x=>{return x}) ){
				logger.debug('1');
				contentComplete();
				logger.debug(2);
				this.removeListener('comepic', this.callback);
				logger.debug('blog callback over');
			}
		}
	}

	contentComplete(){
		const self = this;
		return new Promise((resolve, reject)=>{
			co(function* () {
				var result = yield toPro(self.tmpAddr.path, self.content, fs.writeFile);
				if(result[0]){
					reject(result[0]);
					return ;
				}
				yield self.moveTo(movetodir);
				var blog = unamFormString(self.content);
				blog.save();
				logger.debug('blog complete over');
				resolve(true);
			})
		})

	}
}

module.exports = BlogFile;