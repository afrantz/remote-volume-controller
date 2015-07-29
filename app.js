var express = require('express');
var bodyParser = require('body-parser');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var socket = require('./app/socket.js');

var port = process.env.PORT || 3000;
var env = process.env.NODE_ENV;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

if (env == 'development')
    app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
else if (env == 'production')
    app.use(express.errorHandler());

app.get('*', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', socket);

server.listen(port, function() {
    console.log("Server listening on port %d in %s mode", port, app.settings.env);
});