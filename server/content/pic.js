'use strict';

var Base = require('./base');
var inputcheck = require('../safe/inputcheck');
var isArray = inputcheck.isType('Array');

class Piclife{
	constructor(doc){
		if(doc._id){
			this.mongoDate = doc;
		}
		this.id = doc.id;
		this.title = doc.title;
		this.content = doc.content;
		this.createtime = doc.createtime;
		this.author = doc.author;
		if(!isArray(doc.path))
			this.path = Array.of(doc.path);
		else
			this.path = doc.path;
	}

	idfunc(){
		return this.id;
	}

	titlefunc(newtitle){
		if(newtitle)
			this.title = newtitle;
		else
			return this.title;
	}

	contentfunc(newcontent){
		if(newcontent)
			this.content = newcontent;
		else{
			console.log('here');
			return this.content;
		}
	}

	createtimefunc(newcreatetime){
		if(newcreatetime)
			this.createtime = newcreatetime;
		else 
			return this.createtime;
	}

	authorfunc(newauthor){
		if(newauthor)
			this.author = newauthor;
		else
			return this.author;
	}

	pathfunc(newpath){
		if(newpath)
			this.path = newpath;
		else
			return this.path;
	}

	pathmin(){
		return this.path.map(x=>{
			return x.replace(/\/(?=[^\/]+$)/, '/min/');
		})
	}

	addpicpath(p){
		if(isArray(p))
			this.path.push(p);
		else
			this.path = Array.of(this.push, p);
	}

	save(){
		if(this.mongoDate){
			this.mongoDate.id = this.id;
			this.mongoDate.title = this.title;
			this.mongoDate.content = this.content;
			this.mongoDate.author = this.author;
			this.mongoDate.createtime = this.createtime;
			this.mongoDate.path = this.path;
			this.mongoDate.save();
			return ;
		}else{
			let con = {};
			con.id = this.id;
			con.title = this.title;
			con.content = this.content;
			con.author = this.author;
			con.createtime = this.createtime;
			con.path = this.path;
			Base.add('pic', con);
		}
	}
}

Piclife.getCurrent = Base.getCurrentFunc('pic', Piclife);
Piclife.getRang = Base.getRangFunc('pic', Piclife);
Piclife.search = Base.searchFunc('pic', Piclife);
Piclife.getById = Base.getByIdFunc('pic', Piclife);

module.exports = Piclife;