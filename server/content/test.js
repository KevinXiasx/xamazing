'use strict';

let blog = require('./blog');
let base = require('./base');
let pic = require('./piclife');

let baseinsert = new base('blog');
pic.getById('20000002').then(doc=>{
	console.log(doc);
});	