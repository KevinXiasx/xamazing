var path = require('path');
var fs = require('fs');
var co = require('co');
var FileWorker = require('./filework');
var logger = require('log4js').getLogger("blogfile");
var unam = require('./parsefile');

const movetodir = path.join(__dirname, '../amfiles');

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
					var contentPicArray = self.content.match(/!\[.+\]\((?!\/images\/).*?\)/g) || [];
					var headerPicArray ;
					try{
						var str = self.content.match(/"path"(.|\n)+?(\[(.|\n)+?\])/m)[2];
						headerPicArray = JSON.parse(str) || [];
					}catch(e){
						logger.error('parse pic path fail , file :'+self.oldAddr.name);
					}
					self.waitArray = contentPicArray.map(x=>{
						return x.match(/\((.+)\)/)[1];
					})
					self.waitArray = Array.from([...self.waitArray, ...headerPicArray]);
					logger.debug(self.waitArray);
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
				yield self.waitWho();
				self.begingWait();
				resolve(true);
			})
		})
	}

	begingWait(){
		const self = this;
		logger.debug('begin listen');
		self.callback = function (picfile) {
			logger.debug(`pic ${picfile.oldAddr.name} is come`);
			var index = self.waitArray.findIndex(x=>{
				return x === picfile.oldAddr.path;
			});
			if(!self.waitArray[index])
				return ;
			else{
				var regext = new RegExp(`${self.waitArray[index]}`);
				self.content = self.content.replace(regext, picfile.url);
				picfile.fileComplete();
				logger.debug('reviect '+ picfile.oldAddr.name);
				self.waitArray[index] = undefined;
				if( !self.waitArray.find(x=>{return x}) ){
					self.contentComplete();
					self.removeListener('comepic', self.callback);
					logger.debug('blog callback over');
				}
			}
		}

		self.on('comepic', self.callback);
		self.emit('comeblog');
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
				var blog = unam.unamFormString(self.content);
				if(blog)
					blog.save();
				else{
					logger.error(`blog parse err, file is ${self.tmpAddr.path}`);
					resolve(true);
					return ;
				}
				yield self.moveTo(movetodir);
				logger.debug('blog complete over');
				resolve(true);
			})
		})

	}
}

module.exports = BlogFile;