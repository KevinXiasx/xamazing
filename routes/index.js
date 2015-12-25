'use strict';

var express = require('express');
var router = express.Router();
var Blog = require('../server/content/blog');
var Piclife = require('../server/content/pic')
let url = require('url');

/* GET home page. */ 
router.get('/', function(req, res, next) {
	let guard = 0;
	let blogs, pic;
	Piclife.getCurrent(3).then(doc=>{
		pic = doc;
		if( ++guard == 2 )
			res.render('top/index.ejs',{'blog':blogs, 'piclife':pic});
	});

	Blog.getCurrent(4).then(doc=>{
		blogs = doc;
		if( ++guard == 2 ) 
			res.render('top/index.ejs',{'blog':blogs, 'piclife':pic});
	})
});

router.get('/blog', (req, res, next)=>{
	Blog.getRang(0, 10).then(doc=>{
		res.render('top/blog/blog.ejs', {'blog':doc});
	});
})

router.get('/singleblog', (req, res, next)=>{
	let urljson = url.parse(req.url, true).query;
	if( /\D/.test(urljson.blogid))
		return ;
	Blog.getById(urljson.blogid).then(doc=>{
		res.render('top/blog/singleblog/singleblog.ejs', {'blog':doc});		
	})
})

router.get('/piclife', (req, res, next)=>{
	Piclife.getCurrent(5).then(doc=>{
		res.render('top/piclife/piclife.ejs', {'piclife':doc});
	});
})

router.get('/singlepic', (req, res, next)=>{
	let urljson = url.parse(req.url, true).query;
	if( /\D/.test(urljson.picid))
		return ;
	Piclife.getById(urljson.picid).then(doc=>{
		res.render('top/piclife/singlepic/singlepic.ejs', {'singlepic':doc});		
	});
})

module.exports = router;

