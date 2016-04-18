const express = require('express');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI || 'localhost:27017')

const hookRouter = require(__dirname + '/routes/hook-routes');

const app = express();

app.use('/hook', hookRouter);

app.listen(process.env.PORT || 3000, function(){
	console.log('Server live on port ');
})