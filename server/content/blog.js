"use strict";

//let logger = require('../log/log').logger('blogs');
let BaseContent = require('./base');

let Optional = {
	'format':'normal',
};

var initoptional = function (opt) {
	let optreturn = Optional;
	for( let j in opt){
		optreturn[j] = opt[j];
	}
	return optreturn;
}

class BlogClass extends BaseContent{

	constructor(){
		super('blog');
	}

	deal(doc, opt){
		if(!opt)
			return doc;
		opt = initoptional(opt);
		if( opt.format == 'markdown')
			doc.content = marked(doc.content);
		return doc;
	}
}

module.exports = new BlogClass;