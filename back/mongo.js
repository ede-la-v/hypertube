const express = require('express');

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017/hypertube';
const dbName = 'hypertube';

var db;

module.exports = {

	connect(callback) {
		MongoClient.connect(url, function(err, client) {
			if (err) throw err;
			console.log("Connected successfully to server");

			db = client.db(dbName);
			return callback(err);
		});
	},

	getDb() {
		return db;
	},

	getMongodb() {
		return mongodb;
	}
}
