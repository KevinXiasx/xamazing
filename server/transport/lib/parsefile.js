var fs = require('fs');
var Blog = require('../../content/blog');
var Piclife = require('../../content/pic');
var unamFormFile = function (file) {
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

				switch(header.type){
					case 'blog':
						resolve(new Blog(header));
						break;
					case 'piclife':
						resolve(new Piclife(header));
						break;
					default:
						return false;
						break;
				}
			}
		});
	});
}

var unamFormString = function (string) {
	var fileconent = string;
	var parsesym = '------';
	var header = fileconent.substr(0, fileconent.indexOf(parsesym));
	var tmpstr = fileconent.substr(fileconent.indexOf(parsesym)+1);
	var content = tmpstr.substr( tmpstr.indexOf('\n') );

	header = JSON.parse(header);
	header.content = content;

	switch(header.type){
		case 'blog':
			return new Blog(header);
			break;
		case 'piclife':
			return new Piclife(header);
			break;
		default:
			return false;
			break;
	}
}


exports.unamFormFile = unamFormFile;
exports.unamFormString = unamFormString;