const mongoose = require('mongoose')
require('dotenv').config()

let count = 0

// If you are using mongoose:
const ObjectId = mongoose.Types.ObjectId

ObjectId.prototype.valueOf = function () {
	return this.toString()
}


const options = {
	autoIndex: false, // Don't build indexes
	reconnectTries: 30, // Retry up to 30 times
	reconnectInterval: 500, // Reconnect every 500ms
	poolSize: 10, // Maintain up to 10 socket connections
	// If not connected, return errors immediately rather than waiting for reconnect
	bufferMaxEntries: 0,
	//geting rid off the depreciation errors
	useNewUrlParser: true,
	useUnifiedTopology: true
    
}
const connectWithRetry = () => {
	console.log('MongoDB connection with retry')
	mongoose.connect(process.env.MONGOURL, options).then(()=>{
		console.log('MongoDB is connected')
	}).catch(()=>{
		console.log('MongoDB connection unsuccessful, retry after 5 seconds.', ++count)
		setTimeout(connectWithRetry, 5000)
	})
}

connectWithRetry()

exports.mongoose = mongoose