'use strict';

const argv = require('minimist')(process.argv.slice(2));
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const Promise = require('bluebird');

app.use(express.static('app'));

let collection;

let mongoConnect = Promise.promisify(MongoClient.connect);
let mongoPromise = mongoConnect('mongodb://localhost:27017/reviews')
	.then(function (db) {
		collection = db.collection('jacobReviews');
	});

app.get('/api', sendData);
function sendData(req, res) {
	collection.find().sort({ _id: -1 }).limit(1).toArray(function (err, data) {
		if (err) {
			return res.status(500).send(err);
		}

		res.send(data[0]);
	});
}

app.post('/api', bodyParser.json(), function (req, res) {
	let data = {
		name: req.body.name,
		review: req.body.review
	};

	collection.insert(data, function () {
		sendData(req, res);
	});
});

let serverPromise = Promise.promisify(app.listen.bind(app))(argv.port || 3000);

Promise.join(mongoPromise, serverPromise)
	.then(function () {
		console.log('Server started');
	})
	.catch(function () {
		console.log('Failed to start :(');
		process.exit(1);
	});
