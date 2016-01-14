#!/bin/bash


curl -F "upload=@../../../client/images/td.jpg;filename=/home/kevin/project_c/xamazing/client/images/td.jpg;" http://localhost:3003/adminpush/
curl -F "upload=@../../../client/images/test.jpg;filename=/home/kevin/project_c/xamazing/client/images/test.jpg;" http://localhost:3003/adminpush/
curl -F "upload=@../../../client/images/sunrise1.jpg;filename=/home/kevin/project_c/xamazing/client/images/sunrise1.jpg;" http://localhost:3003/adminpush/
curl -F "upload=@../../../client/images/biyezhao1.jpg;filename=/home/kevin/project_c/xamazing/client/images/biyezhao1.jpg;" http://localhost:3003/adminpush/

./blogpushtest.sh
# { 
#	upload: 
#	   File {
#		     domain: null,
#		     _events: {},
#		     _eventsCount: 0,
#		     _maxListeners: undefined,
#		     size: 132991,
#		     path: '/home/kevin/project_c/xamazing/server/transport/tmpfiles/upload_eb88bdccc756c5f095971d69ffcc3f16.jpg',
#		     name: '/home/kevin/project_c/xamazing/client/images/td.jpg',
#		     type: 'image/jpeg',
#		     hash: null,
#		     lastModifiedDate: Wed Jan 13 2016 11:34:30 GMT+0800 (CST),
#		     _writeStream: 
#			    WriteStream {
	#		        _writableState: [Object],
	#		        writable: false,
	#		        domain: null,
	#		        _events: {},
	#		        _eventsCount: 0,
	#		        _maxListeners: undefined,
	#		        path: '/home/kevin/project_c/xamazing/server/transport/tmpfiles/upload_eb88bdccc756c5f095971d69ffcc3f16.jpg',
	#		        fd: null,
	#		        flags: 'w',
	#		        mode: 438,
	#		        start: undefined,
	#		        pos: undefined,
	#		        bytesWritten: 132991,
	#		        closed: true 
#	    		} 
#  		} 
#}
