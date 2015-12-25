"use strict";

let mongoose = require('mongoose');
let assert = require('assert');
let inputCheck = require('../safe/inputcheck');

mongoose.connect('mongodb://localhost/blogs');


var blogtxt = new mongoose.Schema({
    id: Number,
    title: String,
    content: String,
    createtime: {
        type: Date,
        default: new Date()
    },
    author: {
        type: String,
        default: 'Kevin'
    }
});

var comment = new mongoose.Schema({
    id: Number,
    targetid: Number,
    content: String,
    createtime: {
        type: Date,
        default: new Date()
    },
    author: {
        type: String,
        default: 'none'
    },
})

var piclife = new mongoose.Schema({
    id: Number,
    title: String,
    content: String,
    path: Array,
    createtime: {
        type: Date,
        default: new Date()
    },
    author: {
        type: String,
        default: 'Kevin'
    }
});

let blogTxt = mongoose.model('Blogtxt', blogtxt);
let picLife = mongoose.model('Piclife', piclife, 'piclifes');
let comMent = mongoose.model('Comment', comment);


let keyType = {
    "blog": {
        "id": "Number",
        "title": "String",
        "content": "String",
        "createtime": "Date",
        "author": "String"
    },
    "pic": {
        "id": "Number",
        "title": "String",
        "content": "String",
        "createtime": "Date",
        "author": "String",
        "path": "Array"
    },
    "comment": {
        "id": "Number",
        "targetid": "Number",
        "content": "String",
        "createtime": "Date",
        "author": "String"
    }
}


let __getHandle = function(mongoType) {
    switch (mongoType) {
        case 'blog':
            return blogTxt;
            break;
        case 'pic':
            return picLife;
            break;
        case 'comment':
            return comMent;
            break;
        default:
            throw new Error('mongoType is err!');
            break;
    }
}
var __hangding = function(mongoType, data) {
/*    for (let key in data){
        if(!keyType[mongoType][key])
            delete data[key];
    }*/
    for (let j in keyType[mongoType]) {
        if (typeof data[j] === 'undefined') {
            switch (keyType[mongoType][j]) {
                case 'String':
                    data[j] = '';
                    break;
                case 'Date':
                    data[j] = new Date();
                    break;
                case 'Number':
                    data[j] = 0;
                    break;
                case 'Array':
                    data[j] = [];
                    break;
                case 'Object':
                    data[j] = {};
                    break;
                default:
                    break;
            }
        }
    }
    return data;
}


let handingDoc = function(doc, type) {
    let isArray = inputCheck.isType('Array');
    if (isArray(doc)) {
        let newDoc = [];
        for (let j of doc) {
            newDoc.push(__hangding(type, j));
        }
        return newDoc;
    } else {
        return __hangding(type, doc);
    }
}

class MongoExtract {
    constructor(mongoType) {
        this.type = mongoType;
        this.handle = __getHandle(mongoType);
    }

    dealResult(err, doc, callback) {
        if (err) {
            logger.error(err);
            callback([]);
        } else {
            doc = handingDoc(doc, this.type);
            callback(doc);
        }
    }

    getDocByCond(cond, callback) {
        this.handle.find(cond).sort({
            '_id': '-1'
        }).exec((err, doc) => {
            this.dealResult(err, doc, callback);
        });
    }

    getDocIndex(indexBegin, docCount, callback) {
        debugger;
        this.handle.find().sort({
            '_id': '-1'
        }).skip(indexBegin).limit(docCount).exec((err, doc) => {
            debugger;
            this.dealResult(err, doc, callback);
        });
    }
}

class MongoSave {
    constructor(mongoType, doc) {
        this.type = mongoType;
        this.handle = __getHandle(mongoType);
        this.doc = handingDoc(doc);
    }

    save(callback) {
        let extract = new MongoExtract(this.type);
        extract.getDocIndex(0, 1, doc => {
            doc = doc[0];
            if (doc)
                this.doc.id = Number(doc.id) + 1;
            else
                this.doc.id = 10000001;
            this.doc.createtime = new Date();
            let finaldoc = new this.handle(this.doc);
            finaldoc.save(err => {
                if (err)
                    logger.error('when create new ' + this.type + ' mongo , ' + err);
                if(callback)
                    callback(err);
            });
        });
    }
}



exports.createMongoExtract = function(type) {
    return new MongoExtract(type);
}

exports.createMongoSave = function(type, doc) {
    return new MongoSave(type, doc);
}
