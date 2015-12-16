'use strict';

var express = require('express');
var router = express.Router();

var inputCheck = require('../server/safe/inputcheck');


router.post('/push:type',(req, res, next)=>{

	let pushTypes = ['blog', 'pic', 'code', 'paper'];

	if( !inputCheck(req.params.type, standTypes) )
		return;
	let header = JSON.parse(req.body.header);

	let cond = {
		title:header.title,
		content:req.body.content
	};

	let blogclass = blog.creatblog(cond);
	blogclass.save(err=>{
		if( !err )
			res.send('ok');
	});
})

module.exports = router;

