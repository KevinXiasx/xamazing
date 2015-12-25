var fs = require('fs');
var Blog = require('../content/blog');
var unam = function (file) {
	return new Promise(function (resolve, reject) {
		fs.readFile(file, (err, data)=>{
			if(err)
				reject(err);
			else{
				var fileconent = data.toString('utf8');
				var parsesym = '------';
				var header = fileconent.substr(0, fileconent.indexOf(parsesym));
				var tmpstr = fileconent.substr(fileconent.indexOf(parsesym)+1);
				var content = tmpstr.substr( tmpstr.indexOf('\n') );

				header = JSON.parse(header);
				header.content = content;

				resolve(new Blog(header));
			}
		});
	});
}

module.exports = unam;