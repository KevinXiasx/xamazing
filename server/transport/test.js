

emitter.on('comepic', msg=>{
	console.log('one');
	console.log(msg);
});

emitter.emit('comepic', 'hello', 'world')
emitter.emit('comepic', 'hello2', 'world2')