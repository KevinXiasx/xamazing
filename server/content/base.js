'use strict';

let mongo = require('../mongo/mongo');
let co = require('co');
let inputCheck = require('../safe/inputcheck');


class BaseContent {
    static getCurrentFunc(type, classs) {
    	return function (size) {
    		return new Promise(resolve => {
	    		var extracter = mongo.createMongoExtract(type);
	            extracter.getDocIndex(0, size, doc => {
	                resolve(doc.map(x=>{return new classs(x)}));
	            });
	        });
    	}
    }

    static getRangFunc(type, classs) {
    	return function(from, size){
	        return new Promise(resolve => {
	        	var extracter = mongo.createMongoExtract(type);
	            extracter.getDocIndex(from, size, doc => {
	                resolve(doc.map(x=>{return new classs(x)}));
	            });
	        });
	    };
    }

    static searchFunc(type, classs) {
    	return function (cond) {
	        return new Promise(resolve => {
				var extracter = mongo.createMongoExtract(type);
	            extracter.getDocByCond(cond, doc => {
	                resolve(doc.map(x=>{return new classs(x)}));
	            });
	        });
	    };
    }

    static getByIdFunc(type, classs) {
    	return function (id) {
	        return new Promise(resolve => {
	        	var extracter = mongo.createMongoExtract(type);
	            var isNumber = inputCheck.isType('Number');
	            var isString = inputCheck.isType('String');
	            if (isString(id))
	                id = parseInt(id);
	            if (isNumber(id) && !Number.isNaN(id)) {
	                extracter.getDocByCond({
	                    'id': id
	                }, doc => {
		                resolve(doc.map(x=>{return new classs(x)}));
	                });
	            } else
	                throw new Error('id type err');
	        });
	    }
    }

    static add(type, content) {
        return new Promise(resolve => {
            let saver = mongo.createMongoSave(type, content);
            saver.save();
        });
    }
}

module.exports = BaseContent;
