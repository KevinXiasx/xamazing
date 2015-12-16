'use strict';

let mongo = require('./content');


/*
let blogSave = mongo.createMongoSave('blog', {
	title:'test'
});

blogSave.save(err=>{*/

/*});*/

	let blogExtract = mongo.createMongoExtract('blog');
	blogExtract.getDocIndex(0, 3, doc=>{
		console.log(doc);
	});