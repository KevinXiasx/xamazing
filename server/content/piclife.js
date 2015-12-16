"use strict";

//let logger = require('../log/log').logger('piclifes');
let BaseContent = require('./base');

class Piclife extends BaseContent{
	constructor(){
		super('pic');
	}
}

module.exports = new Piclife;