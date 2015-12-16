'use strict';

var express = require('express');
var router = express.Router();
var blog= require('../server/content/blog');
var piclife = require('../server/content/piclife');
let url = require('url');

/* GET home page. */ 
router.get('/', function(req, res, next) {
	let guard = 0;
	let blogs, pic;
	piclife.getCurrent(3).then(doc=>{
		pic = doc;
		console.log(doc);
		if( ++guard == 2 )
			res.render('top/top.ejs',{'blog':blogs, 'piclife':pic});
	});

	blog.getCurrent(4).then(doc=>{
		blogs = doc;
		console.log(blogs);
		if( ++guard == 2 ) 
			res.render('top/top.ejs',{'blog':blogs, 'piclife':pic});
	})
});

router.get('/blog', (req, res, next)=>{
	blog.getRang(0, 10).then(doc=>{
		res.render('top/blog/blog.ejs', {'blog':doc});
	});
})

router.get('/singleblog', (req, res, next)=>{
	let urljson = url.parse(req.url, true).query;
	if( /\D/.test(urljson.blogid))
		return ;
	blog.getById(urljson.blogid, {'format':'markdown'}).then(doc=>{
		res.render('top/blog/singleblog/singleblog.ejs', {'blog':doc});		
	})
})

router.get('/piclife', (req, res, next)=>{
	piclife.getCurrent(5).then(doc=>{
		res.render('top/piclife/piclife.ejs', {'piclife':doc});
	});
})

router.get('/singlepic', (req, res, next)=>{
	let urljson = url.parse(req.url, true).query;
	if( /\D/.test(urljson.picid))
		return ;
	console.log(9);
	piclife.getById(urljson.picid).then(doc=>{
		console.log(9);
		res.render('top/piclife/singlepic/singlepic.ejs', {'singlepic':doc});		
	});
})

module.exports = router;

