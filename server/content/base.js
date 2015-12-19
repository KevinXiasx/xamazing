'use strict';

let mongo = require('../mongo/mongo');
let co = require('co');
let inputCheck = require('../safe/inputcheck');
class BaseContent {
    constructor(type) {
        this.extracter = mongo.createMongoExtract(type);
        this.type = type;
        this.deal = function(doc, opt) {
            return doc;
        };
    }

    getCurrent(size, opt) {
        return new Promise(resolve => {
            console.log(size);
            this.extracter.getDocIndex(0, size, doc => {
                console.log(doc);
                resolve(this.deal(doc, opt));
            });
        });
    }

    getRang(from, size, opt) {
        return new Promise(resolve => {
            this.extracter.getDocIndex(from, size, doc => {
                resolve(this.deal(doc, opt));
            });
        });
    }

    search(cond, opt) {
        return new Promise(resolve => {
            this.extracter.getDocByCond(cond, doc => {
                resolve(this.deal(doc, opt));
            });
        });
    }

    getById(id, opt) {
        return new Promise(resolve => {
            var isNumber = inputCheck.isType('Number');
            var isString = inputCheck.isType('String');
            if (isString(id))
                id = parseInt(id);
            if (isNumber(id) && !Number.isNaN(id)) {
                this.extracter.getDocByCond({
                    'id': id
                }, doc => {
                    resolve(this.deal(doc, opt));
                });
            } else
                throw new Error('id type err');
        });
    }

    add(content) {
        return new Promise(resolve => {
            let saver = mongo.createMongoSave(this.type, content);
            saver.save();
        });
    }
}

module.exports = BaseContent;
