const http = require('http');
const express = require('express');
const app = express();
const router = express.Router();
const logic = require("./logic.js");
const items = require("./items.js");
const lib = require("./lib.js");
const bodyParser = require("body-parser");

//				con = new SqlConnection("Data Source=161.53.18.102; User Id=Arduino; Password=grijanje; Initial Catalog=DataLogger");
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var config = {
	userName: "Arduino",
	password: "grijanje",
	server: "161.53.18.102",
	options: {
		database: "DataLogger",
		rowCollectionOnRequestCompletion: true
	}
};


var ws = require('ws');
var fs = require('fs');

const PORT = 9003;
const PORTGET = 7001;

items.things[13].value = 11;
items.things[14].value = 12;
items.things[15].value = 13;
items.things[16].value = 14;
// const PORTUDP = 8001;
// const dgram = require('dgram');
// const UDPServer = dgram.createSocket('udp4');
// UDPServer.bind (PORTUDP);

var options = {
	key: fs.readFileSync('/etc/nginx/ssl/nginx.key'),
	cert: fs.readFileSync('/etc/nginx/ssl/nginx.crt')
};
const https = require('https');
var httpsserver = https.createServer(options, app);

const mongodb = require('mongodb');
var mongoServer = new mongodb.Server("192.168.0.28", 27017);
//var mongoServer = new mongodb.Server ("localhost", 27017);
var db = new mongodb.Db("scada", mongoServer, {
	w: 1
});

var devices = {};

function dateToSql(d) {
	// yyyy-MM-dd HH:mm:ss
	d = d.toISOString();
	return ("'" + d.substring(0, 10) + ' ' + d.substring(11, 19) + "'");
}

db.open(function () {
	console.log("db opened");
});

router.use(bodyParser.urlencoded({
	extended: false
}));
router.use(bodyParser.json());
router.use(function (req, res, next) {
	if (!req.url.startsWith("/bb")) req.url = "/bb" + req.url;
	next();
})

router.get('/bb', function (req, res) {
	res.sendFile("./index.html", {
		root: __dirname
	});
})

// router.post('/bb/init', function (req, res) {
// 	var data = [],
// 		o;
// 	for (var i = 0; i < items.things.length; i++) {
// 		o = items.things[i];
// 		if (o.value != undefined) data.push({
// 			id: o.id,
// 			value: o.value
// 		});
// 	}
// 	res.json({
// 		data: data
// 	});
// });

router.post('/bb/data', function (req, res) {
	var id = parseInt(req.body.id);
	var column = parseInt(req.body.column);
	var fromDate = new Date(req.body.fromDate);
	var toDate = new Date(req.body.toDate);
	var source = req.body.source;

	console.log(id, fromDate, toDate);

	if (source == 'sql') {
		var connection = new Connection(config);
		connection.on("connect", function () {
			var sql = "EXEC GetEvents " + id + ", " + dateToSql(fromDate) + ", " + dateToSql(toDate);
			console.log(sql);
			var request = new Request(sql, function (err, rowCount, rows) {
				var data = [];
				for (var i = 0; i < rowCount - 1; i++) {
					if (id >= 60 && id <= 116)
						data.push({
							id: id,
							time: rows[i][0].value,
							value: rows[i][1].value / 10.
						});
					else
						data.push({
							id: id,
							time: rows[i][0].value,
							value: rows[i][1].value
						});
				}
				res.json({
					column: column,
					data: data
				});
			});
			connection.execSql(request);
		});
	} else { // mongo
		db.collection("Values").find({
			id: id,
			time: {
				$gte: fromDate,
				$lte: toDate
			}
		}).toArray(function (err, docs) {
			res.json({
				column: column,
				data: docs
			});
		});
	}
});

app.use(express.static('.'));
app.use('/', router);

var wssServer;
var wsServer;

var server = httpsserver.listen(PORT, function () {
	wssServer = new ws.Server({
		server: server
	});
	wssServer.on('connection', function (webSocket) {
		console.log('Secure client connected');
		logic.sendState(webSocket);
		webSocket.on('message', function (message) {
			var cmd = JSON.parse(message);
			logic.handle(cmd);
		});
		webSocket.on('close', function () {
			console.log('Secure client disconnected');
		});
	});
});

function sendToAll(command) {
	console.log(command);
	wssServer.clients.forEach(function each(client) {
		client.send(command);
	});
	wsServer.clients.forEach(function each(client) {
		client.send(command);
	});
}

// Server for GET requests
const url = require('url');

function hr(req, res) {
	console.log(req.url);
	var queryData = url.parse(req.url, true).query;
	save(queryData.idx, queryData.svalue);
	res.end();
}

function save(idx, value) {
	var o = items.things.findById(idx);
	if (o != null) {
		o.value = value;
		db.collection("Values").insertOne({
			id: o.id,
			time: new Date(),
			value: o.value
		});
		sendToAll ('{"type":"command","param":"udevice","idx":"{0}","svalue":"{1}"}'.format (idx, value));
	}
}

var s = http.createServer(hr);
s.listen(PORTGET, function () {
	wsServer = new ws.Server({
		server: s
	});
	wsServer.on('connection', function (webSocket) {
		console.log("Unsecure client connected");
		logic.sendState(webSocket);
		webSocket.on('message', function (message) {
			var cmd = JSON.parse(message);
			logic.handle(cmd);
		});
		webSocket.on('close', function () {
			console.log('Unsecure client disconnected');
		});
	});
});

lib.initLib();
exports.sendToAll = sendToAll;
exports.db = db;
exports.save = save;