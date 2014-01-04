"use strict";

// データベース、コレクションへの接続と定義
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var DeliverySchema = new Schema({
	lat: Number,
	lng: Number,
	address: String,
	date: Date
},
{ collection : 'deliveries'}
);

// 事前処理
DeliverySchema.pre('save', function(next){
	this.date = new Date();
	next();
});

// モデル化
console.log(mongoose);
mongoose.model('Delivery', DeliverySchema);

var Delivery;
mongoose.connect('mongodb://localhost/milkwaydb');

var db = mongoose.connection;
// error handling
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
	console.log("connect to db");
	Delivery = mongoose.model('Delivery');
});

exports.findAll = function(req, res) {
	console.log('Getting deliveries');
	Delivery.find({}, function(err, results) {
		if(err){
			res.send({'error': 'An error hs occurred'});
		}else{
			console.log('Success: Getting deliveries');
			res.json(results);
		}
	});
};

exports.show = function(req, res){
	Delivery.find({}, function(err, deliveries){
		res.render('delivery/list', {title: '配送先リスト', deliveries: deliveries});
	});
};

