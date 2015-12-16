"use strict";

let mongoose = require('mongoose');
let logger = require('../log/log').logger('comment');

require('../mongo/content');

let comment = mongoose.model('Comment');

class Comment{
	getcomment( target, callback){
		let count = target.length;
		if( count == 0){
			callback(null);
		}
		for(let i in target){
			let cond = {
				'targetid':target[i].id
			};
			comment.find(cond, (err, doc) => {
				if( err ){
					logger.error(err);
					doc = null;
				}
				else if( doc.length == 0 )
					doc = null;
				else{
					for(let k in target){
						if(target[k].id == doc[0].targetid){
							target[k].comments = doc;
							break;
						}
					}
				}
				count--;
				if(count == 0 ){
					callback(target);
				}
			});
		}
	}
}

module.exports = new Comment();