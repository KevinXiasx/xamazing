'use strict';



class InputCheck{

	isType(typeName) {
		return function (obj) {
			return Object.prototype.toString.call(obj) === '[object '+typeName+']';
		}
	}

	isInArray(inobj, enumArray){
		var isArray = isType(Array);
		if( !isArray(enumArray) )
			throw new Error('type checkout err');
		let result = false;
		for (var i = 0; i < enumArray.length; i++) {
			if( inobj === enumArray[i] ){
				result = true;
				break;
			}
		}
		return result;
	}
}



module.exports = new InputCheck();