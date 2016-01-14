'use strict';

var express = require('express');
var router = express.Router();
var fs = require('fs');
var formidable = require('formidable');
var path = require('path');
var inputCheck = require('../server/safe/inputcheck');
var Recv = require('../server/transport');

router.post('/', (req, res, next) => {
    Recv.recvfile(req).then(doc=>{
        res.send('sd');
    });
})

module.exports = router;
