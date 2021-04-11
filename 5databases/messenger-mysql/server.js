var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var mysql = require('mysql');

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "rootuser",
	database: "messenger"
});

con.connect(function(err) {
	if (err) throw err;
	console.log("Connected!");
	http.listen(80, function(){
		console.log("server started");
	});
});

app.get('/', function(req, res){
	res.sendFile(__dirname + "/index.html");
});
app.get('/messenger.js', function(req,res) {
	res.sendFile(__dirname + "/messenger.js");
});
app.get('/register.html', function(req,res) {
	res.sendFile(__dirname + "/register.html");
});

io.on('connection', function(socket) {
	socket.on("login", (username, password)=>{
		con.query("select id from users where username = ? and password = ?", [username, password], (err, res, fields)=> {
		if (err) throw err;
		if (res.length == 0) socket.emit("fail");
		else socket.emit("success", res[0].id);
		});
	});
	con.query("select username, content from messages join users on messages.sender_id = users.id;", (err, res, fields) => {
		if (err) throw err;
		let msg = res.map( (x) => {return {name: x.username, msg: x.content}} ); //funkciqta shte se izpylni wyrhu vseki element ot masiva i shte syzdade nov masiv
		socket.emit("init", msg); //iskame da zapazim syshtiq vid obekt kato predishniq kod
	});
	socket.on("msg", (id, username, message) => {
		con.query("insert into messages (sender_id, content) values (?, ?)", [id, message], (err, res, fields) => {
		if (err) throw err;
		});
		io.emit("msg", username, message);
	});
	socket.on("check", (myName, password) => {
		con.query("insert into users (username, password) values (?, ?)", [myName, password], (err, res, fields)=>{
			if (err) {
				alert("Username is taken.");
				throw err;
			}
			socket.emit("check", myName, password);
		});
	});
});